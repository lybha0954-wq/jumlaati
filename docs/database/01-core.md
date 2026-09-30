# الجداول الأساسية (10)

> جداول نشطة في المشروع الحالي.

---

## 1) profiles

| العمود | النوع | ملاحظة |
|--------|-------|--------|
| id | uuid (PK) | مرتبط بـ auth.users |
| email | text | — |
| full_name | text | — |
| phone | text | — |
| role | text | admin / supplier / retailer / delivery |
| business_name | text | — |
| governorate | text | — |
| district | text | — |
| address | text | — |
| avatar_url | text | — |
| is_active | boolean | — |
| created_at | timestamptz | — |
| updated_at | timestamptz | — |

**السجلات الحالية:** 4

---

## 2) categories

| العمود | النوع |
|--------|-------|
| id | serial (PK) |
| name | text |
| created_at | timestamptz |

**السجلات الحالية:** 7

---

## 3) products

| العمود | النوع |
|--------|-------|
| id | serial (PK) |
| supplier_id | uuid (FK profiles) |
| category_id | int (FK categories) |
| name | text |
| description | text |
| sku | text |
| price | numeric |
| cost_price | numeric |
| stock_quantity | int |
| min_order_quantity | int |
| unit | text |
| status | text (available/low_stock/out_of_stock/archived) |
| image_url | text |
| is_active | boolean |
| created_at | timestamptz |
| updated_at | timestamptz |

**السجلات الحالية:** 10

---

## 4) orders

| العمود | النوع |
|--------|-------|
| id | serial (PK) |
| order_number | text (unique) |
| retailer_id | uuid (FK profiles) |
| supplier_id | uuid (FK profiles) |
| delivery_id | uuid (FK profiles, nullable) |
| status | text (pending/accepted/shipped/picked_up/delivered/cancelled) |
| payment_status | text (unpaid/partial/paid/refunded) |
| subtotal | numeric |
| delivery_fee | numeric |
| commission | numeric |
| total_amount | numeric |
| buyer_name | text |
| delivery_address | text |
| notes | text |
| accepted_at | timestamptz |
| shipped_at | timestamptz |
| picked_up_at | timestamptz |
| delivered_at | timestamptz |
| cancelled_at | timestamptz |
| created_at | timestamptz |
| updated_at | timestamptz |

**السجلات الحالية:** 9

---

## 5) order_items

| العمود | النوع |
|--------|-------|
| id | serial (PK) |
| order_id | int (FK orders) |
| product_id | int (FK products) |
| product_name | text |
| quantity | int |
| unit_price | numeric |
| subtotal | numeric |
| created_at | timestamptz |

**السجلات الحالية:** 18

---

## 6) payments

| العمود | النوع |
|--------|-------|
| id | serial (PK) |
| order_id | int (FK orders) |
| amount | numeric |
| method | text |
| note | text |
| paid_by | uuid (FK profiles) |
| created_at | timestamptz |

**السجلات الحالية:** RLS يحجب anon (طبيعي)

---

## 7) notifications

| العمود | النوع |
|--------|-------|
| id | serial (PK) |
| user_id | uuid (FK profiles) |
| type | text (order/status/payment) |
| title | text |
| body | text |
| order_id | int (FK orders) |
| is_read | boolean |
| created_at | timestamptz |

**السجلات الحالية:** RLS يحجب anon

---

## 8) relationships

| العمود | النوع |
|--------|-------|
| id | serial (PK) |
| supplier_id | uuid (FK profiles) |
| retailer_id | uuid (FK profiles) |
| status | text (pending/active/suspended/rejected) |
| requested_by | uuid (FK profiles) |
| created_at | timestamptz |
| updated_at | timestamptz |

**السجلات الحالية:** RLS يحجب anon

---

## 9) push_subscriptions

| العمود | النوع |
|--------|-------|
| id | uuid (PK) |
| user_id | uuid (FK profiles) |
| endpoint | text (unique) |
| p256dh | text |
| auth | text |
| user_agent | text |
| created_at | timestamptz |
| updated_at | timestamptz |

**الغرض:** Web Push Notifications (VAPID)
**RLS:** users يقرأون اشتراكاتهم فقط

---

## 10) feature_flags

| العمود | النوع |
|--------|-------|
| key | text (PK) |
| enabled | boolean |
| label | text |
| description | text |
| category | text |

**السجلات الحالية:** 21 (1 نشط)
**التفصيل:** راجع [03-feature-flags.md](./03-feature-flags.md)

---

## 🔗 العلاقات

