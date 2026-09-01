import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";

export const retailerService = {
  async getMyProducts(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("retailer_id", userId);

    if (error) {
      logger.error("Error fetching retailer products", error);
      throw new Error("فشل في جلب المنتجات");
    }
    return data;
  },
  
  async addProduct(productData: any) {
    const supabase = createClient();
    const { data, error } = await supabase.from("products").insert(productData).select().single();
    
    if (error) throw new Error(error.message);
    return data;
  }
};
