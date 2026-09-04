import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: Request, { params }: { params: Promise<{ di: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: adminCheck } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (adminCheck?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { di } = await params;
  const body = await req.json();
  const { data, error } = await supabase.from('users').update(body).eq('id', di).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
