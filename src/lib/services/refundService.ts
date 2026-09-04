import { createClient } from "@/lib/supabase/server";

export const refundService = {
  async createRefund(orderId: string, reason: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("refunds")
      .insert({ order_id: orderId, requested_by: user.id, reason })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getMyRefunds() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("refunds")
      .select("*")
      .eq("requested_by", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }
};
