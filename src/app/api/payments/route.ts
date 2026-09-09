import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { paymentService } from '@/lib/services/paymentService';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { orderId, amount, gateway } = await req.json();
    if (!orderId || !amount) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    const payment = await paymentService.createPayment(orderId, amount, gateway || "cod");
    return NextResponse.json({ success: true, payment, gateway: gateway || "cod" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
