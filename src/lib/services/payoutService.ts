import { createClient } from "@/lib/supabase/server";

export const payoutService = {
  // ═══════════════════════════════════════════════════
  // للتاجر/المندوب: عرض سحوباته الشخصية
  // ═══════════════════════════════════════════════════
  async getMyPayouts() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("payouts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  // ═══════════════════════════════════════════════════
  // للأدمن: عرض كل السحوبات
  // ═══════════════════════════════════════════════════
  async getAllPayouts() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const role = (user.user_metadata?.role as string) || "retailer";
    if (role !== "admin") throw new Error("Forbidden");

    const { data, error } = await supabase
      .from("payouts")
      .select(`
        id,
        user_id,
        amount,
        status,
        created_at,
        users:user_id ( id, name, email, role )
      `)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  // ═══════════════════════════════════════════════════
  // للأدمن: السحوبات المعلقة فقط
  // ═══════════════════════════════════════════════════
  async getPendingPayouts() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const role = (user.user_metadata?.role as string) || "retailer";
    if (role !== "admin") throw new Error("Forbidden");

    const { data, error } = await supabase
      .from("payouts")
      .select(`
        id,
        user_id,
        amount,
        status,
        created_at,
        users:user_id ( id, name, email, role )
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  // ═══════════════════════════════════════════════════
  // للأدمن: تحديث حالة السحب
  // ═══════════════════════════════════════════════════
  async updateStatus(payoutId: string, status: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const role = (user.user_metadata?.role as string) || "retailer";
    if (role !== "admin") throw new Error("Forbidden");

    const validStatuses = ["pending", "approved", "paid", "rejected", "cancelled"];
    if (!validStatuses.includes(status)) {
      throw new Error("حالة غير صحيحة");
    }

    const { data, error } = await supabase
      .from("payouts")
      .update({ status })
      .eq("id", payoutId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};
