import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { retailerService } from '@/lib/services/retailerService';
import { commissionService } from '@/lib/services/commissionService';
import { notificationService } from '@/lib/services/notificationService';
import { createOrderSchema } from '@/lib/validations/order.schema';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 });

    const body = await req.json();
    const parsed = createOrderSchema.parse(body);

    // تجميع العناصر حسب تاجر الجملة
    const groupedItems: { [wholesalerId: string]: typeof parsed.items } = {};
    for (const item of parsed.items) {
      if (!groupedItems[item.wholesalerId]) groupedItems[item.wholesalerId] = [];
      groupedItems[item.wholesalerId].push(item);
    }

    const retailerId = user.id;
    const createdOrders = [];

    // إنشاء طلب منفصل لكل جملة
    for (const [wholesalerId, items] of Object.entries(groupedItems)) {
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const order = await retailerService.createOrder({
        user_id: retailerId,
        wholesaler_id: wholesalerId,
        items: items,
        total: total,
        address: parsed.address,
      });

      // إنشاء العمولة
      await commissionService.createCommission(order.id, retailerId, total);

      // إرسال إشعار لتاجر الجملة
      await notificationService.notify({
        userId: wholesalerId,
        type: "order",
        title: "طلب جديد من تاجر تجزئة!",
        message: `طلب بقيمة ${total.toLocaleString()} د.ع بانتظار معالجتك.`,
      });

      createdOrders.push(order);
    }

    return NextResponse.json({ success: true, orders: createdOrders }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'فشل إنشاء الطلب' }, { status: 400 });
  }
}
