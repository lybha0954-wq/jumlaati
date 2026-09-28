import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { notificationService } from '@/lib/services/notificationService';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    // الأمان: لا يُسمح بإرسال إشعارات لمستخدمين آخرين
    // يُستخدم فقط لإشعار النفس (مثلاً: تأكيد)
    if (body.userId && body.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await notificationService.sendInApp({
      userId: user.id,
      type: body.type || 'system',
      title: body.title,
      message: body.message,
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'فشل إرسال الإشعار' }, { status: 400 });
  }
}
