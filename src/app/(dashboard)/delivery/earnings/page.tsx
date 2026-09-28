"use client";

import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { Wallet, TrendingUp, Package, DollarSign } from "lucide-react";

export default function DeliveryEarningsPage() {
  const [stats, setStats] = useState({ total: 0, count: 0, thisMonth: 0, thisMonthCount: 0 });
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const data = res.ok ? await res.json() : [];
      const list = Array.isArray(data) ? data : [];
      const completed = list.filter((o: any) => o.status === "completed");

      const total = completed.reduce((s: number, o: any) => s + (Number(o.total) || 0) * 0.05, 0);

      const now = new Date();
      const monthCompleted = completed.filter((o: any) => {
        const d = new Date(o.created_at);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
      const thisMonth = monthCompleted.reduce((s: number, o: any) => s + (Number(o.total) || 0) * 0.05, 0);

      setStats({
        total, count: completed.length,
        thisMonth, thisMonthCount: monthCompleted.length,
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
          <h1 className="mb-1 text-2xl font-black text-gray-900">أرباحي</h1>
          <p className="text-sm text-gray-500">نسبة 5% من كل مهمة مكتملة</p>
        </div>

        {/* إجمالي الأرباح */}
        <div className="mb-6 rounded-2xl bg-gradient-to-l from-[#2e8b73] to-[#1e6b57] p-6 text-white shadow-lg shadow-[#2e8b73]/20">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Wallet size={18} />
            </div>
            <span className="text-sm font-bold text-white/90">إجمالي الأرباح</span>
          </div>
          <div className="text-3xl font-black">{formatCurrency(stats.total)}</div>
          <p className="mt-1 text-xs text-white/70">من {stats.count} مهمة مكتملة</p>
        </div>

        {/* هذا الشهر */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f4f0] text-[#2e8b73]">
              <TrendingUp size={16} />
            </div>
            <p className="mb-1 text-xs text-gray-500">أرباح هذا الشهر</p>
            <p className="text-lg font-black text-gray-900">{formatCurrency(stats.thisMonth)}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Package size={16} />
            </div>
            <p className="mb-1 text-xs text-gray-500">مهام هذا الشهر</p>
            <p className="text-lg font-black text-gray-900">{stats.thisMonthCount}</p>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#2e8b73]/20 bg-[#e8f4f0]/50 p-4">
          <DollarSign size={18} className="mt-0.5 flex-shrink-0 text-[#2e8b73]" />
          <p className="text-xs leading-relaxed text-gray-700">
            <strong className="text-[#1e6b57]">كيف تُحسب الأرباح؟</strong>
            <br />
            تحصل على 5% من قيمة كل طلب توصّله. المبلغ يُحدّث تلقائياً بعد تأكيد التسليم.
          </p>
        </div>
      </div>
    </div>
  );
}
