# قاعدة البيانات — جُمْلَتِي

> آخر تحديث: 2026-09-30
> مشروع Supabase: `lwtuzigmlgechzqteetj`

---

## 📑 الفهرس

| # | الملف | المحتوى |
|---|-------|---------|
| 01 | [core](./01-core.md) | الجداول الأساسية (10) |
| 02 | [future](./02-future.md) | الجداول المستقبلية (21) |
| 03 | [feature-flags](./03-feature-flags.md) | نظام الميزات (21) |
| 04 | [rls-grants](./04-rls-grants.md) | الأمان والصلاحيات |

---

## 📊 نظرة عامة

| الفئة | العدد |
|-------|-------|
| جداول أساسية نشطة | 10 |
| جداول مستقبلية (جاهزة) | 21 |
| Feature Flags | 21 (1 نشط) |
| Triggers | 5+ |
| Functions | 3+ |
| Views | 1 (user_profiles) |

---

## 🎯 المبدأ

**لا نُنشئ جداول جديدة** — نستخدم الموجود عند التفعيل.
**لا نحذف APIs** — نُؤجّلها بـ Feature Flag.

---

## 🔗 الأدوات

- فحص سريع: `node check_flags.js` (في جذر المشروع)
- Supabase Dashboard: https://supabase.com/dashboard/project/lwtuzigmlgechzqteetj
