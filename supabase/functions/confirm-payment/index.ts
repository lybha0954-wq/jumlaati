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
// supabase/functions/confirm-payment/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

serve(async (req) => {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return new Response('Webhook signature verification failed.', { status: 400 });
  }

  // معالجة حدث نجاح الدفع فقط
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // استخدم Service Role للتحديث دون قيود
    );

    // 1. تحديث حالة الطلب إلى "تم الدفع"
    await supabase.from('orders').update({ 
      status: 'مدفوع - جارٍ التجهيز',
      paid_at: new Date().toISOString()
    }).eq('id', orderId);

    // 2. تحديث حالة المعاملة إلى "مكتملة"
    await supabase.from('transactions')
      .update({ status: 'completed' })
      .eq('payment_intent_id', paymentIntent.id);

    // 3. إعادة توليد صفحة الطلب فوراً (ISR On-Demand)
    const baseUrl = Deno.env.get('NEXT_PUBLIC_BASE_URL')!;
    await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        path: `/retailer/orders/${orderId}`,
        secret: Deno.env.get('REVALIDATION_SECRET')
      })
    });
  }

  return new Response('Webhook received', { status: 200 });
});
// supabase/functions/confirm-payment/index.ts (التحديث الكامل)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

serve(async (req) => {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return new Response('Webhook signature verification failed.', { status: 400 });
  }

  // معالجة حدث نجاح الدفع فقط
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // صلاحية كاملة
    );

    // --- الخطوة الحاسمة: خصم المخزون ---
    const { data: deductResult, error: deductError } = await supabase
      .rpc('deduct_inventory', { order_id_param: orderId });

    // إذا فشل خصم المخزون (نفدت الكمية)
    if (deductError || !deductResult?.success) {
      console.error('Inventory deduction failed:', deductError || deductResult?.error);

      // 1. إلغاء الدفع (Refund) في Stripe - لأننا لا نستطيع توفير المنتج
      try {
        await stripe.refunds.create({ payment_intent: paymentIntent.id });
      } catch (refundError) {
        console.error('Refund failed:', refundError);
        // نحتاج هنا لتدخل يدوي، نرسل إشعاراً للمشرف
      }

      // 2. تحديث حالة الطلب إلى "فشل - نفد المخزون"
      await supabase.from('orders').update({ 
        status: 'فشل الدفع - نفد المخزون',
        updated_at: new Date().toISOString()
      }).eq('id', orderId);

      return new Response(JSON.stringify({ 
        status: 'failed', 
        reason: 'Inventory exhausted, refund issued' 
      }), { status: 200 });
    }

    // --- إذا نجح خصم المخزون ---
    // 1. تحديث حالة الطلب
    await supabase.from('orders').update({ 
      status: 'مدفوع - جارٍ التجهيز',
      paid_at: new Date().toISOString(),
      total_cost_calculated: deductResult.total_cost // تخزين المبلغ المحسوب للتدقيق
    }).eq('id', orderId);

    // 2. تحديث حالة المعاملة
    await supabase.from('transactions')
      .update({ status: 'completed' })
      .eq('payment_intent_id', paymentIntent.id);

    // 3. إعادة توليد صفحة الطلب فوراً (ISR)
    const baseUrl = Deno.env.get('NEXT_PUBLIC_BASE_URL')!;
    await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        path: `/retailer/orders/${orderId}`,
        secret: Deno.env.get('REVALIDATION_SECRET')
      })
    });

    return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
  }

  return new Response('Webhook received', { status: 200 });
});
