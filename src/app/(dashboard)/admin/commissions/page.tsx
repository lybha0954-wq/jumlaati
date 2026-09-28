"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { Wallet, TrendingUp, Info, Store, ArrowLeft } from "lucide-react";

export default function AdminCommissionsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCommission: 0, totalVolume: 0, ordersCount: 0,
    subscriptionRevenue: 0, expectedMonthly: 0,
  });
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const orders = res.ok ? await res.json() : [];
      const list = Array.isArray(orders) ? orders : [];
      const completed = list.filter((o: any) => o.status === "completed");

      const totalVolume = completed.reduce((s: number, o: any) => s + (Number(o.total) || 0), 0);
      const totalCommission = Math.round(totalVolume * 0.01);

      // حساب تقريبي لعدد تجار الجملة النشطين
      const suppliers = new Set(list.map((o: any) => o.supplier_name).filter(Boolean));
      const subscriptionRevenue = suppliers.size * 25000;

      setStats({
        totalCommission,
        totalVolume,
        ordersCount: completed.length,
        subscriptionRevenue,
        expectedMonthly: totalCommission + subscriptionRevenue,
      });
    } catch { showToast("فشل التحميل", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Topbar />
        <div className="flex items-center justify-center py-32"><LoadingSpinner /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-black text-gray-900">العمولات والإيرادات</h1>
          <p className="text-sm text-gray-500">نظرة على دخل المنصة</p>
        </div>

        {/* إجمالي الإيراد المتوقع */}
        <div className="mb-6 rounded-2xl bg-gradient-to-l from-[#2e8b73] to-[#1e6b57] p-6 text-white shadow-lg shadow-[#2e8b73]/20">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Wallet size={18} />
            </div>
            <span className="text-sm font-bold text-white/90">الإيراد الشهري المتوقع</span>
          </div>
          <div className="text-3xl font-black">{formatCurrency(stats.expectedMonthly)}</div>
          <p className="mt-1 text-xs text-white/70">تقديري بناءً على العمولات والاشتراكات</p>
        </div>

        {/* تفصيل */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f4f0] text-[#2e8b73]">
              <TrendingUp size={16} />
            </div>
            <p className="mb-1 text-xs text-gray-500">عمولة 1%</p>
            <p className="text-lg font-black text-gray-900">{formatCurrency(stats.totalCommission)}</p>
            <p className="mt-1 text-[10px] text-gray-400">من {stats.ordersCount} طلب</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Store size={16} />
            </div>
            <p className="mb-1 text-xs text-gray-500">اشتراكات متوقعة</p>
            <p className="text-lg font-black text-gray-900">{formatCurrency(stats.subscriptionRevenue)}</p>
            <p className="mt-1 text-[10px] text-gray-400">25K × عدد التجار</p>
          </div>
        </div>

        {/* إجمالي الحجم */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5">
          <h2 className="mb-3 text-sm font-black text-gray-900">حجم التجارة الكلي</h2>
          <p className="mb-1 text-3xl font-black text-[#2e8b73]">
            {formatCurrency(stats.totalVolume)}
          </p>
          <p className="text-xs text-gray-500">إجمالي الطلبات المكتملة في النظام</p>
        </div>

        {/* شرح النموذج */}
        <div className="flex items-start gap-3 rounded-2xl border border-[#2e8b73]/20 bg-[#e8f4f0]/50 p-4">
          <Info size={18} className="mt-0.5 flex-shrink-0 text-[#2e8b73]" />
          <div className="text-xs leading-relaxed text-gray-700">
            <strong className="text-[#1e6b57]">نموذج الإيراد</strong>
            <br />
            • السوبرماركت والمندوب: مجاني تماماً
            <br />
            • تاجر الجملة: يختار بين <strong>1% عمولة</strong> أو <strong>25,000 د.ع/شهر اشتراك</strong>
            <br />
            • هذا يحافظ على دخول مجاني للسوبرماركت، وإيراد مستمر من التجار
          </div>
        </div>

        {/* رابط للطلبات */}
        <Link href="/admin/home"
          className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-[#2e8b73]/30 active:scale-[0.99]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f0] text-[#2e8b73]">
              <TrendingUp size={16} />
            </div>
            <span className="text-sm font-bold text-gray-900">عرض كل الطلبات</span>
          </div>
          <ArrowLeft size={16} className="text-gray-300" />
        </Link>
      </div>
    </div>
  );
}
