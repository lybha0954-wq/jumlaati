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
  orderId?: string;
}

Deno.serve(async (req: Request) => {
  // التعامل مع طلبات Preflight المسبقة لـ CORS
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

    // استقبال البيانات المرسلة من الطلب
    const body: ConfirmPaymentBody = await req.json();
    const { paymentIntentId, orderId } = body;

    if (!paymentIntentId) {
      throw new Error('paymentIntentId is required');
    }

    // التحقق من حالة الدفع مباشرة من Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // إذا تم الدفع بنجاح، قم بتحديث حالة الطلب في قاعدة بيانات Supabase إذا توفر الـ orderId
      if (orderId) {
        const { error: updateError } = await supabase
          .from('orders')
          .update({ status: 'paid', payment_intent_id: paymentIntentId })
          .eq('id', orderId);

        if (updateError) {
          throw new Error(`Failed to update order status: ${updateError.message}`);
        }
      }

      return new Response(
        JSON.stringify({ success: true, status: paymentIntent.status }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, status: paymentIntent.status, message: 'Payment not completed' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
