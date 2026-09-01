import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import type { Product, ProductInput } from "@/types/product";

export const wholesaleService = {
  // إضافة منتج جديد للبيع بالجملة (خاص بجملة)
  async createProduct(input: ProductInput): Promise<Product> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("products")
      .insert({ ...input, owner_id: user.id })
      .select()
      .single();

    if (error) {
      logger.error("Wholesale: Error creating product", error);
      throw new Error(error.message);
    }
    return data as Product;
  },

  // جلب منتجاتي فقط (المخزون الخاص بي)
  async getMyProducts(): Promise<Product[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data as Product[];
  },

  // تعديل المخزون
  async updateStock(productId: string, stock: number): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({ stock })
      .eq("id", productId);

    if (error) throw new Error(error.message);
  },

  // قبول طلب من تاجر التجزئة
  async acceptOrder(orderId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .update({ status: "processing" })
      .eq("id", orderId);
      
    if (error) throw new Error(error.message);
  }
};
