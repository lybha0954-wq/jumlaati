import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response>) => void;
  env: {
    get: (key: string) => string | undefined;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConfirmPaymentBody {
  paymentIntentId: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY is not configured');

    const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' });
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { paymentIntentId }: ConfirmPaymentBody = await req.json();
    if (!paymentIntentId) throw new Error('paymentIntentId is required');

    // Retrieve payment intent from Stripe to verify status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Find order by payment_intent_id
    const { data: order, error: findError } = await supabase
      .from('orders')
      .select('id, order_number')
      .eq('payment_intent_id', paymentIntentId)
      .single();

    if (findError || !order) {
      throw new Error('Order not found for payment intent: ' + paymentIntentId);
    }

    // Map Stripe status to our payment_status enum
    const paymentStatus = paymentIntent.status === 'succeeded' ? 'paid' : 'pending';
    const stripeChargeId =
      typeof paymentIntent.latest_charge === 'string'
        ? paymentIntent.latest_charge
        : (paymentIntent.latest_charge as { id?: string } | null)?.id ?? null;

    // Update order payment status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        stripe_charge_id: stripeChargeId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Order update error:', updateError);
      throw new Error('Failed to update order: ' + updateError.message);
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        orderNumber: order.order_number,
        paymentStatus,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Confirmation failed';
    console.error('confirm-payment error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
// supabase/functions/create-payment-intent/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

serve(async (req) => {
  try {
    // 1. التحقق من المصادقة (يجب أن يكون المستخدم مسجلاً دخوله)
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // 2. جلب بيانات الطلب من الـ Body
    const { orderId } = await req.json();
    
    // 3. جلب تفاصيل الطلب من قاعدة البيانات (السعر الإجمالي، المورد، المندوب)
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select(`
        id, total_price, retailer_id, 
        supplier_id, delivery_boy_id,
        order_items (quantity, product:products (final_price, supplier_id))
      `)
      .eq('id', orderId)
      .single();
    if (orderError || !order) throw new Error('Order not found');

    // 4. حساب العمولات (النسبة المئوية للمنصة)
    const PLATFORM_COMMISSION_RATE = 0.05; // 5% عمولة المنصة
    const platformFee = order.total_price * PLATFORM_COMMISSION_RATE;
    const supplierEarnings = order.total_price - platformFee;
    const deliveryFee = 10.0; // يمكن جلبها من جدول مناطق الشحن لاحقاً

    // 5. إنشاء نية الدفع في Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round((order.total_price + deliveryFee) * 100), // التحويل إلى هللة (أصول)
      currency: 'sar',
      metadata: { 
        orderId: order.id,
        platformFee: platformFee.toString(),
        supplierEarnings: supplierEarnings.toString(),
      },
    });

    // 6. تخزين بيانات العمولة في جدول المعاملات (حتى قبل الدفع)
    await supabaseClient.from('transactions').insert({
      order_id: order.id,
      retailer_id: order.retailer_id,
      supplier_id: order.supplier_id,
      delivery_boy_id: order.delivery_boy_id,
      total_amount: order.total_price,
      platform_commission: platformFee,
      supplier_net: supplierEarnings,
      delivery_fee: deliveryFee,
      status: 'pending',
      payment_intent_id: paymentIntent.id,
    });

    // 7. إرجاع البيانات للواجهة الأمامية
    return new Response(JSON.stringify({ 
      clientSecret: paymentIntent.client_secret,
      transactionId: paymentIntent.id,
      amount: order.total_price + deliveryFee,
    }), { headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
