-- ═══════════════════════════════════════════════════
-- حذف كل البيانات التجريبية
-- ═══════════════════════════════════════════════════

-- 1) حذف order_items للطلبات DEMO
DELETE FROM order_items
WHERE order_id IN (
  SELECT id FROM orders WHERE order_number LIKE 'DEMO-%'
);

-- 2) حذف payments للطلبات DEMO
DELETE FROM payments
WHERE order_id IN (
  SELECT id FROM orders WHERE order_number LIKE 'DEMO-%'
);

-- 3) حذف notifications للطلبات DEMO
DELETE FROM notifications
WHERE order_id IN (
  SELECT id FROM orders WHERE order_number LIKE 'DEMO-%'
);

-- 4) حذف الطلبات DEMO
DELETE FROM orders WHERE order_number LIKE 'DEMO-%';

-- 5) حذف المنتجات DEMO
DELETE FROM products WHERE name LIKE '[DEMO]%';

-- 6) حذف العلاقات DEMO
DELETE FROM relationships WHERE supplier_id IN (
  SELECT id FROM profiles WHERE email LIKE '%@demo.test'
);

-- 7) تقرير
SELECT
  'orders' AS tbl, COUNT(*) FILTER (WHERE order_number LIKE 'DEMO-%') AS remaining FROM orders
UNION ALL
SELECT 'products', COUNT(*) FROM products WHERE name LIKE '[DEMO]%'
UNION ALL
SELECT 'profiles@demo', COUNT(*) FROM profiles WHERE email LIKE '%@demo.test';
