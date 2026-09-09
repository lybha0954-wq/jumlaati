import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { loginSchema } from '@/lib/validations/auth.schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.parse(body);
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.email,
      password: parsed.password,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 401 });

    return NextResponse.json({ user: data.user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 });
  }
}
