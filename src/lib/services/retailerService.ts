import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import type { Product } from "@/types/product";
import type { Order } from "@/types/order";

export interface CreateOrderInput {
  supplier_profile_id: string;
  retailer_profile_id: string;
  buyer_name: string;
  delivery_address: string;
  total: number;
  commission: number;
  order_number: string;
  items: Array<{
    product_id: string;
    name: string;
    unit_price: number;
    quantity: number;
  }>;
}

export const retailerService = {
  async getAvailableProducts(): Promise<Product[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "متوفر")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Retailer: Error fetching products", error);
      throw new Error("فشل في جلب المنتجات");
    }
    return data as Product[];
  },

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const supabase = await createClient();

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        order_number: input.order_number,
        status: "reviewing",
        payment_status: "pending",
        total: input.total,
        commission: input.commission,
        buyer_name: input.buyer_name,
        delivery_address: input.delivery_address,
        retailer_profile_id: input.retailer_profile_id,
        supplier_profile_id: input.supplier_profile_id,
      })
      .select()
      .single();

    if (orderErr || !order) {
      logger.error("Retailer: createOrder failed", orderErr);
      throw new Error(orderErr?.message || "فشل إنشاء الطلب");
    }

    const itemsPayload = input.items.map((it) => ({
      order_id: order.id,
      product_id: it.product_id,
      name: it.name,
      unit_price: it.unit_price,
      quantity: it.quantity,
    }));

    const { error: itemsErr } = await supabase.from("order_items").insert(itemsPayload);
    if (itemsErr) {
      logger.error("Retailer: order_items insert failed", itemsErr);
    }

    return order as Order;
  },

  async getMyOrders(): Promise<Order[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("retailer_profile_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data as Order[];
  },
};
