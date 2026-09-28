# سجل التغييرات — jumlaati

## [2026-09-28] الجلسة 1 — middleware + types

### ✅ middleware.ts
- admin: /admin/overview → /admin/home
- owner: أُضيف → /admin/home
- wholesaler → supplier
- ROLE_PREFIX: string → string[]
- نسخة: middleware.ts.before-owner-fix

### ✅ src/types/user.ts
- UserRole += "owner"
- نسخة: src/types/user.ts.before-owner-fix

### 🎯 النتيجة
- 4 أدوار تعمل ✅ (admin, supplier, retailer, delivery)
