import { NextResponse } from 'next/server';
import { relationshipService } from '@/lib/services/relationshipService';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // جلب الطلبات المعلقة الخاصة بالمستخدم الحالي (سواء كان جملة أو تجزئة أو توصيل)
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
    
    // التحقق من إرسال أحد الأطراف
    if (!wholesalerId && !retailerId && !deliveryId) {
      return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });
    }

    // إرسال الطلب
    const relationship = await relationshipService.sendRequest({ wholesalerId, retailerId, deliveryId });
    return NextResponse.json(relationship, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
