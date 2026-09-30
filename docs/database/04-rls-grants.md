# RLS + الصلاحيات

## الجداول الأساسية
- profiles: RLS مفعّل
- products: RLS مفعّل
- orders: RLS مفعّل
- order_items: RLS مفعّل
- payments: RLS يمنع anon
- notifications: RLS يمنع anon
- relationships: RLS يمنع anon

## جداول جديدة
- push_subscriptions: users يقرأون اشتراكاتهم
- feature_flags: read_all + admin_write
