import { NextResponse } from 'next/server';
import { orchestrationService } from '@/lib/services/orchestrationService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // استدعاء خدمة التنسيق لإنشاء الطلب كاملاً (طلب + عمولة + خصم مخزون + إشعار)
    const order = await orchestrationService.createFullOrder(body);
    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'فشل إنشاء الطلب' }, { status: 400 });
  }
}
