import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  try {
    const { payment_id, status } = await req.json();
    if (!payment_id || !status) {
      return new Response(JSON.stringify({ error: 'Missing payment_id or status' }), { status: 400 });
    }
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    const { data: payment, error: payErr } = await supabase
      .from('payments')
      .update({ status, paid_at: new Date().toISOString() })
      .eq('id', payment_id)
      .select()
      .single();
    if (payErr) throw payErr;
    if (status === 'paid' && payment.order_id) {
      await supabase.from('orders').update({ payment_status: 'paid' }).eq('id', payment.order_id);
      const txnNum = `TRX-${Date.now()}`;
      await supabase.from('transactions').insert({
        transaction_number: txnNum,
        order_id: payment.order_id,
        retailer_id: payment.user_id,
        total_amount: payment.amount,
        paid_amount: payment.amount,
        payment_status: 'paid',
        payment_method: payment.gateway || 'cod',
      });
    }
    return new Response(JSON.stringify({ success: true, payment }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
