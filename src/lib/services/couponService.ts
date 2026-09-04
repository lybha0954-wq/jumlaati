import { createClient } from "@/lib/supabase/server";

export const couponService = {
  // التحقق من صلاحية الكود وحساب الخصم
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

  // تحديث عدد مرات الاستخدام بعد الطلب
  async incrementUsage(couponId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("coupons")
      .update({ used_count: data?.used_count ? data.used_count + 1 : 1 })
      .eq("id", couponId);

    if (error) throw new Error(error.message);
    return data;
  },

  // جلب جميع الأكواد (للأدمن)
  async getAllCoupons() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  // إنشاء كود جديد (للأدمن)
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
