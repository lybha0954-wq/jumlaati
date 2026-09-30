import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireFeature } from "@/lib/feature-flags";

export async function GET() {
  try {
    const guard = await requireFeature("refunds");
    if (guard) return guard;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).maybeSingle();
    const isAdmin = profile?.role === 'admin';

    let query = supabase
      .from('refunds')
      .select('*')
      .order('created_at', { ascending: false });

    if (!isAdmin) query = query.eq('requested_by', user.id);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // إرفاق بيانات الطلبات والمستخدمين
    const orderIds = [...new Set((data || []).map((r: any) => r.order_id).filter(Boolean))];
    const userIds = [...new Set((data || []).map((r: any) => r.requested_by).filter(Boolean))];

    const [ordersRes, profilesRes] = await Promise.all([
      orderIds.length ? supabase.from('orders').select('id, order_number, total_amount').in('id', orderIds) : Promise.resolve({ data: [] }),
      userIds.length ? supabase.from('profiles').select('id, full_name').in('id', userIds) : Promise.resolve({ data: [] }),
    ]);

    const orderMap = new Map((ordersRes.data || []).map((o: any) => [o.id, o]));
    const profileMap = new Map((profilesRes.data || []).map((p: any) => [p.id, p]));

    const enriched = (data || []).map((r: any) => ({
      ...r,
      order_number: (orderMap.get(r.order_id) as any)?.order_number || null,
      order_total: (orderMap.get(r.order_id) as any)?.total_amount || null,
      requester_name: (profileMap.get(r.requested_by) as any)?.full_name || "مستخدم",
    }));

    return NextResponse.json(enriched);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const guard = await requireFeature("refunds");
    if (guard) return guard;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { orderId, amount, reason } = await req.json();
    if (!orderId || !amount) {
      return NextResponse.json({ error: 'orderId + amount مطلوبان' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('refunds')
      .insert({
        order_id: Number(orderId),
        amount: Number(amount),
        reason: reason || null,
        status: 'pending',
        requested_by: user.id,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
