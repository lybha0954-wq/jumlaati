"use client";

import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { BarChart3, TrendingUp, Users, ShoppingCart, Store, Truck } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0, completed: 0, cancelled: 0, revenue: 0,
    byStatus: {} as Record<string, number>,
    topSuppliers: [] as any[],
    topRetailers: [] as any[],
  });
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [ordersRes, usersRes] = await Promise.all([
        fetch("/api/orders").then((r) => (r.ok ? r.json() : [])),
        fetch("/api/admin/users").then((r) => (r.ok ? r.json() : [])),
      ]);

      const orders = Array.isArray(ordersRes) ? ordersRes : [];
      const users = Array.isArray(usersRes) ? usersRes : [];

      const byStatus: Record<string, number> = {};
      orders.forEach((o: any) => {
        byStatus[o.status] = (byStatus[o.status] || 0) + 1;
      });

      const revenue = orders
        .filter((o: any) => o.status === "completed")
        .reduce((s: number, o: any) => s + (Number(o.total) || 0), 0);

      // Top suppliers
      const supplierMap: Record<string, { name: string; total: number; count: number }> = {};
      orders.forEach((o: any) => {
        if (!o.supplier_name) return;
        if (!supplierMap[o.supplier_name]) {
          supplierMap[o.supplier_name] = { name: o.supplier_name, total: 0, count: 0 };
        }
        supplierMap[o.supplier_name].total += Number(o.total) || 0;
        supplierMap[o.supplier_name].count += 1;
      });
      const topSuppliers = Object.values(supplierMap).sort((a, b) => b.total - a.total).slice(0, 5);

      // Top retailers
      const retailerMap: Record<string, { name: string; total: number; count: number }> = {};
      orders.forEach((o: any) => {
        if (!o.retailer_name) return;
        if (!retailerMap[o.retailer_name]) {
          retailerMap[o.retailer_name] = { name: o.retailer_name, total: 0, count: 0 };
        }
        retailerMap[o.retailer_name].total += Number(o.total) || 0;
        retailerMap[o.retailer_name].count += 1;
      });
      const topRetailers = Object.values(retailerMap).sort((a, b) => b.total - a.total).slice(0, 5);

      setStats({
        total: orders.length,
        completed: orders.filter((o: any) => o.status === "completed").length,
        cancelled: orders.filter((o: any) => o.status === "cancelled").length,
        revenue,
        byStatus,
        topSuppliers,
        topRetailers,
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

  const totalForBars = Math.max(1, stats.total);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-black text-gray-900">التقارير</h1>
          <p className="text-sm text-gray-500">نظرة تحليلية على النظام</p>
        </div>

        {/* KPIs */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <KpiCard icon={<ShoppingCart size={18} />} label="إجمالي الطلبات" value={String(stats.total)} color="blue" />
          <KpiCard icon={<TrendingUp size={18} />} label="مبيعات مكتملة" value={formatCurrency(stats.revenue)} color="emerald" />
          <KpiCard icon={<BarChart3 size={18} />} label="مكتملة" value={String(stats.completed)} color="emerald" />
          <KpiCard icon={<Users size={18} />} label="ملغية" value={String(stats.cancelled)} color="amber" />
        </div>

        {/* توزيع الحالات */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5">
          <h2 className="mb-4 text-sm font-black text-gray-900">توزيع الطلبات حسب الحالة</h2>
          {stats.total === 0 ? (
            <p className="py-6 text-center text-xs text-gray-400">لا توجد بيانات</p>
          ) : (
            <div className="space-y-3">
              <StatusBar label="قيد المراجعة" value={stats.byStatus.reviewing || 0} total={totalForBars} color="amber" />
              <StatusBar label="قيد التوصيل" value={stats.byStatus.delivering || 0} total={totalForBars} color="purple" />
              <StatusBar label="مكتملة" value={stats.byStatus.completed || 0} total={totalForBars} color="emerald" />
              <StatusBar label="ملغية" value={stats.byStatus.cancelled || 0} total={totalForBars} color="red" />
            </div>
          )}
        </div>

        {/* أفضل التجار */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-black text-gray-900">
            <Store size={16} className="text-[#2e8b73]" />
            أفضل تجار الجملة
          </h2>
          {stats.topSuppliers.length === 0 ? (
            <p className="py-4 text-center text-xs text-gray-400">لا توجد بيانات</p>
          ) : (
            <ul className="space-y-3">
              {stats.topSuppliers.map((s, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-black ${
                    i === 0 ? "bg-amber-100 text-amber-700"
                      : i === 1 ? "bg-gray-100 text-gray-700"
                      : i === 2 ? "bg-orange-100 text-orange-700"
                      : "bg-gray-50 text-gray-500"
                  }`}>{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.count} طلب</p>
                  </div>
                  <p className="text-sm font-black text-[#2e8b73]">{formatCurrency(s.total)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* أفضل السوبرماركت */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-black text-gray-900">
            <Truck size={16} className="text-[#2e8b73]" />
            أفضل السوبرماركت
          </h2>
          {stats.topRetailers.length === 0 ? (
            <p className="py-4 text-center text-xs text-gray-400">لا توجد بيانات</p>
          ) : (
            <ul className="space-y-3">
              {stats.topRetailers.map((r, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-black ${
                    i === 0 ? "bg-amber-100 text-amber-700"
                      : i === 1 ? "bg-gray-100 text-gray-700"
                      : i === 2 ? "bg-orange-100 text-orange-700"
                      : "bg-gray-50 text-gray-500"
                  }`}>{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.count} طلب</p>
                  </div>
                  <p className="text-sm font-black text-[#2e8b73]">{formatCurrency(r.total)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-[#e8f4f0] text-[#2e8b73]",
  };
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${colors[color]}`}>{icon}</div>
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <p className="text-xl font-black text-gray-900">{value}</p>
    </div>
  );
}

function StatusBar({ label, value, total, color }: any) {
  const pct = Math.round((value / total) * 100);
  const colors: any = {
    amber: "bg-amber-500",
    purple: "bg-purple-500",
    emerald: "bg-[#2e8b73]",
    red: "bg-red-500",
  };
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-bold text-gray-700">{label}</span>
        <span className="text-gray-500">{value} ({pct}%)</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full transition-all ${colors[color]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
