"use client";

import { Topbar } from "@/components/dashboard/Topbar";
import { KpiCard } from "@/components/shared/KpiCard";
import { ListSkeleton } from "@/components/shared/SkeletonLoader";
import { formatCurrency } from "@/lib/utils/currency";
import { usePaginatedOrders } from "@/hooks/usePaginatedOrders";
import { Wallet, TrendingUp, Package, ShoppingBag, Store } from "lucide-react";

interface Order {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  supplier_name?: string;
}

export default function RetailerAnalyticsPage() {
  const { items: orders, loading } = usePaginatedOrders<Order>({ limit: 50 });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-24 dark:bg-gray-950">
        <Topbar />
        <div className="mx-auto max-w-3xl px-4 py-6">
          <ListSkeleton count={5} />
        </div>
      </div>
    );
  }

  const delivered = orders.filter((o) => o.status === "delivered");
  const active = orders.filter((o) =>
    ["pending", "accepted", "shipped", "picked_up"].includes(o.status)
  );
  const totalSpent = delivered.reduce((s, o) => s + Number(o.total_amount || 0), 0);
  const activeAmount = active.reduce((s, o) => s + Number(o.total_amount || 0), 0);
  const avgOrder = delivered.length > 0 ? Math.round(totalSpent / delivered.length) : 0;

  const bySupplier: Record<string, { name: string; count: number; total: number }> = {};
  delivered.forEach((o) => {
    const key = o.supplier_name || "غير معروف";
    if (!bySupplier[key]) bySupplier[key] = { name: key, count: 0, total: 0 };
    bySupplier[key].count += 1;
    bySupplier[key].total += Number(o.total_amount || 0);
  });
  const suppliers = Object.values(bySupplier).sort((a, b) => b.total - a.total);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 dark:bg-gray-950">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 flex items-center gap-2 text-2xl font-black text-gray-900 dark:text-gray-100">
            <TrendingUp size={22} className="text-[#2e8b73]" /> مشترياتي
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            تحليل شامل لمشترياتك من تجار الجملة
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <KpiCard
            icon={<Wallet size={16} />}
            label="إجمالي المشتريات"
            value={formatCurrency(totalSpent)}
            color="emerald"
          />
          <KpiCard
            icon={<TrendingUp size={16} />}
            label="متوسط الطلب"
            value={formatCurrency(avgOrder)}
            color="amber"
          />
          <KpiCard
            icon={<Package size={16} />}
            label="طلبات نشطة"
            value={String(active.length)}
            sub={activeAmount > 0 ? formatCurrency(activeAmount) : undefined}
            color="blue"
          />
          <KpiCard
            icon={<ShoppingBag size={16} />}
            label="طلبات مكتملة"
            value={String(delivered.length)}
            color="purple"
          />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-100 p-4 dark:border-gray-800">
            <h2 className="text-base font-black text-gray-900 dark:text-gray-100">
              المشتريات حسب التاجر
            </h2>
          </div>
          {suppliers.length === 0 ? (
            <div className="p-8 text-center">
              <Store className="mx-auto mb-3 h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                لا توجد مشتريات مكتملة بعد
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50 dark:divide-gray-800">
              {suppliers.map((s, i) => {
                const percent =
                  totalSpent > 0 ? Math.round((s.total / totalSpent) * 100) : 0;
                return (
                  <li key={i} className="p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f4f0] text-sm font-black text-[#2e8b73] dark:bg-[#1e3a33]">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {s.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {s.count} طلب
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-[#2e8b73] dark:text-[#6ecdb0]">
                        {formatCurrency(s.total)}
                      </p>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full bg-[#2e8b73] transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
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
