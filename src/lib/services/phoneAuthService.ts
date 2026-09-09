import { createClient } from "@/lib/supabase/client";

export const phoneAuthService = {
  async sendOtp(phone: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone,
      options: {
        shouldCreateUser: true,
      },
    });
    if (error) throw new Error(error.message);
    return { success: true };
  },

  async verifyOtp(phone: string, token: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone,
      token: token,
      type: "sms",
    });
    if (error) throw new Error(error.message);
    return data;
  }
};
