"use client";

import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { Wallet, TrendingUp, Percent, Package, Clock, CheckCircle2 } from "lucide-react";
import { KpiCard } from "@/components/shared/KpiCard";

interface Order {
  id: number;
  order_number?: string;
  status: string;
  total_amount: number;
  commission: number;
  subtotal: number;
  payment_status: string;
  created_at: string;
  delivered_at?: string;
  retailer_name?: string;
}

type Tab = "earnings" | "payouts";

export default function WholesaleFinancePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("earnings");
  const { showToast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const data = res.ok ? await res.json() : [];
      setOrders(Array.isArray(data) ? data : []);
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

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 text-2xl font-black text-gray-900">المالية</h1>
          <p className="text-sm text-gray-500">الأرباح والعمولات والمستحقات</p>
        </div>

        <div className="mb-5 flex gap-2">
          <button onClick={() => setTab("earnings")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
              tab === "earnings" ? "bg-[#2e8b73] text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"
            }`}>
            <TrendingUp size={14} /> الأرباح
          </button>
          <button onClick={() => setTab("payouts")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
              tab === "payouts" ? "bg-[#2e8b73] text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"
            }`}>
            <Wallet size={14} /> المستحقات
          </button>
        </div>

        {tab === "earnings" ? <EarningsView orders={orders} /> : <PayoutsView orders={orders} />}
      </div>
    </div>
  );
}

function EarningsView({ orders }: { orders: Order[] }) {
  const delivered = orders.filter((o) => o.status === "delivered");
  const grossSales = delivered.reduce((s, o) => s + Number(o.total_amount || 0), 0);
  const totalCommission = delivered.reduce((s, o) => s + Number(o.commission || 0), 0);
  const netSales = grossSales - totalCommission;

  return (
    <>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <KpiCard icon={<TrendingUp size={16} />} label="إجمالي المبيعات" value={formatCurrency(grossSales)} color="emerald" />
        <KpiCard icon={<Percent size={16} />} label="عمولة المنصة" value={formatCurrency(totalCommission)} color="amber" />
        <div className="col-span-2 rounded-2xl border border-[#2e8b73]/30 bg-[#e8f4f0] p-4">
          <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#2e8b73]">
            <Wallet size={16} />
          </div>
          <p className="mb-1 text-xs text-[#1e6b57]">صافي الأرباح</p>
          <p className="text-2xl font-black text-[#1e6b57]">{formatCurrency(netSales)}</p>
        </div>
        <KpiCard icon={<Package size={16} />} label="طلبات مكتملة" value={String(delivered.length)} color="purple" />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white">
        <div className="border-b border-gray-100 p-4">
          <h2 className="text-base font-black text-gray-900">تفاصيل الطلبات المكتملة</h2>
        </div>
        {delivered.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="mx-auto mb-3 h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">لا توجد مبيعات مكتملة بعد</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {delivered.map((o) => {
              const orderLabel = o.order_number || `#${String(o.id).slice(0, 8)}`;
              return (
                <li key={o.id} className="p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-gray-900">{orderLabel}</p>
                    <p className="text-sm font-black text-[#2e8b73]">{formatCurrency(o.total_amount)}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-gray-500">{o.retailer_name || "سوبرماركت"}</span>
                    <span className="font-bold text-amber-600">- {formatCurrency(o.commission)} عمولة</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

function PayoutsView({ orders }: { orders: Order[] }) {
  const pending = orders.filter((o) =>
    ["pending", "accepted", "shipped", "picked_up"].includes(o.status)
  );
  const delivered = orders.filter((o) => o.status === "delivered");
  const pendingAmount = pending.reduce((s, o) => s + Number(o.total_amount || 0), 0);
  const paidAmount = delivered.reduce((s, o) => s + Number(o.total_amount || 0), 0);
  const expectedNet = delivered.reduce(
    (s, o) => s + (Number(o.total_amount || 0) - Number(o.commission || 0)), 0
  );

  return (
    <>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <KpiCard icon={<Clock size={16} />} label="مبالغ معلّقة" value={formatCurrency(pendingAmount)} sub={`${pending.length} طلب`} color="amber" />
        <KpiCard icon={<CheckCircle2 size={16} />} label="محصّل فعلياً" value={formatCurrency(paidAmount)} sub={`${delivered.length} طلب`} color="emerald" />
        <div className="col-span-2 rounded-2xl border border-[#2e8b73]/30 bg-[#e8f4f0] p-4">
          <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#2e8b73]">
            <Wallet size={16} />
          </div>
          <p className="mb-1 text-xs text-[#1e6b57]">صافي المستحق بعد العمولة</p>
          <p className="text-2xl font-black text-[#1e6b57]">{formatCurrency(expectedNet)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <h2 className="text-base font-black text-gray-900">الطلبات المعلّقة</h2>
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
            {pending.length} طلب
          </span>
        </div>
        {pending.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f4f0]">
              <CheckCircle2 className="h-6 w-6 text-[#2e8b73]" />
            </div>
            <p className="text-sm font-bold text-gray-800">لا توجد مبالغ معلقة</p>
            <p className="mt-1 text-xs text-gray-500">كل الطلبات تمت معالجتها</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {pending.map((o) => {
              const orderLabel = o.order_number || `#${String(o.id).slice(0, 8)}`;
              const statusAr: Record<string, string> = {
                pending: "جديد", accepted: "مقبول",
                shipped: "قيد التوصيل", picked_up: "مع المندوب",
              };
              return (
                <li key={o.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-gray-900">{orderLabel}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{statusAr[o.status] || o.status}</p>
                  </div>
                  <p className="text-sm font-black text-amber-600">{formatCurrency(o.total_amount)}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}