import { NextResponse } from 'next/server';
import { commissionService } from '@/lib/services/commissionService';

export async function POST(req: Request) {
  try {
    const { orderTotal } = await req.json();
    const commission = await commissionService.calculateCommission(orderTotal);
    return NextResponse.json({ commission }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في الحساب' }, { status: 400 });
  }
}
