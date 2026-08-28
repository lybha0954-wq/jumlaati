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

interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  orderNumber: string;
  buyerName: string;
  buyerStoreName: string;
  buyerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryNotes: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  commission: number;
  paymentMethod: string;
  retailerId?: string;
  supplierId?: string;
  items: Array<{ productId: string; qty: number; unitPrice: number }>;
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

    const body: CreatePaymentIntentRequest = await req.json();

    // Validate amount on backend
    const calculatedTotal = body.subtotal + body.deliveryFee;
    if (calculatedTotal <= 0) {
      throw new Error('Invalid order amount');
    }

    // Create Stripe customer
    const stripeCustomer = await stripe.customers.create({
      name: body.buyerStoreName || body.buyerName,
      phone: body.buyerPhone || undefined,
      metadata: {
        store_name: body.buyerStoreName,
        order_number: body.orderNumber,
      },
    });

    // Create Payment Intent (amount in smallest currency unit)
    const amountInCents = Math.round(calculatedTotal);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: (body.currency || 'usd').toLowerCase(),
      customer: stripeCustomer.id,
      description: `طلب #${body.orderNumber} — ${body.buyerStoreName}`,
      metadata: {
        order_number: body.orderNumber,
        buyer_name: body.buyerName,
        delivery_city: body.deliveryCity,
      },
      automatic_payment_methods: { enabled: true },
    });

    // Fallback UUIDs for required FK fields
    const FALLBACK_UUID = '00000000-0000-0000-0000-000000000000';
    const retailerId = body.retailerId || FALLBACK_UUID;
    const supplierId = body.supplierId || (body.items?.[0] ? FALLBACK_UUID : FALLBACK_UUID);

    // Save order to database with payment_intent_id
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: body.orderNumber,
        retailer_id: retailerId,
        supplier_id: supplierId,
        buyer_name: body.buyerName,
        buyer_store_name: body.buyerStoreName,
        buyer_phone: body.buyerPhone,
        delivery_address: body.deliveryAddress,
        delivery_city: body.deliveryCity,
        delivery_notes: body.deliveryNotes,
        subtotal: body.subtotal,
        delivery_fee: body.deliveryFee,
        total: body.total,
        commission: body.commission,
        payment_method: body.paymentMethod,
        status: 'pending',
        payment_status: 'pending',
        payment_intent_id: paymentIntent.id,
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Order insert error:', orderError);
      throw new Error('Failed to save order: ' + orderError.message);
    }

    const orderId = orderData.id;

    // Insert order items using correct schema columns
    if (body.items && body.items.length > 0) {
      const { error: itemsError } = await supabase.from('order_items').insert(
        body.items.map((item) => ({
          order_id: orderId,
          product_id: item.productId,
          quantity: item.qty,
          unit_price: item.unitPrice,
          total_price: item.unitPrice * item.qty,
        }))
      );
      if (itemsError) {
        console.error('Order items insert error:', itemsError);
      }
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        orderId,
        paymentIntentId: paymentIntent.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Payment setup failed';
    console.error('create-payment-intent error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
