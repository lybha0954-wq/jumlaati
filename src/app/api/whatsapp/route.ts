import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { whatsappService } from '@/lib/services/whatsappService';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { orderId } = body;

    // جلب تفاصيل الطلب
    const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", orderId).single();
    if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

    // جلب رقم هاتف تاجر الجملة
    const phone = await whatsappService.getPhoneById(order.wholesaler_id);
    if (!phone) return NextResponse.json({ error: 'No phone number found' }, { status: 404 });

    // جلب عناصر الطلب
    const { data: items } = await supabase.from("order_items").select("*").eq("order_id", orderId);

    // بناء الرسالة
    const message = whatsappService.buildOrderMessage(order, items || [], order.total);

    // رابط واتساب
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

    return NextResponse.json({ url: whatsappUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
