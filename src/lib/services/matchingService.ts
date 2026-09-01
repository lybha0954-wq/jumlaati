import { createClient } from "@/lib/supabase/server";

export const matchingService = {
  async findWholesaleMatches(retailerNeeds: any) {
    const supabase = createClient();
    // مثال: البحث عن عروض جملة تطابق احتياجات التاجر
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .eq("status", "pending")
      .eq("retailer_id", retailerNeeds.retailerId);

    if (error) throw new Error(error.message);
    return data;
  }
};
