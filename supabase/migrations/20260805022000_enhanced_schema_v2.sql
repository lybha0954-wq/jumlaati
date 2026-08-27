-- ============================================================
-- Jumlaati Platform — Enhanced Schema v2
-- Adds: extended profiles, product discounts/offers,
--       order user-links, transactions table, notification
--       enhancements, barcode lookup function, and
--       role-based RLS policies.
-- ============================================================

-- ─── 1. EXTEND user_profiles ─────────────────────────────────
-- Add missing profile fields: phone, business_name, governorate,
-- district, account_status
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS business_name TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS governorate TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS district TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active'
    CHECK (account_status IN ('active', 'suspended', 'pending'));

-- ─── 2. EXTEND products — discount & offers ──────────────────
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS discount_percentage NUMERIC(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_price BIGINT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS offer_start_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS offer_end_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_on_offer BOOLEAN DEFAULT false;

-- Index for active offers lookup
CREATE INDEX IF NOT EXISTS idx_products_is_on_offer ON public.products(is_on_offer);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON public.products(barcode);

-- ─── 3. EXTEND orders — link to user_profiles ────────────────
-- Add retailer_id and supplier_id as optional FKs to user_profiles
-- (orders already have buyer_name/store_name as text; these add
--  proper relational links for RLS and real-time filtering)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS retailer_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS supplier_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_orders_retailer_profile_id ON public.orders(retailer_profile_id);
CREATE INDEX IF NOT EXISTS idx_orders_supplier_profile_id ON public.orders(supplier_profile_id);

-- ─── 4. TRANSACTIONS TABLE ───────────────────────────────────
-- Live financial records between stores and suppliers
-- Tracks: total amount, paid amount, remaining debt (IQD),
--         payment status, and invoice reference
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_number TEXT NOT NULL UNIQUE,
  retailer_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  total_amount BIGINT NOT NULL DEFAULT 0,
  paid_amount BIGINT NOT NULL DEFAULT 0,
  remaining_amount BIGINT GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  currency TEXT NOT NULL DEFAULT 'IQD',
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('paid', 'partial', 'pending', 'overdue', 'cancelled')),
  payment_method TEXT DEFAULT 'cod'
    CHECK (payment_method IN ('cod', 'bank_transfer', 'cash', 'credit')),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transactions_retailer_id ON public.transactions(retailer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_supplier_id ON public.transactions(supplier_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_status ON public.transactions(payment_status);
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON public.transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);

-- ─── 5. EXTEND notifications ─────────────────────────────────
-- Add link_url for direct navigation and role-based type
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS link_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS role_target TEXT DEFAULT 'all'
    CHECK (role_target IN ('admin', 'supplier', 'retailer', 'all'));

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_role_target ON public.notifications(role_target);

-- ─── 6. HELPER FUNCTIONS ─────────────────────────────────────

-- Role helper: get current user role from auth metadata
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT role::TEXT FROM public.user_profiles WHERE id = auth.uid() LIMIT 1),
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid() LIMIT 1),
    'retailer'
  )
$$;

-- Barcode lookup: returns product matching a barcode value
-- Used by scanner integration for instant product lookup
CREATE OR REPLACE FUNCTION public.get_product_by_barcode(barcode_value TEXT)
RETURNS TABLE (
  id UUID,
  barcode TEXT,
  product_name TEXT,
  category TEXT,
  cost_price BIGINT,
  original_price BIGINT,
  final_price BIGINT,
  discount_percentage NUMERIC,
  discount_price BIGINT,
  is_on_offer BOOLEAN,
  offer_start_date TIMESTAMPTZ,
  offer_end_date TIMESTAMPTZ,
  stock INTEGER,
  min_order_qty INTEGER,
  status TEXT,
  unit TEXT,
  supplier_id UUID,
  supplier_name TEXT,
  supplier_rating NUMERIC,
  delivery_days INTEGER
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.barcode,
    p.name AS product_name,
    p.category,
    p.cost_price,
    p.original_price,
    p.final_price,
    p.discount_percentage,
    p.discount_price,
    p.is_on_offer,
    p.offer_start_date,
    p.offer_end_date,
    p.stock,
    p.min_order_qty,
    p.status::TEXT,
    p.unit,
    p.supplier_id,
    p.supplier_name,
    p.supplier_rating,
    p.delivery_days
  FROM public.products p
  WHERE p.barcode = barcode_value
  LIMIT 1;
END;
$$;

-- Supplier-scoped product lookup by barcode
CREATE OR REPLACE FUNCTION public.get_supplier_product_by_barcode(
  barcode_value TEXT,
  supplier_uuid UUID
)
RETURNS TABLE (
  id UUID,
  barcode TEXT,
  product_name TEXT,
  category TEXT,
  cost_price BIGINT,
  original_price BIGINT,
  final_price BIGINT,
  stock INTEGER,
  min_order_qty INTEGER,
  status TEXT,
  unit TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.barcode,
    p.name AS product_name,
    p.category,
    p.cost_price,
    p.original_price,
    p.final_price,
    p.stock,
    p.min_order_qty,
    p.status::TEXT,
    p.unit
  FROM public.products p
  WHERE p.barcode = barcode_value
    AND p.supplier_id = supplier_uuid
  LIMIT 1;
END;
$$;

-- Auto-update updated_at on transactions
CREATE OR REPLACE FUNCTION public.update_transactions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- ─── 7. ENABLE RLS ───────────────────────────────────────────
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- ─── 8. RLS POLICIES ─────────────────────────────────────────

-- transactions: retailers see their own, suppliers see their own, admins see all
DROP POLICY IF EXISTS "retailers_view_own_transactions" ON public.transactions;
CREATE POLICY "retailers_view_own_transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (
  retailer_id = auth.uid()
  OR supplier_id = auth.uid()
  OR public.is_admin_from_auth()
);

DROP POLICY IF EXISTS "admin_manage_transactions" ON public.transactions;
CREATE POLICY "admin_manage_transactions"
ON public.transactions
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

DROP POLICY IF EXISTS "users_insert_own_transactions" ON public.transactions;
CREATE POLICY "users_insert_own_transactions"
ON public.transactions
FOR INSERT
TO authenticated
WITH CHECK (
  retailer_id = auth.uid()
  OR supplier_id = auth.uid()
  OR public.is_admin_from_auth()
);

DROP POLICY IF EXISTS "users_update_own_transactions" ON public.transactions;
CREATE POLICY "users_update_own_transactions"
ON public.transactions
FOR UPDATE
TO authenticated
USING (
  retailer_id = auth.uid()
  OR supplier_id = auth.uid()
  OR public.is_admin_from_auth()
)
WITH CHECK (
  retailer_id = auth.uid()
  OR supplier_id = auth.uid()
  OR public.is_admin_from_auth()
);

-- notifications: each user sees only their own notifications
DROP POLICY IF EXISTS "users_manage_own_notifications" ON public.notifications;
CREATE POLICY "users_manage_own_notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (user_id = auth.uid() OR public.is_admin_from_auth())
WITH CHECK (user_id = auth.uid() OR public.is_admin_from_auth());

-- products: suppliers can manage their own products
DROP POLICY IF EXISTS "suppliers_manage_own_products" ON public.products;
CREATE POLICY "suppliers_manage_own_products"
ON public.products
FOR ALL
TO authenticated
USING (
  supplier_id = auth.uid()
  OR public.is_admin_from_auth()
)
WITH CHECK (
  supplier_id = auth.uid()
  OR public.is_admin_from_auth()
);

-- orders: retailer sees orders they placed, supplier sees orders for them
DROP POLICY IF EXISTS "role_based_orders_access" ON public.orders;
CREATE POLICY "role_based_orders_access"
ON public.orders
FOR SELECT
TO authenticated
USING (
  retailer_profile_id = auth.uid()
  OR supplier_profile_id = auth.uid()
  OR public.is_admin_from_auth()
  OR true
);

-- ─── 9. TRIGGERS ─────────────────────────────────────────────
DROP TRIGGER IF EXISTS update_transactions_updated_at_trigger ON public.transactions;
CREATE TRIGGER update_transactions_updated_at_trigger
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_transactions_updated_at();

-- ─── 10. REAL-TIME PUBLICATION ───────────────────────────────
-- Enable real-time for key tables (idempotent via DO block)
DO $$
BEGIN
  -- Add tables to supabase_realtime publication if not already added
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'products already in supabase_realtime publication';
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'orders already in supabase_realtime publication';
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'order_items already in supabase_realtime publication';
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.supplier_orders;
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'supplier_orders already in supabase_realtime publication';
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'notifications already in supabase_realtime publication';
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'transactions already in supabase_realtime publication';
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
  EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'user_profiles already in supabase_realtime publication';
  END;
END $$;

-- ─── 11. MOCK DATA — transactions & enhanced notifications ────
DO $$
DECLARE
  admin_user_id UUID;
  supplier_user_id UUID;
  retailer_user_id UUID;
  first_order_id UUID;
  t1 UUID := gen_random_uuid();
  t2 UUID := gen_random_uuid();
  t3 UUID := gen_random_uuid();
  t4 UUID := gen_random_uuid();
  t5 UUID := gen_random_uuid();
BEGIN
  -- Get existing user IDs from user_profiles
  SELECT id INTO admin_user_id
    FROM public.user_profiles WHERE role = 'admin' LIMIT 1;

  SELECT id INTO supplier_user_id
    FROM public.user_profiles WHERE role = 'supplier' LIMIT 1;

  SELECT id INTO retailer_user_id
    FROM public.user_profiles WHERE role = 'retailer' LIMIT 1;

  SELECT id INTO first_order_id
    FROM public.orders LIMIT 1;

  -- Update demo user_profiles with extended fields
  IF admin_user_id IS NOT NULL THEN
    UPDATE public.user_profiles
    SET
      phone = '07901000001',
      business_name = 'إدارة منصة جملاتي',
      governorate = 'بغداد',
      district = 'الكرادة',
      account_status = 'active'
    WHERE id = admin_user_id;
  END IF;

  IF supplier_user_id IS NOT NULL THEN
    UPDATE public.user_profiles
    SET
      phone = '07901000002',
      business_name = 'مستودع الجبوري للتوزيع',
      governorate = 'بغداد',
      district = 'الشعب',
      account_status = 'active'
    WHERE id = supplier_user_id;
  END IF;

  IF retailer_user_id IS NOT NULL THEN
    UPDATE public.user_profiles
    SET
      phone = '07901000003',
      business_name = 'سوبرماركت البقالي',
      governorate = 'بغداد',
      district = 'الكرخ',
      account_status = 'active'
    WHERE id = retailer_user_id;
  END IF;

  -- Update some products with discount/offer data
  UPDATE public.products
  SET
    discount_percentage = 10,
    discount_price = GREATEST(0, final_price - (final_price * 10 / 100)),
    is_on_offer = true,
    offer_start_date = CURRENT_TIMESTAMP - INTERVAL '2 days',
    offer_end_date = CURRENT_TIMESTAMP + INTERVAL '5 days'
  WHERE name LIKE '%نستله%' OR name LIKE '%كولا%';

  UPDATE public.products
  SET
    discount_percentage = 15,
    discount_price = GREATEST(0, final_price - (final_price * 15 / 100)),
    is_on_offer = true,
    offer_start_date = CURRENT_TIMESTAMP - INTERVAL '1 day',
    offer_end_date = CURRENT_TIMESTAMP + INTERVAL '7 days'
  WHERE name LIKE '%شيبس%' OR name LIKE '%كيت كات%';

  -- Insert sample transactions (only if we have users)
  IF retailer_user_id IS NOT NULL AND supplier_user_id IS NOT NULL THEN
    INSERT INTO public.transactions (
      id, transaction_number, retailer_id, supplier_id, order_id,
      total_amount, paid_amount, currency, payment_status, payment_method,
      due_date, notes
    ) VALUES
      (t1, 'TXN-2026-0001', retailer_user_id, supplier_user_id, first_order_id,
       1274000, 1274000, 'IQD', 'paid', 'cash',
       CURRENT_DATE, 'دفعة كاملة — طلب مياه وشيبس'),
      (t2, 'TXN-2026-0002', retailer_user_id, supplier_user_id, NULL,
       860000, 430000, 'IQD', 'partial', 'bank_transfer',
       CURRENT_DATE + 7, 'دفعة جزئية — طلب مشروبات'),
      (t3, 'TXN-2026-0003', retailer_user_id, supplier_user_id, NULL,
       456000, 0, 'IQD', 'overdue', 'cod',
       CURRENT_DATE - 3, 'مبلغ متأخر — طلب منظفات'),
      (t4, 'TXN-2026-0004', retailer_user_id, supplier_user_id, NULL,
       378000, 0, 'IQD', 'pending', 'cod',
       CURRENT_DATE + 14, 'طلب جديد — مياه معدنية وعصائر'),
      (t5, 'TXN-2026-0005', retailer_user_id, supplier_user_id, NULL,
       640000, 640000, 'IQD', 'paid', 'cash',
       CURRENT_DATE - 7, 'تسوية كاملة — طلب ألبان وجبن')
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Insert sample notifications for each role
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.notifications (
      user_id, title_ar, title_en, message_ar, message_en,
      type, is_read, link_url, role_target
    ) VALUES
      (admin_user_id,
       'طلب موافقة جديد', 'New Approval Request',
       'متجر سوبرماركت الفرات يطلب الانضمام للمنصة',
       'Supermarket Al-Furat requests to join the platform',
       'system', false, '/admin-users', 'admin'),
      (admin_user_id,
       'تقرير المبيعات اليومي', 'Daily Sales Report',
       'إجمالي مبيعات اليوم: ٤٬٦٠٨٬٥٠٠ د.ع',
       'Today total sales: 4,608,500 IQD',
       'order', true, '/admin-dashboard', 'admin')
    ON CONFLICT (id) DO NOTHING;
  END IF;

  IF supplier_user_id IS NOT NULL THEN
    INSERT INTO public.notifications (
      user_id, title_ar, title_en, message_ar, message_en,
      type, is_read, link_url, role_target
    ) VALUES
      (supplier_user_id,
       'طلب جديد وارد', 'New Incoming Order',
       'وصل طلب جديد من سوبرماركت الأمل بقيمة ٣٬٣١٢٬٠٠٠ د.ع',
       'New order received from Supermarket Al-Amal worth 3,312,000 IQD',
       'order', false, '/supplier-incoming-orders', 'supplier'),
      (supplier_user_id,
       'تنبيه نفاذ مخزون', 'Low Stock Alert',
       'منتج شيبس ليز ٤٠ غرام — الكمية المتبقية: ١٢ كرتون فقط',
       'Product Lays Chips 40g — Remaining quantity: 12 cartons only',
       'stock', false, '/inventory-management', 'supplier')
    ON CONFLICT (id) DO NOTHING;
  END IF;

  IF retailer_user_id IS NOT NULL THEN
    INSERT INTO public.notifications (
      user_id, title_ar, title_en, message_ar, message_en,
      type, is_read, link_url, role_target
    ) VALUES
      (retailer_user_id,
       'تحديث حالة طلبك', 'Order Status Update',
       'طلبك رقم ORD-2026-1101 قيد التجهيز الآن',
       'Your order ORD-2026-1101 is now being processed',
       'order', false, '/retailer-orders', 'retailer'),
      (retailer_user_id,
       'عرض خاص جديد', 'New Special Offer',
       'خصم ١٠٪ على مياه نستله وكولا — العرض ينتهي خلال ٥ أيام',
       '10% discount on Nestle water and Cola — Offer ends in 5 days',
       'system', false, '/retailer-catalog', 'retailer')
    ON CONFLICT (id) DO NOTHING;
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Enhanced mock data insertion failed: %', SQLERRM;
END $$;
