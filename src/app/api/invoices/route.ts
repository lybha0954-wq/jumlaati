import { NextResponse } from 'next/server';
import { orderService } from '@/lib/services/orderService';

export async function GET() {
  try {
    const orders = await orderService.getAll();
    const invoices = orders.map((o) => ({
      id: `inv-${o.id}`,
      orderId: o.id,
      orderNumber: o.orderNumber,
      total: o.total,
      commission: o.commission,
      status: o.paymentStatus,
      createdAt: o.placedAt,
    }));
    return NextResponse.json(invoices);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
