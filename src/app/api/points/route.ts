import { NextResponse } from 'next/server';
import { pointsService } from '@/lib/services/pointsService';

export async function GET() {
  try {
    const data = await pointsService.getMyPoints();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
