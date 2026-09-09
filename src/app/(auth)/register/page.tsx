import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { registerSchema } from '@/lib/validations/auth.schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.parse(body);
    const supabase = await createClient(); // تعديل

    const { data, error } = await supabase.auth.signUp({
      email: parsed.email,
      password: parsed.password,
      options: { data: { name: parsed.name, role: parsed.role } },
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ user: data.user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 });
  }
}
