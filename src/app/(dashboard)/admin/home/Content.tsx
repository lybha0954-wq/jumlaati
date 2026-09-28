"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import {
  Users, ShoppingCart, Wallet, Clock, ArrowLeft,
  Package, Store, Truck, FlaskConical, Activity,
} from "lucide-react";

export default function AdminHomePage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0, orders: 0, revenue: 0, pending: 0,
  });
  const [recent, setRecent] = useState<any[]>([]);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, ordersRes] = await Promise.all([
        fetch("/api/admin/users").then((r) => (r.ok ? r.json() : [])),
        fetch("/api/orders").then((r) => (r.ok ? r.json() : [])),
      ]);

      const users = Array.isArray(usersRes) ? usersRes : [];
      const orders = Array.isArray(ordersRes) ? ordersRes : [];

      const revenue = orders
        .filter((o: any) => o.status === "completed")
        .reduce((s: number, o: any) => s + (Number(o.total) || 0), 0);
      const pending = orders.filter((o: any) => o.status === "reviewing").length;

      setStats({
        users: users.length,
        orders: orders.length,
        revenue,
        pending,
      });
      setRecent(orders.slice(0, 5));
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
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-black text-gray-900">مرحباً بك 👋</h1>
          <p className="text-sm text-gray-500">نظرة شاملة على النظام</p>
        </div>

        {/* ═════ KPIs ═════ */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <KpiCard icon={<Users className="h-5 w-5" />} label="المستخدمون" value={String(stats.users)} color="blue" />
          <KpiCard icon={<ShoppingCart className="h-5 w-5" />} label="إجمالي الطلبات" value={String(stats.orders)} color="purple" />
          <KpiCard icon={<Clock className="h-5 w-5" />} label="بانتظار المراجعة" value={String(stats.pending)} color="amber" highlight={stats.pending > 0} />
          <KpiCard icon={<Wallet className="h-5 w-5" />} label="مبيعات مكتملة" value={formatCurrency(stats.revenue)} color="emerald" />
        </div>

        {/* ═════ وصول سريع ═════ */}
        <div className="mb-6">
          <h2 className="mb-3 text-base font-black text-gray-900">وصول سريع</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <QuickLink href="/admin/users" icon={<Users size={18} />} label="المستخدمون" />
            <QuickLink href="/admin/analytics" icon={<Activity size={18} />} label="التقارير" />
            <QuickLink href="/admin/commissions" icon={<Wallet size={18} />} label="العمولات" />
            <QuickLink href="/admin/seed" icon={<FlaskConical size={18} />} label="بيانات تجريبية" accent />
          </div>
        </div>

        {/* ═════ آخر النشاطات ═════ */}
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <h2 className="text-base font-black text-gray-900">آخر الطلبات في النظام</h2>
            <Link href="/admin/commissions"
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
              <p className="text-sm text-gray-500">لا توجد طلبات في النظام</p>
              <Link href="/admin/seed"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#2e8b73] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#1e6b57]">
                <FlaskConical size={12} /> أنشئ بيانات تجريبية
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recent.map((o: any) => {
                const st = getStatusInfo(o.status);
                return (
                  <li key={o.id}>
                    <Link href={`/orders/${o.id}`}
                      className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-gray-50/50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
                          <Store className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900">#{String(o.id).slice(0, 8)}</p>
                          <p className="truncate text-xs text-gray-500">
                            {o.retailer_name || "—"} ← {o.supplier_name || "—"}
                          </p>
                        </div>
                      </div>
                      <div className="text-left flex-shrink-0">
                        <p className="text-sm font-black text-[#2e8b73]">{formatCurrency(o.total)}</p>
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${st.className}`}>
                          {st.label}
                        </span>
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
    <div className={`rounded-2xl border bg-white p-4 ${highlight ? "border-[#2e8b73]/30 shadow-sm" : "border-gray-100"}`}>
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${colors[color]}`}>{icon}</div>
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <p className="text-xl font-black text-gray-900">{value}</p>
    </div>
  );
}

function QuickLink({ href, icon, label, accent }: any) {
  return (
    <Link href={href}
      className={`flex flex-col items-center gap-2 rounded-2xl border bg-white p-4 transition-all hover:border-[#2e8b73]/30 hover:shadow-md active:scale-95 ${
        accent ? "border-[#2e8b73]/30 bg-[#e8f4f0]/50" : "border-gray-100"
      }`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f0] text-[#2e8b73]">
        {icon}
      </div>
      <span className="text-center text-xs font-bold text-gray-700">{label}</span>
    </Link>
  );
}

function getStatusInfo(status: string) {
  const map: Record<string, any> = {
    reviewing: { label: "قيد المراجعة", className: "bg-amber-50 text-amber-700" },
    delivering: { label: "قيد التوصيل", className: "bg-purple-50 text-purple-700" },
    completed: { label: "مكتمل", className: "bg-[#e8f4f0] text-[#1e6b57]" },
    cancelled: { label: "ملغي", className: "bg-red-50 text-red-700" },
  };
  return map[status] || { label: status, className: "bg-gray-50 text-gray-600" };
}
