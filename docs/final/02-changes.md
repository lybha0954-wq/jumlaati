# الملفات المعدّلة — جلسة 2026-09-29

## Middleware
- middleware.ts (الجذر) — محدّث
- src/middleware.ts — محدّث (الأهم)
  - يستخدم profiles بدل user_profiles
  - يدعم 4 أدوار مع aliases (wholesaler->supplier, store->retailer)

## API Routes

### /api/products
- src/app/api/products/route.ts
  - حذف فلتر .eq('status', 'متوفر')
  - دعم ?supplier_id=X
  - POST: إنشاء منتج جديد

### /api/products/[id]/stock
- src/app/api/products/[id]/stock/route.ts (جديد)
  - PUT: تعديل المخزون (delta)

### /api/orders
- src/app/api/orders/route.ts
  - GET: فلترة حسب الدور + إرفاق الأسماء
  - POST: يخصم المخزون تلقائياً + يُنشئ إشعارات

### /api/orders/[id]
- src/app/api/orders/[id]/route.ts
  - PATCH: صلاحيات دقيقة لكل دور
  - delivery: auto-assign
  - إشعارات تلقائية

### /api/relationships + [id]
- src/app/api/relationships/route.ts
- src/app/api/relationships/[id]/route.ts
  - يستخدم profiles
  - يعرض retailer_name / supplier_name

### /api/users
- src/app/api/users/route.ts
  - يستخدم profiles بدل user_profiles
  - ترجمة أدوار (wholesaler->supplier, store->retailer)

### /api/admin/users
- src/app/api/admin/users/route.ts
  - يستخدم profiles
  - يحسب items_count لكل مستخدم

### /api/admin/audit-logs
- src/app/api/admin/audit-logs/route.ts
  - يقرأ من notifications بدل audit_logs (المفقود)

## Services
- src/lib/services/wholesaleService.ts
  - supplier_id بدل supplier_profile_id
  - حماية: supplier_id في update/delete
- src/lib/services/retailerService.ts
  - إعادة كتابة كاملة بأعمدة جديدة
  - subtotal + total_amount + product_name

## الصفحات (wholesale)
- overview/Content.tsx — 6 حالات جديدة
- orders/page.tsx — إعادة كتابة كاملة
- products/page.tsx — stock_quantity, price, image_url
- inventory/page.tsx (جديد) — 152 سطر
- commissions/page.tsx — أرباح وعمولات
- payouts/page.tsx — مستحقات مالية
- nearby-requests/page.tsx — طلبات انضمام

## الصفحات (retailer)
- overview/Content.tsx — 6 حالات + أعمدة جديدة
- orders/page.tsx — إعادة كتابة كاملة
- invoices/page.tsx — فواتيري
- commissions/page.tsx — مشترياتي
- favorites/page.tsx — قريباً
- points/page.tsx — قريباً
- cart/page.tsx — إصلاح body (supplier_id + product_id)
- shop/[supplierId]/page.tsx — أعمدة جديدة

## الصفحات (delivery)
- overview/Content.tsx — إعادة كتابة
- tasks/page.tsx — 4 فلاتر + أزرار ذكية
- task-history/page.tsx — سجل المهام
- earnings/page.tsx — أرباحي
- payouts/page.tsx — قريباً
- my-wholesalers/page.tsx — قريباً

## الصفحات (admin)
- home/Content.tsx — إعادة كتابة كاملة
- users/page.tsx — إعادة كتابة كاملة
- analytics/page.tsx — أعمدة جديدة
- commissions/page.tsx — أعمدة جديدة
- audit-logs/page.tsx — يقرأ من notifications
- coupons/page.tsx — قريباً
- refunds/page.tsx — قريباً

## Components
- src/components/shared/BottomNavBar.tsx — إعادة كتابة كاملة
  - Tabs مخصصة لكل دور
  - Drawer بقوائم كاملة
  - 4 أدوار في DRAWER_BY_ROLE
