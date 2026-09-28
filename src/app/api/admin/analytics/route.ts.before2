import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: adminCheck } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    if (adminCheck?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: orders } = await supabase
      .from('orders')
      .select('total, created_at, status')
      .gte('created_at', sixMonthsAgo.toISOString());

    const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const monthly: Record<string, { name: string; value: number }> = {};

    (orders || []).forEach((o) => {
      const d = new Date(o.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!monthly[key]) monthly[key] = { name: monthNames[d.getMonth()], value: 0 };
      monthly[key].value += Number(o.total) || 0;
    });

    const chartData = Object.values(monthly).slice(-6);
    const totalOrders = orders?.length || 0;
    const totalRevenue = (orders || []).reduce((s, o) => s + Number(o.total), 0);

    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      chartData,
      stats: { totalOrders, totalRevenue, usersCount: usersCount || 0 },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
