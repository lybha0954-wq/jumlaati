import { NextResponse } from 'next/server';
import { offerService } from '@/lib/services/offerService';

export async function GET() {
  try {
    const data = await offerService.getActiveOffers();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
