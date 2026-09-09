-- Add Stripe payment fields to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS stripe_charge_id TEXT DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_orders_payment_intent_id ON public.orders(payment_intent_id);
