import { createClient } from "@/lib/supabase/server";

export const productService = {
  async getAllProducts(): Promise<any[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getProductById(id: string): Promise<any> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getProductBySlug(slug: string): Promise<any> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};
