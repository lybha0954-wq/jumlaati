import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { orchestrationService } from '@/lib/services/orchestrationService';
import { createOrderSchema } from '@/lib/validations/order.schema';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createOrderSchema.parse(body);

    const order = await orchestrationService.createFullOrder({
      retailerId: user.id,
      retailerEmail: user.email,
      items: parsed.items,
      address: parsed.address,
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'فشل إنشاء الطلب' }, { status: 400 });
  }
}
