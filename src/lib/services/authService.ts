import { createClient } from "@/lib/supabase/server";

export const authService = {
  // دالة لتحديد نوع الإدخال (بريد أو هاتف)
  getLoginType(identifier: string): "email" | "phone" {
    return identifier.includes("@") ? "email" : "phone";
  },

  async login(identifier: string, password: string) {
    const supabase = await createClient();
    const type = this.getLoginType(identifier);

    const credentials = type === "email"
      ? { email: identifier, password }
      : { phone: identifier, password };

    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw new Error(error.message);
    return data;
  }
};
