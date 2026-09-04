import { createClient } from "@/lib/supabase/server";

export const chatService = {
  async getConversation(otherUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  async sendMessage(receiverId: string, message: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("يجب تسجيل الدخول");

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({ sender_id: user.id, receiver_id: receiverId, message })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};
