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
  currency?: string;
  orderNumber: string;
  buyerName: string;
  buyerStoreName: string;
  buyerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryNotes?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  commission: number;
  paymentMethod: string;
  storeId?: string;
  items: Array<{ productId: string; name: string; qty: number; unitPrice: number; unit?: string }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY is not configured');
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables are missing');
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' });
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: CreatePaymentIntentRequest = await req.json();
    
    // التحقق من المبلغ وإجماليات الطلب
    if (!body.total || body.total <= 0) {
      throw new Error('Invalid total amount');
    }

    // إنشاء Payment Intent في Stripe بالعملة المطلوبة (افتراضياً USD أو IQD حسب إعداداتك)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(body.total * 100), // Stripe يتعامل بالهللات/السنتافات
      currency: body.currency || 'usd',
      metadata: {
        orderNumber: body.orderNumber,
        buyerName: body.buyerName,
        buyerStoreName: body.buyerStoreName,
        buyerPhone: body.buyerPhone,
        storeId: body.storeId || '',
        commission: body.commission.toString(),
      },
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) { // تم ضبطها لمعالجة الأخطاء بدقة
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
