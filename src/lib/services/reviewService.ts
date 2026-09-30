import { createClient } from "@/lib/supabase/server";

export const reviewService = {
  async getProductReviews(productId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    // إرفاق أسماء المراجعين
    const ids = (data || []).map((r: any) => r.reviewer_id).filter(Boolean);
    let nameMap: Record<string, string> = {};
    if (ids.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", ids);
      (profiles || []).forEach((p: any) => { nameMap[p.id] = p.full_name || ""; });
    }

    return (data || []).map((r: any) => ({
      ...r,
      reviewer_name: nameMap[r.reviewer_id] || "مستخدم",
    }));
  },

  async createReview(input: { product_id: number; rating: number; comment?: string }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        product_id: input.product_id,
        reviewer_id: user.id,
        rating: input.rating,
        comment: input.comment || null,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getMyReviews() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("reviewer_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },
};
