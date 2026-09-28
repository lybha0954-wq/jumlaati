import { NextResponse } from 'next/server';
import { relationshipService } from '@/lib/services/relationshipService';
import { requireUser } from '@/lib/api/auth';

export async function GET() {
  const { user, error } = await requireUser();
  if (error || !user) return error!;

  try {
    const pending = await relationshipService.getPendingRequests();
    return NextResponse.json(pending);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { user, error } = await requireUser();
  if (error || !user) return error!;

  try {
    const body = await req.json();
    const { supplierId, retailerId } = body;
    if (!supplierId && !retailerId) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }
    const rel = await relationshipService.sendRequest({ supplierId, retailerId });
    return NextResponse.json(rel, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
