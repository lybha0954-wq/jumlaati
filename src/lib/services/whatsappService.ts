import { createClient } from "@/lib/supabase/server";

export const whatsappService = {
  async getPhoneById(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("users").select("phone").eq("id", userId).single();
    if (error) throw new Error(error.message);
    return data?.phone;
  },

  buildOrderMessage(order: any, items: any[], total: number) {
    let message = `طلب جديد رقم: ${order.id}\n`;
    message += `العنوان: ${order.address}\n`;
    message += `-------------------\n`;
    items.forEach((item: any) => {
      message += `${item.name} × ${item.quantity} = ${item.price * item.quantity} د.ع\n`;
    });
    message += `-------------------\n`;
    message += `الإجمالي: ${total} د.ع`;
    return encodeURIComponent(message);
  }
};
