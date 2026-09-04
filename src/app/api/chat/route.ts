import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { chatService } from '@/lib/services/chatService';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // إذا تم تمرير userId، نجلب المحادثة بين الطرفين
    if (userId) {
      const messages = await chatService.getConversation(userId);
      return NextResponse.json(messages);
    }

    // إذا لم يتم تمرير userId، نجلب قائمة جهات الاتصال المحتملة
    const { data: contacts, error } = await supabase
      .from('users')
      .select('id, name, role')
      .neq('id', user.id)
      .order('name', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(contacts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { receiverId, message } = await req.json();
    const chat = await chatService.sendMessage(receiverId, message);
    return NextResponse.json(chat, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
