"use client";

import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { ListSkeleton } from "@/components/shared/SkeletonLoader";
import { formatCurrency } from "@/lib/utils/currency";
import { usePaginatedOrders } from "@/hooks/usePaginatedOrders";
import { Loader2, FileText, Store, ArrowLeft, Printer, CheckCircle2 } from "lucide-react";

interface Order {
  id: number;
  order_number?: string;
  total_amount: number;
  status: string;
  delivered_at?: string;
  created_at: string;
  supplier_name?: string;
}

export default function RetailerInvoicesPage() {
  const { items, loading, loadingMore, hasMore, loadMore } =
    usePaginatedOrders<Order>({ limit: 20 });

  const invoices = items.filter((o) =>
    ["shipped", "picked_up", "delivered"].includes(o.status)
  );
  const totalInvoiced = invoices.reduce((s, o) => s + Number(o.total_amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-24 dark:bg-gray-950">
        <Topbar />
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="mb-5">
            <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />
          </div>
          <ListSkeleton count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 dark:bg-gray-950">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 flex items-center gap-2 text-2xl font-black text-gray-900 dark:text-gray-100">
            <FileText size={22} className="text-[#2e8b73]" /> فواتيري
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {invoices.length} فاتورة — إجمالي {formatCurrency(totalInvoiced)}
          </p>
        </div>

        {invoices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f0] dark:bg-[#1e3a33]">
              <FileText className="h-7 w-7 text-[#2e8b73]" />
            </div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">لا توجد فواتير بعد</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              ستظهر هنا عند استلام أول طلب
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {invoices.map((o) => {
                const orderLabel = o.order_number || `#${String(o.id).slice(0, 8)}`;
                const isDelivered = o.status === "delivered";
                return (
                  <div
                    key={o.id}
                    className="rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-[#2e8b73]/30 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${
                            isDelivered
                              ? "bg-[#e8f4f0] text-[#2e8b73] dark:bg-[#1e3a33]"
                              : "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                          }`}
                        >
                          {isDelivered ? (
                            <CheckCircle2 size={18} />
                          ) : (
                            <FileText size={18} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-gray-900 dark:text-gray-100">
                            {orderLabel}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <Store size={11} />
                            <span className="truncate">
                              {o.supplier_name || "تاجر جملة"}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="text-left flex-shrink-0">
                        <div className="text-base font-black text-[#2e8b73] dark:text-[#6ecdb0]">
                          {formatCurrency(o.total_amount)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 border-t border-gray-50 pt-3 dark:border-gray-800">
                      <Link
                        href={`/orders/${o.id}`}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-xs font-bold text-gray-700 transition-colors hover:border-[#2e8b73]/30 hover:bg-[#e8f4f0] hover:text-[#1e6b57] dark:border-gray-700 dark:text-gray-300 dark:hover:bg-[#1e3a33]"
                      >
                        <ArrowLeft size={13} /> التفاصيل
                      </Link>
                      <Link
                        href={`/invoice/${o.id}`}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#2e8b73] py-2 text-xs font-bold text-white transition-all hover:bg-[#1e6b57]"
                      >
                        <Printer size={13} /> طباعة
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div className="mt-5 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-[#2e8b73] bg-white px-6 py-3 text-sm font-bold text-[#2e8b73] transition-all hover:bg-[#e8f4f0] active:scale-95 disabled:opacity-50 dark:bg-gray-900 dark:hover:bg-[#1e3a33]"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      جاري التحميل...
                    </>
                  ) : (
                    <>تحميل المزيد</>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
