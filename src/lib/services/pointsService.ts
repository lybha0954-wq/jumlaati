import { createClient } from "@/lib/supabase/server";

export const pointsService = {
  async getMyPoints() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("points")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getBalance() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("points")
      .select("points")
      .eq("user_id", user.id);

    if (error) throw new Error(error.message);
    return (data || []).reduce((s, p: any) => s + Number(p.points || 0), 0);
  },
};
