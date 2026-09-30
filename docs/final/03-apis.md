# مرجع APIs

**ملاحظة:** جميع APIs تتطلب تسجيل دخول (إلا ما ذُكر).
الرد 401 من curl طبيعي (يحتاج كوكيز).

## عام (Public)

### GET /api/products
- عام للزوار
- Query: ?supplier_id=X (اختياري)
- يرجع: قائمة منتجات

## الطلبات

### GET /api/orders
- يُفلتر حسب دور المستخدم:
  - admin: كل الطلبات
  - supplier: طلباته الواردة
  - retailer: طلباته
  - delivery: المهام المسندة
- يُرفق: retailer_name, supplier_name, delivery_name

### POST /api/orders
- retailer فقط
- Body:
  {
    "supplier_id": "uuid",
    "items": [{"product_id": 11, "quantity": 2}],
    "delivery_address": "...",
    "buyer_name": "..."
  }
- يتحقق من المخزون
- يحسب subtotal + commission + total_amount
- يخصم المخزون تلقائياً
- يُنشئ إشعار للمورد

### PATCH /api/orders/[id]
- Body: {"status": "..."}
- صلاحيات:
  - supplier: pending->accepted, accepted->shipped
  - delivery: shipped->picked_up (auto-assign), picked_up->delivered
  - retailer: pending->cancelled
  - admin: أي حالة
- يحدّث timestamps تلقائياً
- يُنشئ إشعارات

### GET /api/products/[id]/stock
### PUT /api/products/[id]/stock
- supplier أو admin
- Body: {"delta": -10} أو {"delta": 5}
- يحدّث stock_quantity

## المنتجات

### GET /api/my-products
- supplier: منتجاته
- admin: كل المنتجات

## المستخدمون

### GET /api/users?role=supplier|retailer|delivery|admin
- يُرجع مستخدمين بدور محدد
- ترجمة أدوار تلقائية

### GET /api/admin/users
- admin فقط
- يُرجع كل المستخدمين مع items_count

## العلاقات

### GET /api/relationships
- يُفلتر حسب الدور:
  - supplier: طلبات انضمام بانتظار الرد
  - retailer: علاقاته
  - admin: كل العلاقات

### POST /api/relationships
- Body: {"supplier_id": "uuid"}
- retailer يطلب الانضمام لمورد

### PATCH /api/relationships/[id]
- Body: {"action": "accept" | "reject"}
- supplier فقط

## الإشعارات

### GET /api/notifications
- آخر 20 إشعار للمستخدم الحالي
- يُرجع: items + unread

### POST /api/notifications/[id]/read
### POST /api/notifications/read-all

## Admin

### GET /api/admin/audit-logs
- admin فقط
- يقرأ من notifications (100 حدث)

### GET /api/admin/analytics
- admin فقط
- إحصائيات عامة

## Dev

### POST /api/dev/seed
- admin فقط
- زرع بيانات تجريبية

## نقاط النهاية القادمة (قريباً)
- /api/commissions
- /api/payouts
- /api/points
- /api/wishlist
- /api/coupons
- /api/refunds
