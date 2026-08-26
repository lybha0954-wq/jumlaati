-- ============================================================
-- Admin RLS Policies: Allow admin role to read all tables
-- ============================================================

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Orders: Admin can read all orders
DROP POLICY IF EXISTS "Admin reads all orders" ON public.orders;
CREATE POLICY "Admin reads all orders" ON public.orders
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- Orders: Admin can update all orders
DROP POLICY IF EXISTS "Admin manages all orders" ON public.orders;
CREATE POLICY "Admin manages all orders" ON public.orders
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Transactions: Admin can read all transactions
DROP POLICY IF EXISTS "Admin reads all transactions" ON public.transactions;
CREATE POLICY "Admin reads all transactions" ON public.transactions
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- Transactions: Admin can manage all transactions
DROP POLICY IF EXISTS "Admin manages all transactions" ON public.transactions;
CREATE POLICY "Admin manages all transactions" ON public.transactions
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Ledger entries: Admin can read all
DROP POLICY IF EXISTS "Admin reads all ledger" ON public.ledger_entries;
CREATE POLICY "Admin reads all ledger" ON public.ledger_entries
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- User profiles: Admin can read all profiles
DROP POLICY IF EXISTS "Admin reads all profiles" ON public.user_profiles;
CREATE POLICY "Admin reads all profiles" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (public.is_admin() OR id = auth.uid() OR employer_supplier_id = auth.uid());

-- Products: Admin can manage all products
DROP POLICY IF EXISTS "Admin manages all products" ON public.products;
CREATE POLICY "Admin manages all products" ON public.products
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
