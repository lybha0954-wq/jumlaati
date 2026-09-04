import { createClient } from "@/lib/supabase/server";
import type { Product, ProductInput } from "@/types/product";

export const wholesaleService = {
  async createProduct(input: ProductInput): Promise<Product> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("products")
      .insert({ ...input, owner_id: user.id, is_active: true })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Product;
  },

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

  async updateProduct(productId: string, updates: any): Promise<Product> {
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

  async deleteProduct(productId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);
    if (error) throw new Error(error.message);
  },

  async getMyOrders(): Promise<any[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("wholesaler_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }
};
