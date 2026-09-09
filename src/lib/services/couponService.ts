import { createClient } from "@/lib/supabase/server";

export const couponService = {
  async validateCoupon(code: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .single();

    if (error || !data) throw new Error("كود الخصم غير صالح");
    if (data.used_count >= data.max_uses) throw new Error("تم استنفاد هذا الكود");
    return data;
  },

  async incrementUsage(couponId: string) {
    const supabase = await createClient();
    const { data: existingCoupon } = await supabase
      .from("coupons")
      .select("used_count")
      .eq("id", couponId)
      .single();

    const count = existingCoupon?.used_count || 0;
    const { error } = await supabase
      .from("coupons")
      .update({ used_count: count + 1 })
      .eq("id", couponId);

    if (error) throw new Error(error.message);
  },

  async getAllCoupons() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async createCoupon(code: string, discount_percent: number, max_uses: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("coupons")
      .insert({ code, discount_percent, max_uses })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};
