"use client";

import { Topbar } from "@/components/dashboard/Topbar";
import { Sparkles, Gift, Tag } from "lucide-react";
import Link from "next/link";

/**
 * صفحة العروض الترويجية
 * ─────────────────────────────
 * جدول `offers` غير موجود في Supabase حالياً.
 * هذه نسخة احتياطية أنيقة — تُوسَّع لاحقاً حين يُنشأ الجدول:
 *
 *   1) أنشئ جدول offers في Supabase
 *   2) أضف offerService.getActiveOffers()
 *   3) استبدل هذه البطاقة بقائمة العروض (نفس نمط /products)
 */

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Topbar />

      <div className="container mx-auto py-16 px-4 max-w-4xl">
        {/* رأس الصفحة */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-50 mb-6">
            <Sparkles className="w-10 h-10 text-amber-500" strokeWidth={2} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
            العروض الترويجية
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            قريباً 🌿 — نُحضّر لك عروضاً حصرية من تجار الجملة
          </p>
        </div>

        {/* بطاقة "قريباً" */}
        <div className="rounded-3xl border-2 border-dashed border-amber-200 bg-gradient-to-b from-amber-50/50 to-white p-10 sm:p-14 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 mb-6">
            <Gift className="w-8 h-8 text-amber-600" strokeWidth={2} />
          </div>

          <h2 className="text-2xl font-bold mb-3 text-foreground">
            الميزة قيد التطوير
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            نعمل على تجهيز قسم العروض والخصومات.
            <br />
            عندما يجهز، ستجد هنا كل العروض الحصرية من تجار الجملة.
          </p>

          {/* مميزات مبدئية */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-right">
            <FeatureCard
              icon={<Tag className="w-5 h-5" />}
              title="خصومات مباشرة"
              desc="عروض على منتجات محددة"
            />
            <FeatureCard
              icon={<Gift className="w-5 h-5" />}
              title="هدايا الكمية"
              desc="مكافآت عند طلب كميات كبيرة"
            />
            <FeatureCard
              icon={<Sparkles className="w-5 h-5" />}
              title="عروض موسمية"
              desc="تخفيضات في المناسبات"
            />
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 active:scale-95 transition-all"
          >
            تصفّح المنتجات الآن ←
          </Link>
        </div>

        {/* ملاحظة صغيرة */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          💡 هل أنت تاجر جملة وتريد إضافة عروضك؟ تواصل مع الإدارة.
        </p>
      </div>
    </div>
  );
}

/* ───── مكوّن فرعي ───── */

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 text-amber-600 mb-3">
        {icon}
      </div>
      <h3 className="font-bold text-sm mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
