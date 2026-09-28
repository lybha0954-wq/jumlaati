"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import {
  Plus, ShoppingCart, Clock, CheckCircle2,
  Package, ArrowLeft, Wallet, Store, AlertCircle,
} from "lucide-react";

interface Order {
  id: string; total: number; status: string; created_at: string;
  supplier_name?: string;
}

interface Stats {
  orders: number; pending: number; delivered: number; totalSpent: number;
}

export default function RetailerOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState<Stats>({
    orders: 0, pending: 0, delivered: 0, totalSpent: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [ordersRes, profileRes] = await Promise.all([
        fetch("/api/orders").then((r) => (r.ok ? r.json() : [])),
        fetch("/api/users/profile").then((r) => (r.ok ? r.json() : null)),
      ]);

      const orders: Order[] = Array.isArray(ordersRes) ? ordersRes : [];
      if (profileRes) {
        setUserName(profileRes.full_name || profileRes.name || "");
      }

      const pending = orders.filter((o) =>
        ["reviewing", "delivering"].includes(o.status)
      ).length;
      const delivered = orders.filter((o) => o.status === "completed").length;
      const totalSpent = orders
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

      setStats({
        orders: orders.length,
        pending,
        delivered,
        totalSpent,
      });
      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error(err);
      showToast("فشل تحميل البيانات", "error");
    } finally {
      setLoading(false);
    }
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

  const greeting = getGreeting();
  const displayName = userName || "بك";
  const hasActive = stats.pending > 0;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />

      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* ═════ تحية شخصية ═════ */}
        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-black text-gray-900">
            {greeting}
            {userName ? <>, <span className="text-[#2e8b73]">{userName}</span></> : ` ${displayName}`} 🌿
          </h1>
          <p className="text-sm text-gray-500">إليك نظرة سريعة على حسابك</p>
        </div>

        {/* ═════ زر طلب جديد + إجراءات سريعة ═════ */}
        <div className="mb-6">
          <Link
            href="/retailer/shop"
            className="group flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-l from-[#2e8b73] to-[#1e6b57] p-5 text-white shadow-lg shadow-[#2e8b73]/20 transition-all hover:shadow-xl active:scale-[0.98]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <Plus className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-base font-black">طلب جديد</div>
                <div className="text-xs text-white/80">
                  ابدأ من تجار الجملة
                </div>
              </div>
            </div>
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
          </Link>

          {/* 3 إجراءات سريعة */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <QuickAction
              href="/retailer/cart"
              icon={<ShoppingCart size={18} />}
              label="سلّتي"
            />
            <QuickAction
              href="/retailer/orders"
              icon={<Package size={18} />}
              label="طلباتي"
              badge={hasActive ? stats.pending : undefined}
            />
            <QuickAction
              href="/retailer/orders?filter=completed"
              icon={<CheckCircle2 size={18} />}
              label="مكتملة"
            />
          </div>
        </div>

        {/* ═════ تنبيه ذكي ═════ */}
        {hasActive && (
          <Link
            href="/retailer/orders?filter=active"
            className="group mb-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 transition-all hover:border-amber-300 active:scale-[0.99]"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <AlertCircle size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-amber-900">
                لديك {stats.pending} طلب قيد التنفيذ
              </p>
              <p className="text-xs text-amber-700">اضغط لمتابعتها</p>
            </div>
            <ArrowLeft size={16} className="text-amber-600 transition-transform group-hover:-translate-x-1" />
          </Link>
        )}

        {/* ═════ KPIs ═════ */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <KpiCard
            icon={<ShoppingCart className="h-5 w-5" />}
            label="إجمالي طلباتي"
            value={String(stats.orders)}
            color="blue"
          />
          <KpiCard
            icon={<Clock className="h-5 w-5" />}
            label="قيد التنفيذ"
            value={String(stats.pending)}
            color="amber"
            highlight={hasActive}
          />
          <KpiCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="تم التسليم"
            value={String(stats.delivered)}
            color="emerald"
          />
          <KpiCard
            icon={<Wallet className="h-5 w-5" />}
            label="إجمالي المشتريات"
            value={formatCurrency(stats.totalSpent)}
            color="purple"
          />
        </div>

        {/* ═════ آخر الطلبات ═════ */}
        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <h2 className="text-base font-black text-gray-900">آخر الطلبات</h2>
            <Link
              href="/retailer/orders"
              className="group inline-flex items-center gap-1 text-xs font-semibold text-[#2e8b73] hover:text-[#1e6b57]"
            >
              عرض الكل
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f4f0]">
                <Package className="h-6 w-6 text-[#2e8b73]" />
              </div>
              <p className="text-sm text-gray-500">لا توجد طلبات بعد</p>
              <Link
                href="/retailer/shop"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#2e8b73] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#1e6b57]"
              >
                <Plus size={12} /> ابدأ طلبك الأول
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentOrders.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/orders/${o.id}`}
                    className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-gray-50/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
                        <Store className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900">
                          #{String(o.id).slice(0, 8)}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {o.supplier_name || "تاجر جملة"}
                        </p>
                      </div>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <p className="text-sm font-black text-[#2e8b73]">
                        {formatCurrency(o.total)}
                      </p>
                      <StatusPill status={o.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════ مكونات فرعية ═════════════════════ */

function QuickAction({
  href, icon, label, badge,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-[#2e8b73]/30 hover:shadow-md active:scale-95"
    >
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f0] text-[#2e8b73] transition-transform group-hover:scale-110">
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-black text-white">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </div>
      <span className="text-center text-xs font-bold text-gray-700">{label}</span>
    </Link>
  );
}

function KpiCard({
  icon, label, value, color, highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "amber" | "emerald" | "purple";
  highlight?: boolean;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-[#e8f4f0] text-[#2e8b73]",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div
      className={`rounded-2xl border bg-white p-4 transition-all ${
        highlight
          ? "border-[#2e8b73]/30 shadow-sm shadow-[#2e8b73]/5"
          : "border-gray-100"
      }`}
    >
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${colors[color]}`}>
        {icon}
      </div>
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <p className="text-xl font-black text-gray-900">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    reviewing: { label: "قيد المراجعة", className: "bg-amber-50 text-amber-700" },
    delivering: { label: "قيد التوصيل", className: "bg-purple-50 text-purple-700" },
    completed: { label: "تم التسليم", className: "bg-[#e8f4f0] text-[#1e6b57]" },
    cancelled: { label: "ملغي", className: "bg-red-50 text-red-700" },
  };
  const info = map[status] || { label: status, className: "bg-gray-50 text-gray-600" };
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${info.className}`}>
      {info.label}
    </span>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "صباح الخير";
  if (h < 17) return "طاب يومك";
  if (h < 21) return "مساء الخير";
  return "مساء الخير";
}
