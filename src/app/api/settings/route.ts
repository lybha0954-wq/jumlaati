import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export async function GET() {
  const { data, error } = await sb.from('app_settings').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
export async function PATCH(req: Request) {
  const body = await req.json();
  const { key, value } = body;
  if (!key || !value) return NextResponse.json({ error: 'Missing key or value' }, { status: 400 });
  const { data, error } = await sb.from('app_settings').update({ value }).eq('key', key).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
