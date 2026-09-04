import { createClient } from "@/lib/supabase/server";

export const wishlistService = {
  async getMyWishlist() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("wishlist")
      .select("*, products(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async addToWishlist(productId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("wishlist")
      .insert({ user_id: user.id, product_id: productId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async removeFromWishlist(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("wishlist").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
};
