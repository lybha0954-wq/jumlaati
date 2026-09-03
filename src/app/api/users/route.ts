import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const supabase = await createClient(); // تعديل
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    if (!role) return NextResponse.json({ error: 'Role is required' }, { status: 400 });

    const { data, error } = await supabase.from('users').select('*').eq('role', role);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
