import { createClient } from "@/lib/supabase/server";

export const productService = {
  async getAllProducts(): Promise<any[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }
};
