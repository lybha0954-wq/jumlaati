import { createClient } from "@/lib/supabase/server";
import type { Offer } from "@/types/offer";

export const offerService = {
  async getActiveOffers(): Promise<Offer[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }
};
