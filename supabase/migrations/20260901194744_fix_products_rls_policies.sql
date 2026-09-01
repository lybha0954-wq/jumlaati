-- ============================================================
-- Fix: Products RLS — grant SELECT to anon and authenticated
-- Error: permission denied for table products (code 42501)
-- Root cause: Only suppliers/admins had access via
--   "suppliers_manage_own_products" policy. Retailers,
--   delivery agents, and anonymous visitors had no SELECT
--   permission, blocking the public catalog and dashboards.
-- ============================================================

-- Allow anyone (including unauthenticated visitors) to read products
DROP POLICY IF EXISTS "public_read_products" ON public.products;
CREATE POLICY "public_read_products"
ON public.products
FOR SELECT
TO public
USING (true);

-- Allow all authenticated users (retailers, delivery, etc.) to read products
-- (The public policy above already covers this, but this is explicit for clarity)
-- The existing "suppliers_manage_own_products" policy handles INSERT/UPDATE/DELETE
-- for suppliers and admins — we only need to add the missing SELECT for everyone.
