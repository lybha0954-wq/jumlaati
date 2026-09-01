import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import type { Product } from "@/types/product";
import type { Order } from "@/types/order";

export const retailerService = {
  // جلب المنتجات المتاحة للشراء (لا يملك صلاحية إنشائها)
  async getAvailableProducts(): Promise<Product[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "active") // فقط المنتجات النشطة
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Retailer: Error fetching products", error);
      throw new Error("فشل في جلب المنتجات");
    }
    return data as Product[];
  },

  // إنشاء طلب شراء جديد (خاص بالتاجر)
  async createOrder(orderData: any): Promise<Order> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("orders")
      .insert({ ...orderData, user_id: user.id, status: "pending" })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Order;
  },

  // جلب طلباته الخاصة فقط
  async getMyOrders(): Promise<Order[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data as Order[];
  }
};
