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

                                                                      const body: ConfirmPaymentBody = await req.json().catch(() => ({ paymentIntentId: '' }));
                                                                          const { paymentIntentId } = body;

                                                                              if (!paymentIntentId) {
                                                                                    return new Response(
                                                                                            JSON.stringify({ error: 'paymentIntentId is required' }),
                                                                                                    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                                                                                                          );
                                                                                                              }

                                                                                                                  // جلب معلومات الدفع من Stripe للتأكد من الحالة
                                                                                                                      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

                                                                                                                          // البحث عن الطلب المترابط مع عملية الدفع هذه
                                                                                                                              const { data: order, error: findError } = await supabase
                                                                                                                                    .from('orders')
                                                                                                                                          .select('id, order_number, status')
                                                                                                                                                .eq('payment_intent_id', paymentIntentId)
                                                                                                                                                      .single();

                                                                                                                                                          if (findError || !order) {
                                                                                                                                                                console.error(`Order not found for paymentIntentId: ${paymentIntentId}`);
                                                                                                                                                                      return new Response(
                                                                                                                                                                              JSON.stringify({ error: `Order not found for payment intent: ${paymentIntentId}` }),
                                                                                                                                                                                      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                                                                                                                                                                                            );
                                                                                                                                                                                                }

                                                                                                                                                                                                    // تعيين حالات الدفع والطلب
                                                                                                                                                                                                        const isSuccess = paymentIntent.status === 'succeeded';
                                                                                                                                                                                                            const paymentStatus = isSuccess ? 'paid' : 'pending';
                                                                                                                                                                                                                
                                                                                                                                                                                                                    // الحصول على معرف عملية الخصم Stripe Charge ID
                                                                                                                                                                                                                        const stripeChargeId =
                                                                                                                                                                                                                              typeof paymentIntent.latest_charge === 'string'
                                                                                                                                                                                                                                      ? paymentIntent.latest_charge
                                                                                                                                                                                                                                              : (paymentIntent.latest_charge as { id?: string } | null)?.id ?? null;

                                                                                                                                                                                                                                                  // تحديث بيانات الطلب في قاعدة البيانات
                                                                                                                                                                                                                                                      const updateData: Record<string, unknown> = {
                                                                                                                                                                                                                                                            payment_status: paymentStatus,
                                                                                                                                                                                                                                                                  stripe_charge_id: stripeChargeId,
                                                                                                                                                                                                                                                                        updated_at: new Date().toISOString(),
                                                                                                                                                                                                                                                                            };

                                                                                                                                                                                                                                                                                // إذا تمت العملية بنجاح، يتم القبول والتحديث
                                                                                                                                                                                                                                                                                    const { error: updateError } = await supabase
                                                                                                                                                                                                                                                                                          .from('orders')
                                                                                                                                                                                                                                                                                                .update(updateData)
                                                                                                                                                                                                                                                                                                      .eq('id', order.id);

                                                                                                                                                                                                                                                                                                          if (updateError) {
                                                                                                                                                                                                                                                                                                                console.error('Order update error:', updateError);
                                                                                                                                                                                                                                                                                                                      throw new Error('Failed to update order status: ' + updateError.message);
                                                                                                                                                                                                                                                                                                                          }

                                                                                                                                                                                                                                                                                                                              return new Response(
                                                                                                                                                                                                                                                                                                                                    JSON.stringify({
                                                                                                                                                                                                                                                                                                                                            success: true,
                                                                                                                                                                                                                                                                                                                                                    orderId: order.id,
                                                                                                                                                                                                                                                                                                                                                            orderNumber: order.order_number,
                                                                                                                                                                                                                                                                                                                                                                    paymentStatus,
                                                                                                                                                                                                                                                                                                                                                                            stripeChargeId,
                                                                                                                                                                                                                                                                                                                                                                                  }),
                                                                                                                                                                                                                                                                                                                                                                                        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                                                                                                                                                                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                                                                                                                                                                              } catch (e: unknown) {
                                                                                                                                                                                                                                                                                                                                                                                                  const message = e instanceof Error ? e.message : 'Confirmation failed';
                                                                                                                                                                                                                                                                                                                                                                                                      console.error('confirm-payment edge function error:', message);
                                                                                                                                                                                                                                                                                                                                                                                                          return new Response(
                                                                                                                                                                                                                                                                                                                                                                                                                JSON.stringify({ error: message }),
                                                                                                                                                                                                                                                                                                                                                                                                                      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                                                                                                                                                                                                                                                                                                                                                                                                                          );
                                                                                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                                                                                                                                                            