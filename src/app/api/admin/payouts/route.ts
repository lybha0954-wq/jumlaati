import { NextResponse } from 'next/server';
import { payoutService } from '@/lib/services/payoutService';
import { requireRole } from '@/lib/api/auth';

export async function GET() {
  const { error } = await requireRole(['admin']);
  if (error) return error;

  try {
    const data = await payoutService.getAllPayouts();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const { error } = await requireRole(['admin']);
  if (error) return error;

  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing id or status' },
        { status: 400 }
      );
    }

    const data = await payoutService.updateStatus(id, status);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
