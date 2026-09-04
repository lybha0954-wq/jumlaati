import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import type { Product, ProductInput } from "@/types/product";

export const wholesaleService = {
  // إضافة منتج جديد
  async createProduct(input: ProductInput): Promise<Product> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("products")
      .insert({ ...input, owner_id: user.id, is_active: true })
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
    const supabase = await createClient();
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

  // تعديل المخزون أو المنتج
  async updateProduct(productId: string, updates: Partial<ProductInput>): Promise<Product> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", productId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Product;
  },

  // حذف منتج
  async deleteProduct(productId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) throw new Error(error.message);
  }
};
