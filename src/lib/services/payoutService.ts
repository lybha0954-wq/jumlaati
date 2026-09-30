import { createClient } from "@/lib/supabase/server";

// helper داخلي: اقرأ الدور من public.users لا من JWT
async function getUserRole(supabase: any, userId: string): Promise<string> {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return data?.role || "retailer";
}

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

    const role = await getUserRole(supabase, user.id);
    if (role !== "admin") throw new Error("Forbidden");

    const { data, error } = await supabase
      .from("payouts")
      .select(`
        id,
        user_id,
        amount,
        status,
        created_at,
        profiles:user_id ( id, full_name, email, role )
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

    const role = await getUserRole(supabase, user.id);
    if (role !== "admin") throw new Error("Forbidden");

    const { data, error } = await supabase
      .from("payouts")
      .select(`
        id,
        user_id,
        amount,
        status,
        created_at,
        profiles:user_id ( id, full_name, email, role )
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

    const role = await getUserRole(supabase, user.id);
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
