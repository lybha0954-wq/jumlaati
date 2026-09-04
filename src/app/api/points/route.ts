import { NextResponse } from 'next/server';
import { walletService } from '@/lib/services/walletService';

export async function GET() {
  try {
    const data = await walletService.getMyPoints();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
