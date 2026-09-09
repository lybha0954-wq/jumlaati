import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // التحقق مما إذا كان أدمن ليرى الكل، أو تاجر ليرى طلباته فقط
    const { data: adminCheck } = await supabase.from('users').select('role').eq('id', user.id).single();
    const isAdmin = adminCheck?.role === 'admin';

    let query = supabase.from('refunds').select('*, orders(address, total)').order('created_at', { ascending: false });
    if (!isAdmin) query = query.eq('requested_by', user.id);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { orderId, reason } = await req.json();
    const { data, error } = await supabase
      .from('refunds')
      .insert({ order_id: orderId, requested_by: user.id, reason })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
