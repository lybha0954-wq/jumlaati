# الجداول المستقبلية (21)

> موجودة في DB — جاهزة للتفعيل عبر Feature Flags.

## 🎯 المبدأ
- لا نُنشئ جدولاً من الصفر
- نفحص الأعمدة الفعلية قبل الاستخدام
- RLS يحميها من anon (طبيعي)

## قائمة الجداول

| # | الجدول | الغرض | Feature Flag |
|---|--------|-------|--------------|
| 1 | commissions | عمولات المنصة | commissions |
| 2 | coupons | كوبونات خصم | coupons |
| 3 | refunds | استرداد مبالغ | refunds |
| 4 | reviews | تقييمات | reviews |
| 5 | offers | عروض خاصة | offers |
| 6 | payouts | سحب أرباح | payouts |
| 7 | requests | طلبات دعم | requests |
| 8 | matching | مطابقة ذكية | matching |
| 9 | points | نقاط ولاء | points |
| 10 | wishlist | قائمة رغبات | wishlist |
| 11 | addresses | عناوين | — |
| 12 | chat | محادثات (مُستبعد) | — |
| 13 | cart_items | عناصر السلة | — |
| 14 | favorites | المفضلة | — |
| 15 | settings | إعدادات | — |
| 16 | audit_logs | سجل | — |
| 17 | analytics_events | تحليلات | reports_advanced |
| 18 | marketing_events | تسويق | — |
| 19 | translations | ترجمات | multi_language |
| 20 | referrals | إحالات | referrals |
| 21 | tokens | رموز مؤقتة | — |

## قبل استخدام أي جدول
1. افحص الأعمدة الفعلية من DB
2. أنشئ Feature Flag
3. اكتب RLS policy
4. اكتب API + UI
