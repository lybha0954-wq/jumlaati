import { NextResponse } from 'next/server';
import { relationshipService } from '@/lib/services/relationshipService';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { action } = body; // 'accept' أو 'reject'

    if (action === 'accept') {
      await relationshipService.acceptRequest(params.id);
    } else if (action === 'reject') {
      await relationshipService.rejectRequest(params.id);
    } else {
      return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
