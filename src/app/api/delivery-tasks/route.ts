import { NextResponse } from 'next/server';
import { orderService } from '@/lib/services/orderService';

export async function GET() {
  try {
    const orders = await orderService.getAll();
    const tasks = orders
      .filter((o) => o.status === 'delivering' || o.status === 'pending')
      .map((o) => ({
        id: `task-${o.id}`,
        orderId: o.id,
        orderNumber: o.orderNumber,
        buyer: o.buyer,
        delivery: o.delivery,
        total: o.total,
        status: o.status,
      }));
    return NextResponse.json(tasks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { orderId, status } = await req.json();
    if (orderId && status) {
      await orderService.updateStatus(orderId, status);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
