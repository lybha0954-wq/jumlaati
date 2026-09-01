import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/types/order";

export const deliveryService = {
  // جلب المهام المتاحة أو المسندة إلي
  async getMyTasks(): Promise<Order[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("delivery_id", user.id) // الطلبات المسندة لهذا المندوب
      .or("status.eq.shipped,status.eq.pending");

    if (error) throw new Error(error.message);
    return data as Order[];
  },

  // تحديث حالة التوصيل
  async updateDeliveryStatus(orderId: string, status: "shipped" | "delivered") {
    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) throw new Error(error.message);
  }
};
