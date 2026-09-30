# قاعدة البيانات — Supabase

## الاتصال
- Project: lwtuzigmlgechzqteetj
- URL: https://lwtuzigmlgechzqteetj.supabase.co
- المفتاح: في .env.local (sb_publishable_...)

## الجداول (8)

### 1. profiles
حقول: id (uuid، PK)، email، full_name، phone، role،
business_name، governorate، district، address،
avatar_url، is_active، created_at، updated_at

الأدوار المسموحة: admin, supplier, retailer, delivery

### 2. categories
حقول: id (serial)، name، created_at

### 3. products
حقول: id (serial)، supplier_id (FK)، category_id (FK)،
name، description، sku، price، cost_price،
stock_quantity، min_order_quantity، unit،
status (available/low_stock/out_of_stock/archived)،
image_url، is_active، created_at، updated_at

### 4. orders
حقول: id (serial)، order_number (unique)،
retailer_id (FK)، supplier_id (FK)، delivery_id (FK)،
status (pending/accepted/shipped/picked_up/delivered/cancelled)،
payment_status (unpaid/partial/paid/refunded)،
subtotal، delivery_fee، commission، total_amount،
buyer_name، delivery_address، notes،
accepted_at، shipped_at، picked_up_at، delivered_at، cancelled_at،
created_at، updated_at

### 5. order_items
حقول: id (serial)، order_id (FK)، product_id (FK)،
product_name، quantity، unit_price، subtotal، created_at

### 6. payments
حقول: id (serial)، order_id (FK)، amount، method،
note، paid_by (FK)، created_at

### 7. notifications
حقول: id (serial)، user_id (FK)، type، title، body،
order_id (FK)، is_read، created_at

### 8. relationships
حقول: id (serial)، supplier_id (FK)، retailer_id (FK)،
status (pending/active/suspended/rejected)،
requested_by (FK)، created_at، updated_at

## Triggers
- on_auth_user_created: ينشئ profile تلقائياً
- trg_profiles_updated_at: يحدّث updated_at
- trg_products_updated_at
- trg_orders_updated_at
- trg_relationships_updated_at

## Functions
- handle_new_user(): ينشئ profile عند تسجيل مستخدم
- touch_updated_at(): يحدّث updated_at تلقائياً

## View
- user_profiles: مرآة لـ profiles (للتوافق)

## قواعد الأسماء
| القديم | الجديد |
|--------|--------|
| user_profiles | profiles |
| wholesaler | supplier |
| store | retailer |
| final_price | price |
| stock | stock_quantity |
| image | image_url |
| total | total_amount |
| retailer_profile_id | retailer_id |
| supplier_profile_id | supplier_id |
| delivery_profile_id | delivery_id |

## حالات الطلب
pending -> accepted -> shipped -> picked_up -> delivered
                 \-> cancelled
