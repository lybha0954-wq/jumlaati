import { NextResponse } from 'next/server';
import { chatService } from '@/lib/services/chatService';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const otherUserId = searchParams.get('userId');
  if (!otherUserId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

  try {
    const data = await chatService.getConversation(otherUserId);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { receiverId, message } = await req.json();
    const data = await chatService.sendMessage(receiverId, message);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
