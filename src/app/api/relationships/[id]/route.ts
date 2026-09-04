import { NextResponse } from 'next/server';
import { relationshipService } from '@/lib/services/relationshipService';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action } = body;

    if (action === 'accept') await relationshipService.acceptRequest(id);
    else if (action === 'reject') await relationshipService.rejectRequest(id);
    else return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
