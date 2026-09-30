-- ═══════════════════════════════════════════════════
-- إضافة بيانات تجريبية للاختبار
-- تاريخ: 2026-09-30
-- ⚠️ للتجربة فقط — احذفها بـ clean-demo.sql
-- ═══════════════════════════════════════════════════

-- 1) التصنيفات التجريبية
INSERT INTO categories (name) VALUES
  ('مشروبات'),
  ('معلبات'),
  ('منظفات')
ON CONFLICT DO NOTHING;

-- 2) المنتجات التجريبية (للمورد tester.one@example.test)
WITH supplier AS (
  SELECT id FROM profiles WHERE email = 'tester.one@example.test' LIMIT 1
),
cats AS (
  SELECT id, name FROM categories WHERE name IN ('مشروبات', 'معلبات', 'منظفات')
)
INSERT INTO products (supplier_id, category_id, name, sku, price, cost_price, stock_quantity, min_order_quantity, unit, status, is_active)
SELECT
  s.id,
  c.id,
  '[DEMO] ' || c.name || ' — منتج ' || (ROW_NUMBER() OVER ())::text,
  'DEMO-' || (ROW_NUMBER() OVER ())::text,
  (RANDOM() * 5000 + 1000)::numeric(10,2),
  (RANDOM() * 3000 + 500)::numeric(10,2),
  (RANDOM() * 100 + 20)::int,
  5,
  'قطعة',
  'available',
  true
FROM supplier s
CROSS JOIN cats c
LIMIT 9;

-- 3) الطلبات التجريبية (من السوبرماركت tester.two@example.test)
INSERT INTO orders (
  order_number, retailer_id, supplier_id, status, payment_status,
  subtotal, delivery_fee, commission, total_amount,
  buyer_name, delivery_address, notes
)
SELECT
  'DEMO-ORDER-' || n::text,
  r.id,
  s.id,
  CASE (n % 4)
    WHEN 0 THEN 'pending'
    WHEN 1 THEN 'accepted'
    WHEN 2 THEN 'shipped'
    ELSE 'delivered'
  END,
  CASE (n % 3)
    WHEN 0 THEN 'unpaid'
    WHEN 1 THEN 'partial'
    ELSE 'paid'
  END,
  (RANDOM() * 30000 + 10000)::numeric(10,2),
  3000,
  (RANDOM() * 500 + 100)::numeric(10,2),
  (RANDOM() * 30000 + 10000)::numeric(10,2),
  'مشتري تجريبي',
  'بغداد - منطقة تجريبية',
  'طلب تجريبي للاختبار'
FROM
  (SELECT id FROM profiles WHERE email = 'tester.two@example.test' LIMIT 1) r,
  (SELECT id FROM profiles WHERE email = 'tester.one@example.test' LIMIT 1) s,
  generate_series(1, 6) n;

-- 4) تقرير ما أضيف
SELECT 'categories' AS tbl, COUNT(*) AS cnt FROM categories
UNION ALL
SELECT 'products DEMO', COUNT(*) FROM products WHERE name LIKE '[DEMO]%'
UNION ALL
SELECT 'orders DEMO', COUNT(*) FROM orders WHERE order_number LIKE 'DEMO-%';
