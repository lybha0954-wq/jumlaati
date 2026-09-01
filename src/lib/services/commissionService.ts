import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { paymentConfig } from "@/config/payment";
import type { Commission } from "@/types/commission";

export const commissionService = {
  // حساب نسبة العمولة
  calculateCommission(orderTotal: number): number {
    return orderTotal * paymentConfig.commissionRate;
  },

  // إنشاء عمولة تلقائياً عند إتمام طلب
  async createCommission(orderId: string, retailerId: string, orderTotal: number) {
    const supabase = createClient();
    const amount = this.calculateCommission(orderTotal);
    
    const { data, error } = await supabase
      .from("commissions")
      .insert({
        order_id: orderId,
        retailer_id: retailerId,
        amount,
        status: "pending"
      })
      .select()
      .single();

    if (error) {
      logger.error("Error creating commission", error);
      throw new Error(error.message);
    }
    return data as Commission;
  },

  // جلب عمولاتي (بصفتي تاجر تجزئة)
  async getMyCommissions(): Promise<Commission[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from("commissions")
      .select("*")
      .eq("retailer_id", user?.id);

    if (error) throw new Error(error.message);
    return data as Commission[];
  }
};
