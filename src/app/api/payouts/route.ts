import { NextResponse } from 'next/server';
import { payoutService } from '@/lib/services/payoutService';

export async function GET() {
  try {
    const data = await payoutService.getMyPayouts();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
