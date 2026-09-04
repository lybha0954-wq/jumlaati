import { createClient } from "@/lib/supabase/server";

export const couponService = {
  async validateCoupon(code: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("coupons").select("*").eq("code", code).eq("is_active", true).single();
    if (error || !data) throw new Error("كود الخصم غير صالح");
    if (data.used_count >= data.max_uses) throw new Error("تم استنفاد هذا الكود");
    return data;
  },

  async incrementUsage(couponId: string) {
    const supabase = await createClient();
    // جلب العداد الحالي أولاً
    const { data: coupon } = await supabase.from("coupons").select("used_count").eq("id", couponId).single();
    const currentCount = coupon?.used_count || 0;

    const { error } = await supabase.from("coupons").update({ used_count: currentCount + 1 }).eq("id", couponId);
    if (error) throw new Error(error.message);
  }
};
