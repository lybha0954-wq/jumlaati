# جملتي (Jumlaati) 🛒

منصة تجارية متكاملة لإدارة قطاع الجملة والتجزئة (للعمليات التجارية في العراق)، تربط بين الموردين، المحلات التجارية، والفروع بسلاسة فائقة.

## 🚀 التقنيات المستخدمة
* **Framework:** Next.js 15 (App Router)
* **UI & Styling:** Tailwind CSS & Lucide Icons
* **Database & Auth:** Supabase
* **Payments:** Stripe
* **Language:** TypeScript / Arabic (RTL)

---

## ⚙️ متطلبات التشغيل (Environment Variables)
قبل تشغيل المشروع محلياً، قم بإنشاء ملف باسم `.env.local` في جذر المشروع وأضف المتطلبات التالية:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:4028
