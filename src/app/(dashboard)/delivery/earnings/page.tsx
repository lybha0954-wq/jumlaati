"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { Wallet, TrendingUp, Package, Calendar, Coins, ArrowLeft } from "lucide-react";

interface Order {
  id: number;
  order_number?: string;
  status: string;
  total_amount: number;
  delivered_at?: string;
  created_at: string;
}

type Tab = "earnings" | "payouts";
const DELIVERY_RATE = 0.05;

export default function DeliveryEarningsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("earnings");
  const { showToast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const data = res.ok ? await res.json() : [];
      const all = Array.isArray(data) ? data : [];
      setOrders(all.filter((o: Order) => o.status === "delivered"));
    } catch {
      showToast("فشل التحميل", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Topbar />
        <div className="flex items-center justify-center py-32"><LoadingSpinner /></div>
      </div>
    );
  }

  const earningsOf = (o: Order) => Number(o.total_amount || 0) * DELIVERY_RATE;
  const totalEarnings = orders.reduce((s, o) => s + earningsOf(o), 0);
  const now = new Date();
  const thisMonth = orders.filter((o) => {
    const d = new Date(o.delivered_at || o.created_at);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
  const monthEarnings = thisMonth.reduce((s, o) => s + earningsOf(o), 0);
  const avgEarning = orders.length > 0 ? Math.round(totalEarnings / orders.length) : 0;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 text-2xl font-black text-gray-900">أرباحي</h1>
          <p className="text-sm text-gray-500">تفاصيل الأرباح والمدفوعات</p>
        </div>

        <div className="mb-5 flex gap-2">
          <button onClick={() => setTab("earnings")}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${tab === "earnings" ? "bg-[#2e8b73] text-white shadow-sm" : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"}`}>
            الأرباح
          </button>
          <button onClick={() => setTab("payouts")}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${tab === "payouts" ? "bg-[#2e8b73] text-white shadow-sm" : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"}`}>
            المدفوعات
          </button>
        </div>

        {tab === "earnings" ? (
          <EarningsView orders={orders} totalEarnings={totalEarnings} monthEarnings={monthEarnings} avgEarning={avgEarning} monthCount={thisMonth.length} earningsOf={earningsOf} />
        ) : (
          <PayoutsView />
        )}
      </div>
    </div>
  );
}

function EarningsView({ orders, totalEarnings, monthEarnings, avgEarning, monthCount, earningsOf }: any) {
  return (
    <>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="col-span-2 rounded-2xl border border-[#2e8b73]/30 bg-[#e8f4f0] p-5">
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#2e8b73]">
            <Wallet size={18} />
          </div>
          <p className="mb-1 text-xs text-[#1e6b57]">إجمالي الأرباح</p>
          <p className="text-3xl font-black text-[#1e6b57]">{formatCurrency(totalEarnings)}</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <TrendingUp size={16} />
          </div>
          <p className="mb-1 text-xs text-gray-500">أرباح هذا الشهر</p>
          <p className="text-lg font-black text-gray-900">{formatCurrency(monthEarnings)}</p>
          <p className="mt-0.5 text-[10px] text-gray-400">{monthCount} مهمة</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Package size={16} />
          </div>
          <p className="mb-1 text-xs text-gray-500">متوسط المهمة</p>
          <p className="text-lg font-black text-gray-900">{formatCurrency(avgEarning)}</p>
          <p className="mt-0.5 text-[10px] text-gray-400">{orders.length} مهمة</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white">
        <div className="border-b border-gray-100 p-4">
          <h2 className="text-base font-black text-gray-900">تفاصيل المهام</h2>
          <p className="mt-0.5 text-[11px] text-gray-500">بناءً على نسبة التوصيل (5%)</p>
        </div>
        {orders.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="mx-auto mb-3 h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">لا توجد مهام مكتملة بعد</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {orders.slice(0, 20).map((o: Order) => {
              const orderLabel = o.order_number || `#${String(o.id).slice(0, 8)}`;
              const date = o.delivered_at || o.created_at;
              return (
                <li key={o.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-gray-900">{orderLabel}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500">
                      <Calendar size={10} />
                      {new Date(date).toLocaleDateString("ar-IQ")}
                    </p>
                  </div>
                  <p className="text-sm font-black text-[#2e8b73]">+{formatCurrency(earningsOf(o))}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

function PayoutsView() {
  return (
    <>
      <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <Coins size={18} />
        </div>
        <p className="mb-1 text-xs text-gray-500">إجمالي المستحقات المدفوعة</p>
        <p className="text-3xl font-black text-gray-900">0 د.ع</p>
        <p className="mt-1 text-[11px] text-gray-400">لم تُسجَّل أي دفعة بعد</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white">
        <div className="border-b border-gray-100 p-4">
          <h2 className="text-base font-black text-gray-900">سجل المدفوعات</h2>
        </div>
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
            <Coins className="h-7 w-7 text-amber-500" />
          </div>
          <p className="text-sm font-bold text-gray-800">نظام المدفوعات قيد التطوير</p>
          <p className="mt-1 text-xs text-gray-500">عندما تُسجَّل أول دفعة، ستظهر هنا</p>
          <Link href="/delivery/tasks"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#2e8b73] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#1e6b57]">
            عرض مهامي <ArrowLeft size={12} />
          </Link>
        </div>
      </div>
    </>
  );
}
