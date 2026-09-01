import { createClient } from "@/lib/supabase/server";

export const matchingService = {
  // إنشاء طلب مطابقة (من التاجر إلى الجملة)
  async createMatchRequest(payload: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from("matches")
      .insert({ ...payload, requester_id: user?.id, status: "pending" })
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  },

  // قبول مطابقة من تاجر الجملة
  async acceptMatch(matchId: string) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("matches")
      .update({ status: "approved" })
      .eq("id", matchId);
      
    if (error) throw new Error(error.message);
  }
};
