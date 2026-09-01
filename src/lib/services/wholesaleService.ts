import { createClient } from "@/lib/supabase/server";

export const wholesaleService = {
  async getMyProducts(): Promise<any[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async createProduct(product: any): Promise<any> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateStock(productId: string, stock: number): Promise<any> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .update({ stock })
      .eq("id", productId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteProduct(productId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) throw new Error(error.message);
  },

  async updateProduct(productId: string, updates: any): Promise<any> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", productId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};
