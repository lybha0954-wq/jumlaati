"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import {
  Plus, Package, Clock, CheckCircle2, Wallet, ArrowLeft, Store,
} from "lucide-react";

export default function WholesaleOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, new: 0, active: 0, sales: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [ordersRes] = await Promise.all([
        fetch("/api/orders").then((r) => r.json()),
      ]);

      const orders = Array.isArray(ordersRes)
        ? ordersRes
        : (ordersRes.orders || []);

      // Map current DB statuses to categories
      const newCount = orders.filter((o: any) =>
        o.status === "pending"
      ).length;

      const activeCount = orders.filter((o: any) =>
        ["accepted", "shipped", "picked_up"].includes(o.status)
      ).length;

      const sales = orders
        .filter((o: any) => o.status === "delivered")
        .reduce((s: number, o: any) => s + Number(o.total_amount || 0), 0);

      setStats({
        total: orders.length,
        new: newCount,
        active: activeCount,
        sales,
      });
      setRecent(orders.slice(0, 5));
    } catch {
      showToast("فشل تحميل البيانات", "error");
    } finally {
      setLoading(false);
    }
  }, []);

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
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-black text-gray-900">مرحباً بك 👋</h1>
          <p className="text-sm text-gray-500">نظرة سريعة على نشاطك</p>
        </div>

        <Link href="/wholesale/products"
          className="group mb-6 flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-l from-[#2e8b73] to-[#1e6b57] p-5 text-white shadow-lg shadow-[#2e8b73]/20 transition-all hover:shadow-xl active:scale-[0.98]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Plus className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-base font-black">أضف منتج جديد</div>
              <div className="text-xs text-white/80">لمعروضاتك في المتجر</div>
            </div>
          </div>
          <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
        </Link>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <KpiCard icon={<Clock className="h-5 w-5" />} label="طلبات جديدة" value={String(stats.new)} color="amber" highlight={stats.new > 0} />
          <KpiCard icon={<Package className="h-5 w-5" />} label="قيد التنفيذ" value={String(stats.active)} color="purple" />
          <KpiCard icon={<CheckCircle2 className="h-5 w-5" />} label="إجمالي الطلبات" value={String(stats.total)} color="blue" />
          <KpiCard icon={<Wallet className="h-5 w-5" />} label="مبيعات مكتملة" value={formatCurrency(stats.sales)} color="emerald" />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <h2 className="text-base font-black text-gray-900">آخر الطلبات الواردة</h2>
            <Link href="/wholesale/orders"
              className="group inline-flex items-center gap-1 text-xs font-semibold text-[#2e8b73] hover:text-[#1e6b57]">
              عرض الكل
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f4f0]">
                <Package className="h-6 w-6 text-[#2e8b73]" />
              </div>
              <p className="text-sm text-gray-500">لا توجد طلبات واردة بعد</p>
              <p className="mt-1 text-xs text-gray-400">ستظهر هنا عند وصول طلبات جديدة</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recent.map((o: any) => {
                const st = getStatusInfo(o.status);
                const orderNum = o.order_number || `#${String(o.id).slice(0, 8)}`;
                return (
                  <li key={o.id}>
                    <Link href={`/orders/${o.id}`}
                      className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-gray-50/50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
                          <Store className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{orderNum}</p>
                          <p className="text-xs text-gray-500">{o.retailer_name || "سوبرماركت"}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-[#2e8b73]">{formatCurrency(o.total_amount || 0)}</p>
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${st.className}`}>{st.label}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, color, highlight }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-[#e8f4f0] text-[#2e8b73]",
  };
  return (
    <div className={`rounded-2xl border bg-white p-4 transition-all ${highlight ? "border-[#2e8b73]/30 shadow-sm" : "border-gray-100"}`}>
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${colors[color]}`}>{icon}</div>
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <p className="text-xl font-black text-gray-900">{value}</p>
    </div>
  );
}

function getStatusInfo(status: string) {
  const map: Record<string, any> = {
    pending:   { label: "جديد",           className: "bg-amber-50 text-amber-700" },
    accepted:  { label: "مقبول",          className: "bg-blue-50 text-blue-700" },
    shipped:   { label: "قيد التوصيل",    className: "bg-purple-50 text-purple-700" },
    picked_up: { label: "مع المندوب",     className: "bg-indigo-50 text-indigo-700" },
    delivered: { label: "تم التسليم",     className: "bg-[#e8f4f0] text-[#1e6b57]" },
    cancelled: { label: "ملغي",           className: "bg-red-50 text-red-700" },
  };
  return map[status] || { label: status, className: "bg-gray-50 text-gray-600" };
}
