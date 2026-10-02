import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json([], { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone, role, business_name, governorate, is_active, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[api/admin/users] error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const allUsers = data || [];

    // ═══ إصلاح N+1: 3 استعلامات ثابتة بدل N+1 ═══
    const supplierIds = allUsers.filter((u: any) => u.role === 'supplier').map((u: any) => u.id);
    const retailerIds = allUsers.filter((u: any) => u.role === 'retailer').map((u: any) => u.id);
    const deliveryIds = allUsers.filter((u: any) => u.role === 'delivery').map((u: any) => u.id);

    const [productsRes, ordersRetailerRes, ordersDeliveryRes] = await Promise.all([
      supplierIds.length > 0
        ? supabase.from('products').select('supplier_id').in('supplier_id', supplierIds)
        : Promise.resolve({ data: [] as any[] }),
      retailerIds.length > 0
        ? supabase.from('orders').select('retailer_id').in('retailer_id', retailerIds)
        : Promise.resolve({ data: [] as any[] }),
      deliveryIds.length > 0
        ? supabase.from('orders').select('delivery_id').in('delivery_id', deliveryIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const countBy = (rows: any[], key: string) => {
      const map: Record<string, number> = {};
      (rows || []).forEach((r: any) => {
        const v = r[key];
        if (v) map[v] = (map[v] || 0) + 1;
      });
      return map;
    };

    const supplierCounts = countBy(productsRes.data || [], 'supplier_id');
    const retailerCounts = countBy(ordersRetailerRes.data || [], 'retailer_id');
    const deliveryCounts = countBy(ordersDeliveryRes.data || [], 'delivery_id');

    const users = allUsers.map((u: any) => {
      let count = 0;
      if (u.role === 'supplier') count = supplierCounts[u.id] || 0;
      else if (u.role === 'retailer') count = retailerCounts[u.id] || 0;
      else if (u.role === 'delivery') count = deliveryCounts[u.id] || 0;
      return { ...u, items_count: count };
    });

    return NextResponse.json(users);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
