import { createClient } from "@/lib/supabase/server";

export const analyticsService = {
  // إجمالي المبيعات
  async getTotalRevenue(): Promise<number> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("total")
      .eq("status", "delivered");

    if (error) throw new Error(error.message);
    return data.reduce((sum, order) => sum + order.total, 0);
  },

  // عدد المستخدمين حسب الدور
  async getUsersCountByRole(role: string): Promise<number> {
    const supabase = createClient();
    const { count } = await supabase
      .from("users")
      .select("*", { count: 'exact', head: true })
      .eq("role", role);

    return count || 0;
  }
};
