import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { loginSchema } from '@/lib/validations/auth.schema';
import { authService } from '@/lib/services/authService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.parse(body);

    // استخدام الخدمة الذكية لتحديد البريد أو الهاتف
    const data = await authService.login(parsed.identifier, parsed.password);

    return NextResponse.json({ user: data.user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'بيانات غير صالحة' }, { status: 400 });
  }
}
