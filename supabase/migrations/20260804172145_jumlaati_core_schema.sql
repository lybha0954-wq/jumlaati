-- ============================================================
-- Jumlaati Platform — Core Schema Migration
-- ============================================================

-- ─── 1. ENUM TYPES ───────────────────────────────────────────
DROP TYPE IF EXISTS public.user_role CASCADE;
CREATE TYPE public.user_role AS ENUM ('admin', 'supplier', 'retailer');

DROP TYPE IF EXISTS public.product_status CASCADE;
CREATE TYPE public.product_status AS ENUM ('متوفر', 'منخفض', 'نفد', 'موقوف');

DROP TYPE IF EXISTS public.store_status CASCADE;
CREATE TYPE public.store_status AS ENUM ('active', 'pending', 'suspended');

DROP TYPE IF EXISTS public.order_status CASCADE;
CREATE TYPE public.order_status AS ENUM ('reviewing', 'delivering', 'completed', 'cancelled');

DROP TYPE IF EXISTS public.supplier_order_status CASCADE;
CREATE TYPE public.supplier_order_status AS ENUM ('pending', 'ready', 'shipped');

DROP TYPE IF EXISTS public.payment_status CASCADE;
CREATE TYPE public.payment_status AS ENUM ('paid', 'pending', 'overdue');

DROP TYPE IF EXISTS public.ledger_entry_type CASCADE;
CREATE TYPE public.ledger_entry_type AS ENUM ('order', 'payment', 'adjustment');

DROP TYPE IF EXISTS public.ledger_direction CASCADE;
CREATE TYPE public.ledger_direction AS ENUM ('debit', 'credit');

DROP TYPE IF EXISTS public.ledger_status CASCADE;
CREATE TYPE public.ledger_status AS ENUM ('completed', 'pending', 'overdue');

DROP TYPE IF EXISTS public.supplier_credit_status CASCADE;
CREATE TYPE public.supplier_credit_status AS ENUM ('good', 'warning', 'overdue');

-- ─── 2. CORE TABLES ──────────────────────────────────────────

-- User Profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT DEFAULT '',
  role public.user_role DEFAULT 'retailer'::public.user_role,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT NOT NULL DEFAULT '',
  rating NUMERIC(3,1) DEFAULT 4.5,
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  credit_limit BIGINT DEFAULT 0,
  credit_used BIGINT DEFAULT 0,
  pending_debt BIGINT DEFAULT 0,
  due_days INTEGER DEFAULT 30,
  credit_status public.supplier_credit_status DEFAULT 'good'::public.supplier_credit_status,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Stores (Retailers)
CREATE TABLE IF NOT EXISTS public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  city TEXT DEFAULT '',
  status public.store_status DEFAULT 'pending'::public.store_status,
  join_date DATE DEFAULT CURRENT_DATE,
  total_orders INTEGER DEFAULT 0,
  total_spent BIGINT DEFAULT 0,
  credit_limit BIGINT DEFAULT 0,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  cost_price BIGINT NOT NULL DEFAULT 0,
  original_price BIGINT NOT NULL DEFAULT 0,
  final_price BIGINT NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  min_order_qty INTEGER NOT NULL DEFAULT 1,
  status public.product_status DEFAULT 'متوفر'::public.product_status,
  unit TEXT NOT NULL DEFAULT 'قطعة',
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  supplier_name TEXT DEFAULT '',
  supplier_rating NUMERIC(3,1) DEFAULT 4.5,
  delivery_days INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Ensure all required columns exist on products (handles pre-existing tables)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS barcode TEXT NOT NULL DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cost_price BIGINT NOT NULL DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price BIGINT NOT NULL DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS final_price BIGINT NOT NULL DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS min_order_qty INTEGER NOT NULL DEFAULT 1;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS unit TEXT NOT NULL DEFAULT 'قطعة';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS supplier_name TEXT DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS supplier_rating NUMERIC(3,1) DEFAULT 4.5;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS status public.product_status DEFAULT 'متوفر'::public.product_status;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS delivery_days INTEGER DEFAULT 1;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- Orders (Incoming — from retailers)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  placed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  status public.order_status DEFAULT 'reviewing'::public.order_status,
  payment_status public.payment_status DEFAULT 'pending'::public.payment_status,
  buyer_name TEXT NOT NULL DEFAULT '',
  buyer_store_name TEXT NOT NULL DEFAULT '',
  buyer_phone TEXT DEFAULT '',
  delivery_address TEXT DEFAULT '',
  delivery_city TEXT DEFAULT '',
  delivery_notes TEXT DEFAULT '',
  subtotal BIGINT DEFAULT 0,
  delivery_fee BIGINT DEFAULT 0,
  total BIGINT DEFAULT 0,
  commission BIGINT DEFAULT 0,
  payment_method TEXT DEFAULT 'cod',
  store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Ensure all required columns exist on orders (handles pre-existing tables)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS placed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_number TEXT NOT NULL DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status public.order_status DEFAULT 'reviewing'::public.order_status;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status public.payment_status DEFAULT 'pending'::public.payment_status;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS buyer_name TEXT NOT NULL DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS buyer_store_name TEXT NOT NULL DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS buyer_phone TEXT DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_address TEXT DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_city TEXT DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_notes TEXT DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subtotal BIGINT DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_fee BIGINT DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total BIGINT DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS commission BIGINT DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cod';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- Order Line Items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'قطعة',
  unit_price BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Supplier Orders
CREATE TABLE IF NOT EXISTS public.supplier_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  placed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  status public.supplier_order_status DEFAULT 'pending'::public.supplier_order_status,
  payment_status public.payment_status DEFAULT 'pending'::public.payment_status,
  customer_name TEXT NOT NULL DEFAULT '',
  customer_store_name TEXT NOT NULL DEFAULT '',
  customer_phone TEXT DEFAULT '',
  delivery_address TEXT DEFAULT '',
  delivery_city TEXT DEFAULT '',
  delivery_notes TEXT DEFAULT '',
  total BIGINT DEFAULT 0,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Ensure all required columns exist on supplier_orders (handles pre-existing tables)
ALTER TABLE public.supplier_orders ADD COLUMN IF NOT EXISTS placed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.supplier_orders ADD COLUMN IF NOT EXISTS order_number TEXT NOT NULL DEFAULT '';
ALTER TABLE public.supplier_orders ADD COLUMN IF NOT EXISTS status public.supplier_order_status DEFAULT 'pending'::public.supplier_order_status;
ALTER TABLE public.supplier_orders ADD COLUMN IF NOT EXISTS payment_status public.payment_status DEFAULT 'pending'::public.payment_status;
ALTER TABLE public.supplier_orders ADD COLUMN IF NOT EXISTS customer_name TEXT NOT NULL DEFAULT '';
ALTER TABLE public.supplier_orders ADD COLUMN IF NOT EXISTS customer_store_name TEXT NOT NULL DEFAULT '';
ALTER TABLE public.supplier_orders ADD COLUMN IF NOT EXISTS customer_phone TEXT DEFAULT '';
ALTER TABLE public.supplier_orders ADD COLUMN IF NOT EXISTS delivery_address TEXT DEFAULT '';
ALTER TABLE public.supplier_orders ADD COLUMN IF NOT EXISTS delivery_city TEXT DEFAULT '';
ALTER TABLE public.supplier_orders ADD COLUMN IF NOT EXISTS delivery_notes TEXT DEFAULT '';
ALTER TABLE public.supplier_orders ADD COLUMN IF NOT EXISTS total BIGINT DEFAULT 0;
ALTER TABLE public.supplier_orders ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL;
ALTER TABLE public.supplier_orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.supplier_orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- Supplier Order Line Items
CREATE TABLE IF NOT EXISTS public.supplier_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_order_id UUID NOT NULL REFERENCES public.supplier_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'قطعة',
  unit_price BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Commissions
CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  retailer_name TEXT NOT NULL DEFAULT '',
  order_total BIGINT NOT NULL DEFAULT 0,
  commission BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Ledger Entries
CREATE TABLE IF NOT EXISTS public.ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  supplier_id TEXT NOT NULL DEFAULT '',
  supplier_name TEXT NOT NULL DEFAULT '',
  entry_type public.ledger_entry_type DEFAULT 'order'::public.ledger_entry_type,
  description TEXT NOT NULL DEFAULT '',
  amount BIGINT NOT NULL DEFAULT 0,
  direction public.ledger_direction DEFAULT 'debit'::public.ledger_direction,
  balance BIGINT DEFAULT 0,
  order_id TEXT DEFAULT '',
  payment_method TEXT DEFAULT 'cash',
  status public.ledger_status DEFAULT 'pending'::public.ledger_status,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ─── 3. INDEXES ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON public.products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_placed_at ON public.orders(placed_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_supplier_orders_status ON public.supplier_orders(status);
CREATE INDEX IF NOT EXISTS idx_supplier_orders_supplier_id ON public.supplier_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_order_items_order_id ON public.supplier_order_items(supplier_order_id);
CREATE INDEX IF NOT EXISTS idx_commissions_order_date ON public.commissions(order_date DESC);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_supplier_id ON public.ledger_entries(supplier_id);
CREATE INDEX IF NOT EXISTS idx_stores_status ON public.stores(status);

-- ─── 4. FUNCTIONS ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'retailer')::public.user_role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
  SELECT 1 FROM auth.users au
  WHERE au.id = auth.uid()
  AND (au.raw_user_meta_data->>'role' = 'admin'
       OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

-- ─── 5. ENABLE RLS ───────────────────────────────────────────
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;

-- ─── 6. RLS POLICIES ─────────────────────────────────────────

-- user_profiles
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_manage_own_user_profiles" ON public.user_profiles
FOR ALL TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_user_profiles" ON public.user_profiles;
CREATE POLICY "admin_full_access_user_profiles" ON public.user_profiles
FOR ALL TO authenticated USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- suppliers — open read, admin write
DROP POLICY IF EXISTS "public_read_suppliers" ON public.suppliers;
CREATE POLICY "public_read_suppliers" ON public.suppliers
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_manage_suppliers" ON public.suppliers;
CREATE POLICY "admin_manage_suppliers" ON public.suppliers
FOR ALL TO authenticated USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- stores — open read, admin write
DROP POLICY IF EXISTS "public_read_stores" ON public.stores;
CREATE POLICY "public_read_stores" ON public.stores
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_manage_stores" ON public.stores;
CREATE POLICY "admin_manage_stores" ON public.stores
FOR ALL TO authenticated USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- products — open read, admin write
DROP POLICY IF EXISTS "public_read_products" ON public.products;
CREATE POLICY "public_read_products" ON public.products
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_manage_products" ON public.products;
CREATE POLICY "admin_manage_products" ON public.products
FOR ALL TO authenticated USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- orders — open read/write for authenticated
DROP POLICY IF EXISTS "authenticated_manage_orders" ON public.orders;
CREATE POLICY "authenticated_manage_orders" ON public.orders
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- order_items
DROP POLICY IF EXISTS "authenticated_manage_order_items" ON public.order_items;
CREATE POLICY "authenticated_manage_order_items" ON public.order_items
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- supplier_orders
DROP POLICY IF EXISTS "authenticated_manage_supplier_orders" ON public.supplier_orders;
CREATE POLICY "authenticated_manage_supplier_orders" ON public.supplier_orders
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- supplier_order_items
DROP POLICY IF EXISTS "authenticated_manage_supplier_order_items" ON public.supplier_order_items;
CREATE POLICY "authenticated_manage_supplier_order_items" ON public.supplier_order_items
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- commissions
DROP POLICY IF EXISTS "authenticated_manage_commissions" ON public.commissions;
CREATE POLICY "authenticated_manage_commissions" ON public.commissions
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ledger_entries
DROP POLICY IF EXISTS "authenticated_manage_ledger_entries" ON public.ledger_entries;
CREATE POLICY "authenticated_manage_ledger_entries" ON public.ledger_entries
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ─── 7. TRIGGERS ─────────────────────────────────────────────
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── 8. MOCK DATA ────────────────────────────────────────────
DO $$
DECLARE
  sup1 UUID := gen_random_uuid();
  sup2 UUID := gen_random_uuid();
  sup3 UUID := gen_random_uuid();
  sup4 UUID := gen_random_uuid();
  p1 UUID := gen_random_uuid();
  p2 UUID := gen_random_uuid();
  p3 UUID := gen_random_uuid();
  p4 UUID := gen_random_uuid();
  p5 UUID := gen_random_uuid();
  p6 UUID := gen_random_uuid();
  p7 UUID := gen_random_uuid();
  p8 UUID := gen_random_uuid();
  p9 UUID := gen_random_uuid();
  p10 UUID := gen_random_uuid();
  p11 UUID := gen_random_uuid();
  p12 UUID := gen_random_uuid();
  o1 UUID := gen_random_uuid();
  o2 UUID := gen_random_uuid();
  o3 UUID := gen_random_uuid();
  o4 UUID := gen_random_uuid();
  o5 UUID := gen_random_uuid();
  so1 UUID := gen_random_uuid();
  so2 UUID := gen_random_uuid();
  so3 UUID := gen_random_uuid();
  so4 UUID := gen_random_uuid();
  so5 UUID := gen_random_uuid();
BEGIN

  -- Suppliers
  INSERT INTO public.suppliers (id, name, region, rating, phone, is_active, credit_limit, credit_used, pending_debt, due_days, credit_status)
  VALUES
    (sup1, 'مستودع الجبوري', 'بغداد / الكرادة', 4.8, '07701000001', true, 750000, 312500, 187500, 8, 'good'::public.supplier_credit_status),
    (sup2, 'شركة الفرات للتوزيع', 'بغداد / الشعب', 4.5, '07701000002', true, 500000, 430000, 430000, 2, 'warning'::public.supplier_credit_status),
    (sup3, 'مستودع النجوم', 'بغداد / الزعفرانية', 4.6, '07701000003', true, 400000, 95000, 0, 0, 'good'::public.supplier_credit_status),
    (sup4, 'مجمع الرافدين التجاري', 'بغداد / الأعظمية', 4.3, '07701000004', true, 600000, 600000, 600000, -3, 'overdue'::public.supplier_credit_status)
  ON CONFLICT (id) DO NOTHING;

  -- Stores
  INSERT INTO public.stores (id, name, owner, phone, city, status, join_date, total_orders, total_spent, credit_limit)
  VALUES
    (gen_random_uuid(), 'سوبرماركت الأمل', 'كريم حسن', '07701234567', 'بغداد - الكرخ', 'active'::public.store_status, '2025-03-12', 87, 4200000, 500000),
    (gen_random_uuid(), 'متجر النور', 'سامي علي', '07809876543', 'بغداد - الرصافة', 'active'::public.store_status, '2025-01-05', 124, 7800000, 750000),
    (gen_random_uuid(), 'سوبرماركت الفرات', 'أحمد محمد', '07712345678', 'البصرة', 'pending'::public.store_status, '2026-07-28', 0, 0, 0),
    (gen_random_uuid(), 'متجر الرافدين', 'عمر خالد', '07801122334', 'الموصل', 'active'::public.store_status, '2024-11-20', 203, 12500000, 1000000),
    (gen_random_uuid(), 'سوبرماركت الزهراء', 'فاطمة جاسم', '07755667788', 'بغداد - الجادرية', 'suspended'::public.store_status, '2025-06-14', 45, 1800000, 300000),
    (gen_random_uuid(), 'متجر السلام', 'حيدر عباس', '07799001122', 'كربلاء', 'active'::public.store_status, '2025-09-03', 61, 3100000, 400000),
    (gen_random_uuid(), 'سوبرماركت الوفاء', 'زينب حمدان', '07733445566', 'النجف', 'pending'::public.store_status, '2026-08-01', 0, 0, 0),
    (gen_random_uuid(), 'متجر الحضارة', 'مصطفى ناصر', '07766778899', 'بغداد - الكاظمية', 'active'::public.store_status, '2024-08-17', 178, 9400000, 800000)
  ON CONFLICT (id) DO NOTHING;

  -- Products
  INSERT INTO public.products (id, barcode, name, category, cost_price, original_price, final_price, stock, min_order_qty, status, unit, supplier_id, supplier_name, supplier_rating, delivery_days)
  VALUES
    (p1,  '6291001234567', 'مياه نستله 500 مل',       'مشروبات',       8500,  10000, 12000, 480, 24, 'متوفر'::public.product_status, 'قطعة',   sup1, 'مستودع الجبوري',         4.8, 1),
    (p2,  '6281001234568', 'شيبس ليز 40 غرام',         'وجبات خفيفة',   2200,  2800,  3200,  12,  12, 'منخفض'::public.product_status, 'كرتون',  sup1, 'مستودع الجبوري',         4.8, 1),
    (p3,  '6291109876543', 'كولا 330 مل',               'مشروبات',       1100,  1400,  1700,  320, 24, 'متوفر'::public.product_status, 'قطعة',   sup1, 'مستودع الجبوري',         4.8, 1),
    (p4,  '6281234567890', 'نسكافيه 3 في 1 علبة',       'قهوة وشاي',     32000, 40000, 47500, 88,  6,  'متوفر'::public.product_status, 'علبة',   sup2, 'شركة الفرات للتوزيع',   4.5, 2),
    (p5,  '6291087654321', 'زيت عباد الشمس 1.5 لتر',   'زيوت',          15000, 19000, 22000, 5,   12, 'منخفض'::public.product_status, 'قطعة',   sup2, 'شركة الفرات للتوزيع',   4.5, 2),
    (p6,  '6281098765432', 'سكر أبيض 2 كغ',             'بقالة أساسية',  6500,  8000,  9500,  0,   20, 'نفد'::public.product_status,   'كيس',    sup2, 'شركة الفرات للتوزيع',   4.5, 2),
    (p7,  '6291076543210', 'شاي أحمر 100 كيس',          'قهوة وشاي',     14000, 17500, 21000, 145, 6,  'متوفر'::public.product_status, 'علبة',   sup3, 'مستودع النجوم',          4.6, 1),
    (p8,  '6281065432109', 'معجون طماطم هاينز 400غ',    'معلبات',        5500,  7000,  8500,  67,  12, 'متوفر'::public.product_status, 'قطعة',   sup3, 'مستودع النجوم',          4.6, 1),
    (p9,  '6291054321098', 'رز أبو بنت 5 كغ',           'بقالة أساسية',  23000, 28000, 32000, 38,  10, 'متوفر'::public.product_status, 'كيس',    sup3, 'مستودع النجوم',          4.6, 1),
    (p10, '6281043210987', 'نستله كيت كات 45غ',          'حلويات',        1800,  2300,  2800,  8,   24, 'منخفض'::public.product_status, 'قطعة',   sup1, 'مستودع الجبوري',         4.8, 1),
    (p11, '6291032109876', 'دانون زبادي 150غ',           'ألبان',         1200,  1600,  1900,  0,   48, 'موقوف'::public.product_status, 'قطعة',   sup3, 'مستودع النجوم',          4.6, 1),
    (p12, '6281021098765', 'مسحوق غسيل تايد 3كغ',       'منظفات',        18000, 23000, 27500, 92,  6,  'متوفر'::public.product_status, 'علبة',   sup2, 'شركة الفرات للتوزيع',   4.5, 2)
  ON CONFLICT (id) DO NOTHING;

  -- Incoming Orders
  INSERT INTO public.orders (id, order_number, placed_at, status, payment_status, buyer_name, buyer_store_name, buyer_phone, delivery_address, delivery_city, delivery_notes, subtotal, delivery_fee, total, commission)
  VALUES
    (o1, 'ORD-2026-1101', '2026-08-04 10:30:00+03', 'reviewing'::public.order_status,  'pending'::public.payment_status, 'علي محمد',    'سوبرماركت الفرات', '07701112233', 'شارع الكرادة، بناية ٥',                  'بغداد - الكرخ',    'التوصيل صباحاً', 1271000, 3000, 1274000, 25480),
    (o2, 'ORD-2026-1100', '2026-08-04 09:15:00+03', 'delivering'::public.order_status, 'paid'::public.payment_status,    'حسن عبدالله', 'متجر الأندلس',     '07809988776', 'حي الزيتون، قرب الجامع',                 'بغداد - الرصافة',  '',               1860000, 3500, 1863500, 37270),
    (o3, 'ORD-2026-1099', '2026-08-03 16:00:00+03', 'completed'::public.order_status,  'paid'::public.payment_status,    'كريم جاسم',   'متجر الرافدين',    '07801234567', 'شارع النجفي، بجانب المستشفى',            'الموصل',           '',               640000,  8000, 648000,  12960),
    (o4, 'ORD-2026-1098', '2026-08-03 13:45:00+03', 'cancelled'::public.order_status,  'overdue'::public.payment_status, 'سعد ناصر',    'متجر السلام',      '07799001122', 'شارع الإمام علي، مقابل الحسينية',        'كربلاء',           '',               456000,  9000, 465000,  9300),
    (o5, 'ORD-2026-1097', '2026-08-03 11:20:00+03', 'reviewing'::public.order_status,  'pending'::public.payment_status, 'مصطفى عمر',   'متجر الحضارة',     '07766778899', 'منطقة الكاظمية، شارع الإمام الكاظم',     'بغداد - الكاظمية', 'مستودع خلفي',    378000,  3000, 381000,  7620)
  ON CONFLICT (id) DO NOTHING;

  -- Order Items
  INSERT INTO public.order_items (order_id, name, qty, unit, unit_price)
  VALUES
    (o1, 'زيت نباتي ٥ لتر',    15, 'كرتون',  85000),
    (o1, 'سكر أبيض ٥٠ كغ',     8,  'كيس',    62000),
    (o2, 'أرز بسمتي ٢٥ كغ',    10, 'كيس',    74000),
    (o2, 'معكرونة ٥٠٠غ',       40, 'كرتون',  28000),
    (o3, 'حليب كامل الدسم ١ لتر', 80, 'علبة', 3500),
    (o3, 'جبنة بيضاء ١ كغ',    30, 'قطعة',   12000),
    (o4, 'دقيق قمح ٢٥ كغ',     12, 'كيس',    38000),
    (o5, 'مياه معدنية ١.٥ لتر', 150,'زجاجة',  1200),
    (o5, 'عصير برتقال ١ لتر',   36, 'علبة',   5500)
  ON CONFLICT (id) DO NOTHING;

  -- Supplier Orders
  INSERT INTO public.supplier_orders (id, order_number, placed_at, status, payment_status, customer_name, customer_store_name, customer_phone, delivery_address, delivery_city, delivery_notes, total, supplier_id)
  VALUES
    (so1, 'ORD-2026-0841', '2026-08-04 09:15:00+03', 'pending'::public.supplier_order_status, 'pending'::public.payment_status, 'كريم حسن',    'سوبرماركت الأمل',  '07701234567', 'شارع الكرادة، بناية رقم ١٢',              'بغداد - الكرخ',    'التوصيل قبل الظهر', 3312000, sup1),
    (so2, 'ORD-2026-0840', '2026-08-04 08:40:00+03', 'ready'::public.supplier_order_status,   'paid'::public.payment_status,    'سامي علي',    'متجر النور',        '07809876543', 'حي الزيتون، قرب جامع الرحمن',            'بغداد - الرصافة',  '',               2450000, sup2),
    (so3, 'ORD-2026-0839', '2026-08-03 16:22:00+03', 'shipped'::public.supplier_order_status, 'paid'::public.payment_status,    'عمر خالد',    'متجر الرافدين',     '07801122334', 'شارع النجفي، بجانب مستشفى الجمهوري',     'الموصل',           'الاتصال قبل الوصول', 1000000, sup3),
    (so4, 'ORD-2026-0838', '2026-08-03 14:05:00+03', 'pending'::public.supplier_order_status, 'overdue'::public.payment_status, 'حيدر عباس',   'متجر السلام',       '07799001122', 'شارع الإمام علي، مقابل الحسينية الكبرى', 'كربلاء',           '',               774000,  sup4),
    (so5, 'ORD-2026-0837', '2026-08-03 11:30:00+03', 'ready'::public.supplier_order_status,   'pending'::public.payment_status, 'مصطفى ناصر',  'متجر الحضارة',      '07766778899', 'منطقة الكاظمية، شارع الإمام الكاظم',     'بغداد - الكاظمية', 'مستودع خلفي',    506400,  sup1)
  ON CONFLICT (id) DO NOTHING;

  -- Supplier Order Items
  INSERT INTO public.supplier_order_items (supplier_order_id, name, qty, unit, unit_price)
  VALUES
    (so1, 'زيت نباتي ٥ لتر',    20, 'كرتون',  85000),
    (so1, 'سكر أبيض ٥٠ كغ',     10, 'كيس',    62000),
    (so1, 'أرز بسمتي ٢٥ كغ',    8,  'كيس',    74000),
    (so2, 'معكرونة ٥٠٠غ',       50, 'كرتون',  28000),
    (so2, 'صلصة طماطم ٤٠٠غ',    30, 'كرتون',  35000),
    (so3, 'حليب كامل الدسم ١ لتر', 100, 'علبة', 3500),
    (so3, 'جبنة بيضاء ١ كغ',    40, 'قطعة',   12000),
    (so3, 'زبادي طبيعي ٥٠٠غ',   60, 'علبة',   4500),
    (so4, 'دقيق قمح ٢٥ كغ',     15, 'كيس',    38000),
    (so4, 'خميرة فورية ٥٠٠غ',   24, 'علبة',   8500),
    (so5, 'مياه معدنية ١.٥ لتر', 200,'زجاجة',  1200),
    (so5, 'عصير برتقال ١ لتر',   48, 'علبة',   5500),
    (so5, 'مشروب غازي ٢٥٠مل',   120,'علبة',   1800)
  ON CONFLICT (id) DO NOTHING;

  -- Commissions (historical)
  INSERT INTO public.commissions (order_id, order_date, retailer_name, order_total, commission)
  VALUES
    ('ORD-2026-1101', '2026-08-04', 'سوبرماركت الفرات', 1274000, 25480),
    ('ORD-2026-1100', '2026-08-04', 'متجر الأندلس',     1863500, 37270),
    ('ORD-2026-1099', '2026-08-03', 'متجر الرافدين',    648000,  12960),
    ('ORD-2026-1097', '2026-08-03', 'متجر الحضارة',     381000,  7620)
  ON CONFLICT (id) DO NOTHING;

  -- Ledger Entries (historical)
  INSERT INTO public.ledger_entries (entry_date, supplier_id, supplier_name, entry_type, description, amount, direction, balance, order_id, payment_method, status)
  VALUES
    ('2026-08-04', 'sup-001', 'مستودع الجبوري',         'order'::public.ledger_entry_type,   'طلب #ORD-3021 — مياه نستله، شيبس ليز، كولا',    187500, 'debit'::public.ledger_direction,  -312500, 'ORD-3021', 'credit', 'pending'::public.ledger_status),
    ('2026-08-03', 'sup-002', 'شركة الفرات للتوزيع',    'order'::public.ledger_entry_type,   'طلب #ORD-3019 — زيت، سكر، مسحوق غسيل',          230000, 'debit'::public.ledger_direction,  -430000, 'ORD-3019', 'credit', 'overdue'::public.ledger_status),
    ('2026-08-02', 'sup-001', 'مستودع الجبوري',         'payment'::public.ledger_entry_type, 'دفعة نقدية — تسوية جزئية',                       125000, 'credit'::public.ledger_direction, -125000, '',         'cash',   'completed'::public.ledger_status),
    ('2026-08-01', 'sup-003', 'مستودع النجوم',          'payment'::public.ledger_entry_type, 'دفعة كاملة — تسوية الحساب',                       95000,  'credit'::public.ledger_direction, 0,       '',         'cash',   'completed'::public.ledger_status),
    ('2026-07-30', 'sup-004', 'مجمع الرافدين التجاري',  'order'::public.ledger_entry_type,   'طلب #ORD-3015 — شاي، نسكافيه، رز',               600000, 'debit'::public.ledger_direction,  -600000, 'ORD-3015', 'credit', 'overdue'::public.ledger_status),
    ('2026-07-28', 'sup-003', 'مستودع النجوم',          'order'::public.ledger_entry_type,   'طلب #ORD-3012 — دانون زبادي، معجون طماطم',        95000,  'debit'::public.ledger_direction,  -95000,  'ORD-3012', 'credit', 'completed'::public.ledger_status),
    ('2026-07-25', 'sup-002', 'شركة الفرات للتوزيع',    'payment'::public.ledger_entry_type, 'دفعة جزئية',                                      200000, 'credit'::public.ledger_direction, -200000, '',         'cash',   'completed'::public.ledger_status),
    ('2026-07-22', 'sup-002', 'شركة الفرات للتوزيع',    'order'::public.ledger_entry_type,   'طلب #ORD-3008 — نسكافيه، زيت عباد الشمس',        430000, 'debit'::public.ledger_direction,  -430000, 'ORD-3008', 'credit', 'completed'::public.ledger_status)
  ON CONFLICT (id) DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;
