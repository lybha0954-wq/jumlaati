-- ============================================================
-- Jumlaati Platform — Payment Gateway Fields Migration
-- ============================================================

-- Add Payment Gateway Intent & Transaction Reference fields
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS stripe_charge_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS payment_gateway_ref TEXT DEFAULT NULL;

-- Create Indexes for fast lookup on payment webhooks
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent_id ON public.orders(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_gateway_ref ON public.orders(payment_gateway_ref);
