import { createClient } from "@/lib/supabase/server";

export const relationshipService = {
  // إرسال طلب ارتباط (تاجر الجملة يضيف تاجر التجزئة أو العكس)
  async sendRequest(wholesalerId: string, retailerId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('relationships')
      .insert({ wholesaler_id: wholesalerId, retailer_id: retailerId, status: 'pending' })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
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

  // جلب جميع التجار المرتبطين بي (كعملاء)
  async getMyConnectedRetailers() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from('relationships')
      .select('*, retailer:retailer_id(id, name, email)')
      .eq('wholesaler_id', user.id)
      .eq('status', 'active');

    if (error) throw new Error(error.message);
    return data;
  },

  // جلب العلاقات المعلقة (الطلبات الجديدة التي تنتظر القبول)
  async getPendingRequests() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from('relationships')
      .select('*, retailer:retailer_id(id, name, email), wholesaler:wholesaler_id(id, name, email)')
      .or(`wholesaler_id.eq.${user.id},retailer_id.eq.${user.id}`)
      .eq('status', 'pending');

    if (error) throw new Error(error.message);
    return data;
  }
};
