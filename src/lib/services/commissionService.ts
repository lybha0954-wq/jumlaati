import { createClient } from "@/lib/supabase/server";
import { paymentConfig } from "@/config/payment";

export const commissionService = {
  async calculateCommission(orderTotal: number) {
    return orderTotal * paymentConfig.commissionRate;
  },

  async createCommission(commissionData: any) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("commissions")
      .insert(commissionData)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};
