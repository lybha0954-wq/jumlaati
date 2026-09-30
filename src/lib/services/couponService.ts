import { createClient } from "@/lib/supabase/server";

export const couponService = {
  async validateCoupon(code: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) throw new Error("كود الخصم غير صالح");
    if (data.used_count >= data.max_uses) throw new Error("تم استنفاد هذا الكود");
    if (data.valid_to && new Date(data.valid_to) < new Date()) throw new Error("انتهت صلاحية الكود");
    return data;
  },

  async incrementUsage(couponId: string) {
    const supabase = await createClient();
    const { data: c } = await supabase
      .from("coupons")
      .select("used_count")
      .eq("id", couponId)
      .single();

    const { error } = await supabase
      .from("coupons")
      .update({ used_count: (c?.used_count || 0) + 1 })
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
    return data || [];
  },

  async createCoupon(input: {
    code: string;
    discount_type: "percent" | "fixed";
    discount_value: number;
    max_uses: number;
    min_order?: number;
    valid_to?: string | null;
  }) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("coupons")
      .insert({
        code: input.code.toUpperCase().trim(),
        discount_type: input.discount_type,
        discount_value: input.discount_value,
        max_uses: input.max_uses,
        min_order: input.min_order || 0,
        valid_to: input.valid_to || null,
        is_active: true,
        used_count: 0,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};
