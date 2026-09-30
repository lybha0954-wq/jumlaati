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

    // Enrich with counts
    const users = await Promise.all((data || []).map(async (u: any) => {
      let count = 0;
      try {
        if (u.role === 'supplier') {
          const { count: c } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('supplier_id', u.id);
          count = c || 0;
        } else if (u.role === 'retailer') {
          const { count: c } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('retailer_id', u.id);
          count = c || 0;
        } else if (u.role === 'delivery') {
          const { count: c } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('delivery_id', u.id);
          count = c || 0;
        }
      } catch {}
      return { ...u, items_count: count };
    }));

    return NextResponse.json(users);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
