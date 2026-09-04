import { createClient } from "@/lib/supabase/server";

import type { Product, ProductInput } from "@/types/product";
import { logger } from "@/lib/utils/logger";

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Error fetching all products", error);
      throw new Error("فشل في جلب المنتجات");
    }
    return data as Product[];
  },

  async getProductById(id: string): Promise<Product> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      logger.error(`Error fetching product ${id}`, error);
      throw new Error("المنتج غير موجود");
    }
    return data as Product;
  },

  async getProductsByOwner(userId: string): Promise<Product[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Error fetching owner products", error);
      throw new Error("فشل في جلب منتجاتك");
    }
    return data as Product[];
  },

  async createProduct(input: ProductInput): Promise<Product> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("يجب تسجيل الدخول لإضافة منتج");

    const { data, error } = await supabase
      .from("products")
      .insert({ ...input, owner_id: user.id })
      .select()
      .single();

    if (error) {
      logger.error("Error creating product", error);
      throw new Error(error.message || "فشل في إنشاء المنتج");
    }
    return data as Product;
  },

  async updateProduct(id: string, updates: Partial<ProductInput>): Promise<Product> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      logger.error(`Error updating product ${id}`, error);
      throw new Error("فشل في تحديث المنتج");
    }
    return data as Product;
  },

  async deleteProduct(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      logger.error(`Error deleting product ${id}`, error);
      throw new Error("فشل في حذف المنتج");
    }
  }
};
