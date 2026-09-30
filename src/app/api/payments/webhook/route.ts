import { NextResponse } from 'next/server';
import { paymentService } from '@/lib/services/paymentService';
import { requireFeature } from "@/lib/feature-flags";

export async function POST(req: Request) {
  try {
    const guard = await requireFeature("payments_webhook");
    if (guard) return guard;
    const body = await req.json();
    const { paymentId, status, transactionId } = body;

    if (!paymentId || !status) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    const payment = await paymentService.handleWebhook(paymentId, status, transactionId);
    return NextResponse.json({ success: true, payment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
