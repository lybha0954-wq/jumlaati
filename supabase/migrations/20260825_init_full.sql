-- ============================================================
-- 1. حذف السياسات القديمة (يعمل دائمًا بدون أخطاء)
-- ============================================================
DROP POLICY IF EXISTS "Users manage own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Read categories" ON public.categories;
DROP POLICY IF EXISTS "Read products" ON public.products;
DROP POLICY IF EXISTS "Suppliers manage own products" ON public.products;
DROP POLICY IF EXISTS "Users manage own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Supplier manages orders" ON public.orders;
DROP POLICY IF EXISTS "Retailer views orders" ON public.orders;
DROP POLICY IF EXISTS "Courier views assigned orders" ON public.orders;
DROP POLICY IF EXISTS "Read order items" ON public.order_items;
DROP POLICY IF EXISTS "Suppliers manage stock" ON public.stock_movements;
DROP POLICY IF EXISTS "Read transactions" ON public.transactions;
DROP POLICY IF EXISTS "Read ledger" ON public.ledger_entries;
DROP POLICY IF EXISTS "Users read own notifications" ON public.notifications;

-- ============================================================
-- 2. إنشاء الجداول (البنية الكاملة)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'retailer' CHECK (role IN ('admin', 'supplier', 'retailer', 'courier')),
    phone TEXT DEFAULT '',
    business_name TEXT DEFAULT '',
    governorate TEXT DEFAULT '',
    district TEXT DEFAULT '',
    address_details TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    employer_supplier_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    courier_status TEXT DEFAULT 'متواجد' CHECK (courier_status IN ('متواجد', 'مشغول', 'غائب')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barcode TEXT DEFAULT '',
    name TEXT NOT NULL,
    category TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    cost_price BIGINT NOT NULL DEFAULT 0,
    final_price BIGINT NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    min_order_qty INTEGER NOT NULL DEFAULT 1,
    unit TEXT NOT NULL DEFAULT 'قطعة',
    status TEXT NOT NULL DEFAULT 'متوفر' CHECK (status IN ('متوفر', 'منخفض', 'نفد', 'موقوف')),
    supplier_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    label TEXT DEFAULT 'المخزن الرئيسي',
    governorate TEXT DEFAULT '',
    district TEXT DEFAULT '',
    address_details TEXT DEFAULT '',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'reviewing' CHECK (status IN ('reviewing', 'assigned', 'delivering', 'completed', 'cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending', 'overdue')),
    retailer_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    supplier_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    courier_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ DEFAULT NULL,
    delivery_address TEXT DEFAULT '',
    delivery_city TEXT DEFAULT '',
    delivery_notes TEXT DEFAULT '',
    delivery_fee BIGINT DEFAULT 0,
    subtotal BIGINT DEFAULT 0,
    total BIGINT DEFAULT 0,
    commission BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    qty INTEGER NOT NULL DEFAULT 1,
    unit TEXT NOT NULL DEFAULT 'قطعة',
    unit_price BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    movement_type TEXT CHECK (movement_type IN ('in', 'out', 'damaged', 'returned')),
    quantity INTEGER NOT NULL,
    reason TEXT DEFAULT '',
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_number TEXT NOT NULL UNIQUE,
    retailer_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    supplier_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    amount BIGINT NOT NULL DEFAULT 0,
    payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'bank_transfer', 'wallet', 'credit')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
    paid_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_type TEXT NOT NULL CHECK (entry_type IN ('sale', 'payment', 'commission', 'adjustment')),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    amount BIGINT NOT NULL DEFAULT 0,
    balance_after BIGINT NOT NULL DEFAULT 0,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    link_url TEXT DEFAULT '',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. تفعيل الحماية (RLS) وإنشاء السياسات
-- ============================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own profile" ON public.user_profiles FOR ALL TO authenticated USING (id = auth.uid() OR employer_supplier_id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Read categories" ON public.categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Read products" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Suppliers manage own products" ON public.products FOR ALL TO authenticated USING (auth.uid() = supplier_id) WITH CHECK (auth.uid() = supplier_id);
CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Supplier manages orders" ON public.orders FOR ALL TO authenticated USING (supplier_id = auth.uid()) WITH CHECK (supplier_id = auth.uid());
CREATE POLICY "Retailer views orders" ON public.orders FOR SELECT TO authenticated USING (retailer_id = auth.uid());
CREATE POLICY "Courier views assigned orders" ON public.orders FOR SELECT TO authenticated USING (courier_id = auth.uid());
CREATE POLICY "Read order items" ON public.order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Suppliers manage stock" ON public.stock_movements FOR ALL TO authenticated USING (true);
CREATE POLICY "Read transactions" ON public.transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Read ledger" ON public.ledger_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());

-- ============================================================
-- 4. إضافة البيانات التجريبية (أربعة حسابات + منتجات + طلب)
-- ============================================================
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data, raw_app_meta_data, is_sso_user, is_anonymous)
VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"full_name":"مدير النظام","role":"admin"}', '{"provider":"email","providers":["email"]}', false, false),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'supplier@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"full_name":"أحمد المورد","role":"supplier"}', '{"provider":"email","providers":["email"]}', false, false),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'retailer@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"full_name":"حسن التاجر","role":"retailer"}', '{"provider":"email","providers":["email"]}', false, false),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'courier@test.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"full_name":"علي الموصل","role":"courier"}', '{"provider":"email","providers":["email"]}', false, false);

INSERT INTO public.user_profiles (id, email, full_name, role, phone, business_name, governorate, district, address_details)
SELECT id, email, raw_user_meta_data->>'full_name', raw_user_meta_data->>'role', '07700000000', 'شركة تجريبية', 'بغداد', 'الكرادة', 'شارع تجريبي' FROM auth.users WHERE email IN ('admin@test.com', 'supplier@test.com', 'retailer@test.com', 'courier@test.com');

UPDATE public.user_profiles SET employer_supplier_id = (SELECT id FROM public.user_profiles WHERE email = 'supplier@test.com') WHERE email = 'courier@test.com';

INSERT INTO public.products (name, category, cost_price, final_price, stock, min_order_qty, unit, supplier_id)
SELECT 'حليب نيدو 2.5 كجم', 'مواد غذائية', 18000, 22000, 150, 5, 'كرتون', id FROM public.user_profiles WHERE email = 'supplier@test.com';

INSERT INTO public.products (name, category, cost_price, final_price, stock, min_order_qty, unit, supplier_id)
SELECT 'رز بسمتي 5 كجم', 'حبوب', 12000, 15500, 80, 10, 'كيس', id FROM public.user_profiles WHERE email = 'supplier@test.com';
