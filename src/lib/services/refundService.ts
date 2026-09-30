import { createClient } from "@/lib/supabase/server";

export const refundService = {
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
    return data || [];
  },

  async getAllRefunds() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("refunds")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async createRefund(input: { order_id: number; amount: number; reason?: string }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("refunds")
      .insert({
        order_id: input.order_id,
        amount: input.amount,
        reason: input.reason || null,
        status: "pending",
        requested_by: user.id,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateStatus(id: string, status: "approved" | "rejected" | "refunded") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { error } = await supabase
      .from("refunds")
      .update({ status, reviewed_by: user.id })
      .eq("id", id);

    if (error) throw new Error(error.message);
  },
};
