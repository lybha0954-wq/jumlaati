import { NextResponse } from 'next/server';
import { transactionService } from '@/lib/services/transactionService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const transactions = userId
      ? await transactionService.getByRetailer(userId)
      : await transactionService.getAll();
    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await transactionService.create(body);
    if (!created) {
      return NextResponse.json({ error: 'Failed to record transaction' }, { status: 400 });
    }
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
