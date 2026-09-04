import { createClient } from "@/lib/supabase/server";
import type { AddressInput } from "@/types/address";

export const addressService = {
  async getMyAddresses(): Promise<any[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async addAddress(input: AddressInput) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("addresses")
      .insert({ ...input, user_id: user.id })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};
