import { createClient } from "@/lib/supabase/server";
import type { Product, ProductInput } from "@/types/product";

export const wholesaleService = {
  async createProduct(input: ProductInput): Promise<Product> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("products")
      .insert({ ...input, owner_id: user.id })
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

  async updateStock(productId: string, stock: number) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("products")
      .update({ stock })
      .eq("id", productId);
    if (error) throw new Error(error.message);
  },

  async getMyOrders() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    const { data, error } = await supabase.from("orders").select("*").eq("wholesaler_id", user.id);
    if (error) throw new Error(error.message);
    return data;
  }
};
