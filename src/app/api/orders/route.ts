import { NextResponse } from 'next/server';
import { orderService } from '@/lib/services/orderService';

export async function GET() {
  try {
    const orders = await orderService.getAll();
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await orderService.create(body);
    if (!created) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 400 });
    }
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
