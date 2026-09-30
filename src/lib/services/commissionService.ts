import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { paymentConfig } from "@/config/payment";
import type { Commission } from "@/types/commission";

export const commissionService = {
  calculateCommission(orderTotal: number): number {
    return Math.round(orderTotal * paymentConfig.commissionRate);
  },

  async createCommission(
    orderId: string,
    retailerProfileId: string,
    supplierProfileId: string,
    orderTotal: number
  ) {
    const supabase = await createClient();
    const commissionAmount = this.calculateCommission(orderTotal);

    const { data, error } = await supabase
      .from("commissions")
      .insert({
        order_id: orderId,
        commission: commissionAmount,
        retailer_id: retailerProfileId,
        supplier_id: supplierProfileId,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      logger.error("Commission: create failed", error);
      throw new Error(error.message);
    }
    return data as Commission;
  },

  async getMyCommissions(): Promise<Commission[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("commissions")
      .select("*")
      .eq("retailer_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data as Commission[];
  },
};
