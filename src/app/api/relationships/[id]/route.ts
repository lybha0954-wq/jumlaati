import { NextResponse } from 'next/server';
import { relationshipService } from '@/lib/services/relationshipService';
import { requireUser } from '@/lib/api/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireUser();
  if (error || !user) return error!;

  try {
    const { id } = await params;
    const { action } = await req.json();

    if (action === 'accept') await relationshipService.acceptRequest(id);
    else if (action === 'reject') await relationshipService.rejectRequest(id);
    else return NextResponse.json({ error: 'Action invalid' }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
