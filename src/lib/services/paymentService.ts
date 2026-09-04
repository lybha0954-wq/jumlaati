import { createClient } from "@/lib/supabase/server";

export const paymentService = {
  // إنشاء عملية دفع جديدة (مع دعم الدفع عند الاستلام كخيار افتراضي)
  async createPayment(orderId: string, amount: number, gateway: string = "cod") {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("payments")
      .insert({ order_id: orderId, amount, gateway, status: "pending" })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // معالجة رد بوابة الدفع (Webhook)
  async handleWebhook(paymentId: string, status: string, transactionId?: string) {
    const supabase = await createClient();

    const updates: any = { status };
    if (transactionId) updates.provider_transaction_id = transactionId;

    const { data, error } = await supabase
      .from("payments")
      .update(updates)
      .eq("id", paymentId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // تحديث حالة الطلب إلى "مدفوع" إذا نجحت العملية
    if (status === "success") {
      await supabase.from("orders").update({ status: "paid" }).eq("id", data.order_id);
    }

    return data;
  }
};
