"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import {
  TrendingUp, ShoppingCart, Store, Bike, XCircle, Clock,
  PackageCheck, Download, Users, FileText, CreditCard,
  ArrowUpRight, ArrowDownRight, Trophy, Target, Percent, Activity,
} from "lucide-react";

const STATUS_META = [
  { key: "pending",   label: "قيد الانتظار",   color: "amber" },
  { key: "accepted",  label: "مقبول",           color: "blue" },
  { key: "shipped",   label: "قيد التوصيل",     color: "purple" },
  { key: "picked_up", label: "استلمه المندوب", color: "indigo" },
  { key: "delivered", label: "تم التسليم",     color: "emerald" },
  { key: "cancelled", label: "ملغي",            color: "red" },
];

const STATUS_AR: Record<string, string> = {
  pending: "قيد الانتظار", accepted: "مقبول", shipped: "قيد التوصيل",
  picked_up: "استلمه المندوب", delivered: "تم التسليم", cancelled: "ملغي",
};

type Period = 7 | 30 | 90 | 0;

const PERIODS: { value: Period; label: string }[] = [
  { value: 7,  label: "7 أيام" },
  { value: 30, label: "30 يوم" },
  { value: 90, label: "90 يوم" },
  { value: 0,  label: "الكل" },
];

export function AnalyticsView({ initialOrders }: { initialOrders: any[] }) {
  const [period, setPeriod] = useState<Period>(7);
  const { showToast } = useToast();
  const allOrders = initialOrders;

  const filtered = useMemo(() => {
    if (period === 0) return allOrders;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - period);
    cutoff.setHours(0, 0, 0, 0);
    return allOrders.filter((o: any) => {
      const d = new Date(String(o.created_at || "").replace(" ", "T"));
      return d >= cutoff;
    });
  }, [allOrders, period]);

  const stats = useMemo(() => {
    const byStatus: Record<string, number> = {};
    filtered.forEach((o: any) => { byStatus[o.status] = (byStatus[o.status] || 0) + 1; });

    const delivered = byStatus.delivered || 0;
    const cancelled = byStatus.cancelled || 0;
    const inProgress =
      (byStatus.pending || 0) + (byStatus.accepted || 0) +
      (byStatus.shipped || 0) + (byStatus.picked_up || 0);
    const revenue = filtered
      .filter((o: any) => o.status === "delivered")
      .reduce((s: number, o: any) => s + (Number(o.total_amount) || 0), 0);

    const group = (key: string) => {
      const m: Record<string, { name: string; total: number; count: number }> = {};
      filtered.forEach((o: any) => {
        const n = o[key];
        if (!n) return;
        if (!m[n]) m[n] = { name: n, total: 0, count: 0 };
        m[n].total += Number(o.total_amount) || 0;
        m[n].count += 1;
      });
      return Object.values(m).sort((a, b) => b.total - a.total).slice(0, 5);
    };

    const days = period === 0 ? 30 : period;
    const daily: { date: string; count: number; revenue: number }[] = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      daily.push({ date: d.toISOString().slice(0, 10), count: 0, revenue: 0 });
    }
    const dMap: Record<string, { count: number; revenue: number }> = {};
    daily.forEach((d) => { dMap[d.date] = { count: 0, revenue: 0 }; });
    filtered.forEach((o: any) => {
      const key = String(o.created_at || "").slice(0, 10);
      if (dMap[key] !== undefined) {
        dMap[key].count += 1;
        if (o.status === "delivered") dMap[key].revenue += Number(o.total_amount) || 0;
      }
    });
    daily.forEach((d) => { d.count = dMap[d.date].count; d.revenue = dMap[d.date].revenue; });

    // ═══ تقارير متقدمة ═══
    // متوسط قيمة الطلب
    const avgOrderValue = delivered > 0 ? Math.round(revenue / delivered) : 0;

    // معدل الإلغاء
    const cancelRate = filtered.length > 0 ? Math.round((cancelled / filtered.length) * 100) : 0;

    // معدل الإكمال
    const completionRate = filtered.length > 0 ? Math.round((delivered / filtered.length) * 100) : 0;

    // أفضل يوم
    const bestDay = daily.reduce((max, d) => d.count > max.count ? d : max, { date: "", count: 0, revenue: 0 });

    // الطلبات المعلقة > 24 ساعة
    const now = Date.now();
    const stalledOrders = filtered.filter((o: any) => {
      if (["delivered", "cancelled"].includes(o.status)) return false;
      const age = now - new Date(String(o.created_at).replace(" ", "T")).getTime();
      return age > 24 * 60 * 60 * 1000;
    }).length;

    // مقارنة بالفترة السابقة
    const prevRevenue = (() => {
      if (period === 0) return 0;
      const prevCutoff = new Date();
      prevCutoff.setDate(prevCutoff.getDate() - period * 2);
      const currCutoff = new Date();
      currCutoff.setDate(currCutoff.getDate() - period);
      return allOrders
        .filter((o: any) => {
          const d = new Date(String(o.created_at).replace(" ", "T"));
          return d >= prevCutoff && d < currCutoff && o.status === "delivered";
        })
        .reduce((s: number, o: any) => s + (Number(o.total_amount) || 0), 0);
    })();
    const revenueGrowth = prevRevenue > 0
      ? Math.round(((revenue - prevRevenue) / prevRevenue) * 100)
      : (revenue > 0 ? 100 : 0);

    return {
      total: filtered.length, delivered, inProgress, cancelled, revenue,
      byStatus, daily,
      topSuppliers: group("supplier_name"),
      topRetailers: group("retailer_name"),
      topDeliveries: group("delivery_name"),
      // متقدمات
      avgOrderValue,
      cancelRate,
      completionRate,
      bestDay,
      stalledOrders,
      revenueGrowth,
      prevRevenue,
    };
  }, [filtered, period, allOrders]);

  const exportCSV = useCallback(() => {
    if (filtered.length === 0) {
      showToast("لا توجد بيانات للتصدير", "error");
      return;
    }
    const headers = ["رقم الطلب", "التاريخ", "المورد", "السوبرماركت", "المندوب", "الحالة", "المبلغ"];
    const rows = filtered.map((o: any) => [
      o.id,
      String(o.created_at || "").slice(0, 16),
      o.supplier_name || "",
      o.retailer_name || "",
      o.delivery_name || "",
      STATUS_AR[o.status] || o.status,
      Number(o.total_amount) || 0,
    ]);
    const csv =
      "\uFEFF" +
      [headers, ...rows]
        .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jumlati-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("تم تصدير التقرير", "success");
  }, [filtered, showToast]);

  const totalForBars = Math.max(1, stats.total);
  const maxDaily = Math.max(1, ...stats.daily.map((d) => d.count));
  const labelEvery = stats.daily.length > 14 ? Math.ceil(stats.daily.length / 10) : 1;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h1 className="mb-1 text-2xl font-black text-gray-900">التقارير</h1>
            <p className="text-sm text-gray-500">نظرة تحليلية على النظام</p>
          </div>
          <button
            type="button"
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition-colors hover:border-[#2e8b73]/40 hover:text-[#2e8b73] disabled:opacity-40"
          >
            <Download size={14} /> CSV
          </button>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPeriod(p.value)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all ${
                period === p.value
                  ? "bg-[#2e8b73] text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <KpiCard icon={<ShoppingCart size={18} />} label="إجمالي الطلبات" value={String(stats.total)} color="blue" />
          <KpiCard icon={<TrendingUp size={18} />} label="مبيعات مكتملة" value={formatCurrency(stats.revenue)} color="emerald" />
          <KpiCard icon={<PackageCheck size={18} />} label="مكتملة" value={String(stats.delivered)} color="emerald" />
          <KpiCard icon={<Clock size={18} />} label="قيد التنفيذ" value={String(stats.inProgress)} color="amber" />
          <KpiCard icon={<XCircle size={18} />} label="ملغية" value={String(stats.cancelled)} color="red" />
        </div>

        <Section title={`الطلبات — آخر ${period === 0 ? 30 : period} يوم`}>
          {stats.total === 0 ? <Empty /> : (
            <div className="flex items-end justify-between gap-1 h-32">
              {stats.daily.map((d, i) => {
                const hp = Math.round((d.count / maxDaily) * 100);
                const showLabel = i % labelEvery === 0 || i === stats.daily.length - 1;
                return (
                  <div key={d.date} className="flex flex-col items-center flex-1 h-full min-w-0">
                    {d.count > 0 && (
                      <div className="text-[10px] font-bold text-gray-700 mb-1">{d.count}</div>
                    )}
                    <div className="w-full flex-1 bg-gray-100 rounded-t-md flex items-end">
                      <div
                        className="w-full bg-[#2e8b73] rounded-t-md transition-all"
                        style={{ height: `${Math.max(hp, 4)}%` }}
                      />
                    </div>
                    {showLabel && (
                      <div className="text-[9px] text-gray-500 mt-1 truncate">
                        {d.date.slice(8, 10)}/{d.date.slice(5, 7)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Section>

        <Section title="توزيع الطلبات حسب الحالة">
          {stats.total === 0 ? <Empty /> : (
            <div className="space-y-3">
              {STATUS_META.map((s) => (
                <StatusBar
                  key={s.key}
                  label={s.label}
                  value={stats.byStatus[s.key] || 0}
                  total={totalForBars}
                  color={s.color}
                />
              ))}
            </div>
          )}
        </Section>

        <TopList title="أفضل تجار الجملة" icon={<Store size={16} className="text-[#2e8b73]" />} items={stats.topSuppliers} unit="طلب" />
        <TopList title="أفضل السوبرماركت" icon={<Store size={16} className="text-[#2e8b73]" />} items={stats.topRetailers} unit="طلب" />
        <TopList title="أفضل المندوبين"   icon={<Bike  size={16} className="text-[#2e8b73]" />} items={stats.topDeliveries} unit="مهمة" />

        {/* ═══ تقارير متقدمة ═══ */}
        <div className="mb-6 rounded-2xl border border-[#2e8b73]/20 bg-gradient-to-br from-[#e8f4f0]/60 to-white p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-black text-gray-900">
              <Trophy size={16} className="text-[#2e8b73]" />
              تقارير متقدمة
            </h2>
            <span className="rounded-full bg-[#2e8b73] px-2 py-0.5 text-[10px] font-bold text-white">
              reports_advanced
            </span>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <AdvancedStat
              icon={<Target size={16} />}
              label="متوسط قيمة الطلب"
              value={formatCurrency(stats.avgOrderValue)}
              sub="للطلبات المكتملة"
              color="emerald"
            />
            <AdvancedStat
              icon={<Percent size={16} />}
              label="معدل الإكمال"
              value={`${stats.completionRate}%`}
              sub={`${stats.delivered} من ${stats.total}`}
              color="blue"
            />
            <AdvancedStat
              icon={<XCircle size={16} />}
              label="معدل الإلغاء"
              value={`${stats.cancelRate}%`}
              sub={`${stats.cancelled} ملغية`}
              color="red"
            />
            <AdvancedStat
              icon={stats.revenueGrowth >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              label="نمو المبيعات"
              value={`${stats.revenueGrowth >= 0 ? "+" : ""}${stats.revenueGrowth}%`}
              sub="مقارنة بالفترة السابقة"
              color={stats.revenueGrowth >= 0 ? "emerald" : "red"}
            />
          </div>

          {stats.bestDay.count > 0 && (
            <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50/50 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy size={14} className="text-amber-600" />
                  <span className="text-xs font-bold text-amber-800">أفضل يوم في الفترة</span>
                </div>
                <span className="text-[11px] font-bold text-amber-700">
                  {stats.bestDay.date}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-amber-700">
                {stats.bestDay.count} طلب بقيمة {formatCurrency(stats.bestDay.revenue)}
              </p>
            </div>
          )}

          {stats.stalledOrders > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-red-600" />
                <span className="text-xs font-bold text-red-800">
                  {stats.stalledOrders} طلب متوقف أكثر من 24 ساعة
                </span>
              </div>
              <p className="mt-1 text-[11px] text-red-700">
                يحتاج إلى مراجعة عاجلة
              </p>
            </div>
          )}

          {stats.stalledOrders === 0 && stats.total > 0 && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-emerald-600" />
                <span className="text-xs font-bold text-emerald-800">
                  كل الطلبات تسير بشكل سليم
                </span>
              </div>
              <p className="mt-1 text-[11px] text-emerald-700">
                لا توجد طلبات متوقفة أكثر من 24 ساعة
              </p>
            </div>
          )}
        </div>

        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5">
          <h2 className="mb-1 text-sm font-black text-gray-900">📥 تقارير جاهزة للتحميل</h2>
          <p className="mb-4 text-xs text-gray-500">ملفات CSV تفتح مباشرة في Excel</p>
          <div className="grid grid-cols-2 gap-3">
            <ExportCard href="/api/export/users" icon={<Users size={18} />} label="المستخدمون" color="blue" />
            <ExportCard href="/api/export/orders" icon={<FileText size={18} />} label="الطلبات" color="emerald" />
            <ExportCard href="/api/export/products" icon={<PackageCheck size={18} />} label="المنتجات" color="amber" />
            <ExportCard href="/api/export/payments" icon={<CreditCard size={18} />} label="الدفعات" color="purple" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ExportCard({ href, icon, label, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
    emerald: "bg-[#e8f4f0] text-[#2e8b73] group-hover:bg-[#d4ece4]",
    amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-100",
  };
  return (
    <a
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 transition-all hover:border-[#2e8b73]/30 hover:shadow-sm"
    >
      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${colors[color]}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-black text-gray-900">{label}</p>
        <p className="flex items-center gap-1 text-[10px] text-gray-500">
          <Download size={10} /> CSV
        </p>
      </div>
    </a>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="mb-4 text-sm font-black text-gray-900">{title}</h2>
      {children}
    </div>
  );
}

function Empty() {
  return <p className="py-6 text-center text-xs text-gray-400">لا توجد بيانات في هذه الفترة</p>;
}

function KpiCard({ icon, label, value, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-[#e8f4f0] text-[#2e8b73]",
    red: "bg-red-50 text-red-600",
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
    amber: "bg-amber-500", blue: "bg-blue-500", purple: "bg-purple-500",
    indigo: "bg-indigo-500", emerald: "bg-[#2e8b73]", red: "bg-red-500",
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

function TopList({ title, icon, items, unit }: any) {
  return (
    <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-black text-gray-900">{icon}{title}</h2>
      {items.length === 0 ? <Empty /> : (
        <ul className="space-y-3">
          {items.map((it: any, i: number) => (
            <li key={i} className="flex items-center gap-3">
              <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-black ${
                i === 0 ? "bg-amber-100 text-amber-700"
                  : i === 1 ? "bg-gray-100 text-gray-700"
                  : i === 2 ? "bg-orange-100 text-orange-700"
                  : "bg-gray-50 text-gray-500"
              }`}>{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-gray-900">{it.name}</p>
                <p className="text-xs text-gray-500">{it.count} {unit}</p>
              </div>
              <p className="text-sm font-black text-[#2e8b73]">{formatCurrency(it.total)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AdvancedStat({ icon, label, value, sub, color }: any) {
  const colors: Record<string, string> = {
    emerald: "bg-[#e8f4f0] text-[#2e8b73]",
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="rounded-xl border border-white/60 bg-white/80 p-3 backdrop-blur-sm">
      <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg ${colors[color]}`}>
        {icon}
      </div>
      <p className="mb-1 text-[10px] text-gray-500">{label}</p>
      <p className="text-base font-black text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 text-[9px] text-gray-400">{sub}</p>}
    </div>
  );
}
