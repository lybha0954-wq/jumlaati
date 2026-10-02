"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { Truck, Clock, CheckCircle2, Wallet, Package, MapPin, ArrowLeft } from "lucide-react";
import { getStatusInfo } from "@/lib/constants/order-status";
import { KpiCard } from "@/components/shared/KpiCard";

interface Order {
  id: number;
  order_number?: string;
  status: string;
  total_amount: number;
  created_at: string;
  delivery_address?: string;
  retailer_name?: string;
  supplier_name?: string;
}

export default function DeliveryOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    delivered: 0,
    earnings: 0,
  });
  const [tasks, setTasks] = useState<Order[]>([]);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const data = res.ok ? await res.json() : [];
      const orders: Order[] = Array.isArray(data) ? data : [];

      const active = orders.filter((o) =>
        ["shipped", "picked_up"].includes(o.status)
      ).length;

      const delivered = orders.filter((o) => o.status === "delivered");

      // Delivery fee = 5% of total_amount (estimate)
      const earnings = delivered.reduce(
        (s, o) => s + Number(o.total_amount || 0) * 0.05,
        0
      );

      setStats({
        total: orders.length,
        active,
        delivered: delivered.length,
        earnings,
      });

      // Show only active tasks (shipped / picked_up)
      setTasks(
        orders
          .filter((o) => ["shipped", "picked_up"].includes(o.status))
          .slice(0, 5)
      );
    } catch {
      showToast("فشل التحميل", "error");
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
          <p className="text-sm text-gray-500">مهامك اليوم ونشاطك</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <KpiCard
            icon={<Truck className="h-5 w-5" />}
            label="مهام نشطة"
            value={String(stats.active)}
            color="blue"
            highlight={stats.active > 0}
          />
          <KpiCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="مهام مكتملة"
            value={String(stats.delivered)}
            color="emerald"
          />
          <KpiCard
            icon={<Wallet className="h-5 w-5" />}
            label="أرباحي (تقديري)"
            value={formatCurrency(stats.earnings)}
            color="purple"
          />
          <KpiCard
            icon={<Package className="h-5 w-5" />}
            label="إجمالي المهام"
            value={String(stats.total)}
            color="amber"
          />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <h2 className="text-base font-black text-gray-900">المهام الحالية</h2>
            <Link
              href="/delivery/tasks"
              className="group inline-flex items-center gap-1 text-xs font-semibold text-[#2e8b73] hover:text-[#1e6b57]"
            >
              عرض الكل
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f4f0]">
                <Truck className="h-6 w-6 text-[#2e8b73]" />
              </div>
              <p className="text-sm text-gray-500">لا توجد مهام حالياً</p>
              <p className="mt-1 text-xs text-gray-400">عندما يُسند إليك طلب، سيظهر هنا</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {tasks.map((o) => {
                const st = getStatusInfo(o.status);
                const orderLabel = o.order_number || `#${String(o.id).slice(0, 8)}`;
                return (
                  <li key={o.id}>
                    <Link
                      href={`/delivery/tasks`}
                      className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-gray-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900">{orderLabel}</p>
                          <p className="mt-0.5 text-xs text-gray-500 truncate max-w-[200px]">
                            {o.delivery_address || "بدون عنوان"}
                          </p>
                        </div>
                      </div>
                      <div className="text-left flex-shrink-0">
                        <p className="text-sm font-black text-[#2e8b73]">
                          {formatCurrency(o.total_amount)}
                        </p>
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