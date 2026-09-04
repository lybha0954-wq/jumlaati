import { NextResponse } from 'next/server';
import { phoneAuthService } from '@/lib/services/phoneAuthService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, phone, token } = body;

    if (action === 'send') {
      await phoneAuthService.sendOtp(phone);
      return NextResponse.json({ success: true, message: 'تم إرسال رمز التحقق' });
    }

    if (action === 'verify') {
      const data = await phoneAuthService.verifyOtp(phone, token);
      return NextResponse.json({ user: data.user });
    }

    return NextResponse.json({ error: 'Action not found' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
