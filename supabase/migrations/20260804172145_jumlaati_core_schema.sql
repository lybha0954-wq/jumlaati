-- ============================================================
-- Jumlaati Platform — Core Schema Migration (Updated)
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
            phone TEXT DEFAULT '',
              role public.user_role DEFAULT 'retailer'::public.user_role,
                is_active BOOLEAN DEFAULT true,
                  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
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
            image_url TEXT DEFAULT '',
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

-- Orders
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

)
)
)
)
)-- ─── 3. INDEXES ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON public.products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON public.orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_placed_at ON public.orders(placed_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_supplier_orders_status ON public.supplier_orders(status);
CREATE INDEX IF NOT EXISTS idx_supplier_orders_supplier_id ON public.supplier_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_order_items_order_id ON public.supplier_order_items(supplier_order_id);
CREATE INDEX IF NOT EXISTS idx_commissions_order_date ON public.commissions(order_date DESC);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_supplier_id ON public.ledger_entries(supplier_id);
CREATE INDEX IF NOT EXISTS idx_stores_status ON public.stores(status);
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON public.stores(user_id);

-- ─── 4. FUNCTIONS & TRIGGERS ─────────────────────────────────

-- Function to handle new user registration from Supabase Auth
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

        -- Helper Function: Check Admin Status
        CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
        RETURNS BOOLEAN
        LANGUAGE sql
        STABLE
        SECURITY DEFINER
        AS $$
        SELECT EXISTS (
            SELECT 1 FROM public.user_profiles
              WHERE id = auth.uid() AND role = 'admin'::public.user_role
        )
        $$;

        -- Trigger: Handle new user creation
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

            -- Trigger Function: Auto-update updated_at timestamp
            CREATE OR REPLACE FUNCTION public.update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
              NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;

                CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
                CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
                CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
                CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
                CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

                -- ─── 5. ENABLE ROW LEVEL SECURITY ───────────────────────────
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

                -- user_profiles Policies
                DROP POLICY IF EXISTS "users_read_own_profile" ON public.user_profiles;
                CREATE POLICY "users_read_own_profile" ON public.user_profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_admin_from_auth());

                DROP POLICY IF EXISTS "users_update_own_profile" ON public.user_profiles;
                CREATE POLICY "users_update_own_profile" ON public.user_profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

                -- suppliers Policies
                DROP POLICY IF EXISTS "suppliers_read_all" ON public.suppliers;
                CREATE POLICY "suppliers_read_all" ON public.suppliers FOR SELECT TO authenticated USING (true);

                DROP POLICY IF EXISTS "suppliers_admin_all" ON public.suppliers;
                CREATE POLICY "suppliers_admin_all" ON public.suppliers FOR ALL TO authenticated USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

                -- stores Policies
                DROP POLICY IF EXISTS "stores_read_own_or_admin" ON public.stores;
                CREATE POLICY "stores_read_own_or_admin" ON public.stores FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin_from_auth());

                DROP POLICY IF EXISTS "stores_manage_own_or_admin" ON public.stores;
                CREATE POLICY "stores_manage_own_or_admin" ON public.stores FOR ALL TO authenticated USING (user_id = auth.uid() OR public.is_admin_from_auth());

                -- products Policies
                DROP POLICY IF EXISTS "products_read_all" ON public.products;
                CREATE POLICY "products_read_all" ON public.products FOR SELECT TO authenticated USING (true);

                DROP POLICY IF EXISTS "products_supplier_manage" ON public.products;
                CREATE POLICY "products_supplier_manage" ON public.products FOR ALL TO authenticated 
                USING (
                    EXISTS (SELECT 1 FROM public.suppliers WHERE user_id = auth.uid() AND id = products.supplier_id) 
                      OR public.is_admin_from_auth()
                );

                -- orders & items Policies
                DROP POLICY IF EXISTS "orders_authenticated_access" ON public.orders;
                CREATE POLICY "orders_authenticated_access" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

                DROP POLICY IF EXISTS "order_items_authenticated_access" ON public.order_items;
                CREATE POLICY "order_items_authenticated_access" ON public.order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

                DROP POLICY IF EXISTS "supplier_orders_authenticated_access" ON public.supplier_orders;
                CREATE POLICY "supplier_orders_authenticated_access" ON public.supplier_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

                DROP POLICY IF EXISTS "supplier_order_items_authenticated_access" ON public.supplier_order_items;
                CREATE POLICY "supplier_order_items_authenticated_access" ON public.supplier_order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

                DROP POLICY IF EXISTS "commissions_admin_access" ON public.commissions;
                CREATE POLICY "commissions_admin_access" ON public.commissions FOR ALL TO authenticated USING (public.is_admin_from_auth());

                DROP POLICY IF EXISTS "ledger_authenticated_access" ON public.ledger_entries;
                CREATE POLICY "ledger_authenticated_access" ON public.ledger_entries FOR ALL TO authenticated USING (true);

                -- ─── 7. MOCK DATA ────────────────────────────────────────────
                DO $$
                DECLARE
                  sup1 UUID := gen_random_uuid();
                    sup2 UUID := gen_random_uuid();
                      p1 UUID := gen_random_uuid();
                        p2 UUID := gen_random_uuid();
                          store1 UUID := gen_random_uuid();
                            ord1 UUID := gen_random_uuid();
                            BEGIN

                              -- Insert Suppliers
                                INSERT INTO public.suppliers (id, name, region, rating, phone, email, credit_limit, credit_used, pending_debt, due_days)
                                  VALUES
                                      (sup1, 'مستودع الجبوري للترديد والإنتاج', 'بغداد / الكرادة', 4.8, '07701000001', 'aljabouri@example.com', 5000000, 1250000, 750000, 15),
                                          (sup2, 'شركة الرافدين للتجارة العامة', 'أربيل / العرصات', 4.6, '07502000002', 'rafidain@example.com', 10000000, 3400000, 1200000, 30)
                                            ON CONFLICT DO NOTHING;

                                              -- Insert Stores
                                                INSERT INTO public.stores (id, name, owner, phone, city, status, total_orders, total_spent, credit_limit)
                                                  VALUES
                                                      (store1, 'أسواق البركة المركزية', 'أحمد العبيدي', '07803000003', 'بغداد', 'active', 12, 4500000, 2000000)
                                                        ON CONFLICT DO NOTHING;

                                                          -- Insert Products
                                                            INSERT INTO public.products (id, barcode, name, category, cost_price, original_price, final_price, stock, min_order_qty, unit, supplier_id, supplier_name)
                                                              VALUES
                                                                  (p1, '6281000123456', 'زيت طعام الدار 1 لتر (كرتونة 12 حبة)', 'المواد الغذائية', 22000, 25000, 24000, 150, 5, 'كرتونة', sup1, 'مستودع الجبوري للترديد والإنتاج'),
                                                                      (p2, '6281000654321', 'رز شعلان بسمتي 5 كغم', 'المواد الغذائية', 14000, 16000, 15500, 80, 2, 'كيس', sup2, 'شركة الرافدين للتجارة العامة')
                                                                        ON CONFLICT DO NOTHING;

                                                                          -- Insert Sample Order
                                                                            INSERT INTO public.orders (id, order_number, status, payment_status, buyer_name, buyer_store_name, buyer_phone, delivery_city, subtotal, delivery_fee, total, store_id)
                                                                              VALUES
                                                                                  (ord1, 'ORD-2026-001', 'reviewing', 'pending', 'أحمد العبيدي', 'أسواق البركة المركزية', '07803000003', 'بغداد', 120000, 5000, 125000, store1)
                                                                                    ON CONFLICT DO NOTHING;

                                                                                      -- Insert Sample Order Items
                                                                                        INSERT INTO public.order_items (order_id, product_id, name, qty, unit, unit_price)
                                                                                          VALUES
                                                                                              (ord1, p1, 'زيت طعام الدار 1 لتر (كرتونة 12 حبة)', 5, 'كرتونة', 24000)
                                                                                                ON CONFLICT DO NOTHING;

                                                                                                END $$;
                                                                                                
                )
        )
    )
)
)
)
)
)