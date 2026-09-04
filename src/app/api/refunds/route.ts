import { NextResponse } from 'next/server';
import { refundService } from '@/lib/services/refundService';

export async function GET() {
  try {
    const data = await refundService.getMyRefunds();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { orderId, reason } = await req.json();
    const data = await refundService.createRefund(orderId, reason);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
