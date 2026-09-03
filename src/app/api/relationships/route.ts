import { NextResponse } from 'next/server';
import { relationshipService } from '@/lib/services/relationshipService';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient(); // تعديل
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const pendingRequests = await relationshipService.getPendingRequests();
    return NextResponse.json(pendingRequests);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { wholesalerId, retailerId, deliveryId } = body;
    if (!wholesalerId && !retailerId && !deliveryId) return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });

    const relationship = await relationshipService.sendRequest({ wholesalerId, retailerId, deliveryId });
    return NextResponse.json(relationship, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
