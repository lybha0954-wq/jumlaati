import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/types/order";

export const orderService = {
  // عرض تفاصيل طلب واحد
  async getOrderById(id: string): Promise<Order> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error("الطلب غير موجود");
    return data as Order;
  },

  // جلب الطلبات من منظور الأدمن (كل الطلبات)
  async getAllOrders(): Promise<Order[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data as Order[];
  }
};
