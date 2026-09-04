import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // التحقق من أنه أدمن
    const { data: adminCheck } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (adminCheck?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { status } = await req.json(); // 'approved' أو 'rejected'
    const { data, error } = await supabase
      .from('refunds')
      .update({ status })
      .eq('id', params.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
