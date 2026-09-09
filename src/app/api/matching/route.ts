import { NextResponse } from 'next/server';
import { matchingService } from '@/lib/services/matchingService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const match = await matchingService.createMatchRequest(body);
    return NextResponse.json(match, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'خطأ في إنشاء طلب المطابقة' }, { status: 400 });
  }
}
