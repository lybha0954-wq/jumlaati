import { createClient } from "@/lib/supabase/server";

export interface Offer {
  id: string;
  supplier_id: string;
  product_id: number | null;
  title: string;
  description: string | null;
  discount_percent: number | null;
  valid_from: string;
  valid_to: string | null;
  is_active: boolean;
  created_at: string;
}

export const offerService = {
  async getActiveOffers(): Promise<Offer[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []) as Offer[];
  },

  async getMyOffers(): Promise<Offer[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .eq("supplier_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []) as Offer[];
  },
};
