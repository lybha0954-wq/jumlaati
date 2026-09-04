import { createClient } from "@/lib/supabase/server";
import type { ReviewInput } from "@/types/review";

export const reviewService = {
  async getProductReviews(productId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*, users(name)")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async createReview(input: ReviewInput) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("reviews")
      .insert({ ...input, user_id: user.id })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};
