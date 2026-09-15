import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  try {
    const { order_id, amount, method } = await req.json();
    if (!order_id || !amount) {
      return new Response(JSON.stringify({ error: 'Missing order_id or amount' }), { status: 400 });
    }
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    const authHeader = req.headers.get('Authorization');
    const { data: { user } } = await supabase.auth.getUser(authHeader?.replace('Bearer ', '') || '');
    const txnNumber = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({ order_id, user_id: user?.id, amount, gateway: method || 'cod', status: 'pending', transaction_ref: txnNumber })
      .select()
      .single();
    if (error) throw error;
    return new Response(JSON.stringify({ payment, transaction_ref: txnNumber }), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
