import { createClient } from "@/lib/supabase/server";

export const relationshipService = {
  // إرسال طلب ارتباط (يدعم: جملة -> تجزئة، جملة -> توصيل، تجزئة -> جملة، توصيل -> جملة)
  async sendRequest(data: { wholesalerId?: string; retailerId?: string; deliveryId?: string }) {
    const supabase = createClient();
    const { data: relationship, error } = await supabase
      .from('relationships')
      .insert({ 
        wholesaler_id: data.wholesalerId || null, 
        retailer_id: data.retailerId || null, 
        delivery_id: data.deliveryId || null,
        status: 'pending' 
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return relationship;
  },

  // قبول طلب الارتباط
  async acceptRequest(relationshipId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('relationships')
      .update({ status: 'active' })
      .eq('id', relationshipId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // رفض طلب الارتباط
  async rejectRequest(relationshipId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('relationships')
      .update({ status: 'suspended' })
      .eq('id', relationshipId);

    if (error) throw new Error(error.message);
  },

  // جلب طلبات الانضمام المعلقة (لكل الأدوار)
  async getPendingRequests() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from('relationships')
      .select('*, retailer:retailer_id(id, name, email), wholesaler:wholesaler_id(id, name, email), delivery:delivery_id(id, name, email)')
      .or(`wholesaler_id.eq.${user.id},retailer_id.eq.${user.id},delivery_id.eq.${user.id}`)
      .eq('status', 'pending');

    if (error) throw new Error(error.message);
    return data;
  }
};
