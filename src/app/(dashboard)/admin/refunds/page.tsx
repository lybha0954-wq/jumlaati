"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListSkeleton, KPISkeleton } from "@/components/shared/SkeletonLoader";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import {
  RotateCcw, CheckCircle2, XCircle, Clock, AlertTriangle,
  Calendar, User, Package, Search,
} from "lucide-react";

interface Refund {
  id: string;
  order_id: number;
  amount: number;
  reason: string | null;
  status: "pending" | "approved" | "rejected" | "refunded";
  requested_by: string;
  reviewed_by: string | null;
  created_at: string;
  order_number?: string | null;
  order_total?: number | null;
  requester_name?: string;
}

type Filter = "all" | "pending" | "approved" | "rejected" | "refunded";

const FILTERS: { key: Filter; label: string; color: string }[] = [
  { key: "all", label: "الكل", color: "bg-gray-100" },
  { key: "pending", label: "بانتظار", color: "bg-amber-500" },
  { key: "approved", label: "مقبولة", color: "bg-blue-500" },
  { key: "refunded", label: "مُستردة", color: "bg-[#2e8b73]" },
  { key: "rejected", label: "مرفوضة", color: "bg-red-500" },
];

export default function AdminRefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/refunds");
      const d = res.ok ? await res.json() : [];
      setRefunds(Array.isArray(d) ? d : []);
    } catch {
      showToast("فشل التحميل", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (id: string, status: "approved" | "rejected" | "refunded") => {
    setBusy(id);
    try {
      const res = await fetch(`/api/refunds/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showToast("✅ تم التحديث", "success");
        fetchData();
      } else {
        const d = await res.json().catch(() => ({}));
        showToast(d.error || "فشل التحديث", "error");
      }
    } catch {
      showToast("خطأ في الاتصال", "error");
    } finally {
      setBusy(null);
    }
  };

  const counts = useMemo(() => ({
    all: refunds.length,
    pending: refunds.filter((r) => r.status === "pending").length,
    approved: refunds.filter((r) => r.status === "approved").length,
    refunded: refunds.filter((r) => r.status === "refunded").length,
    rejected: refunds.filter((r) => r.status === "rejected").length,
  }), [refunds]);

  const filtered = useMemo(() => {
    let list = refunds;
    if (filter !== "all") list = list.filter((r) => r.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        String(r.order_id).includes(q) ||
        (r.order_number || "").toLowerCase().includes(q) ||
        (r.requester_name || "").toLowerCase().includes(q) ||
        (r.reason || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [refunds, filter, search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-24">
        <Topbar />
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="mb-5">
            <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-100" />
          </div>
          <ListSkeleton count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 flex items-center gap-2 text-2xl font-black text-gray-900">
            <RotateCcw size={22} className="text-blue-500" /> المرتجعات
          </h1>
          <p className="text-sm text-gray-500">{refunds.length} طلب استرداد</p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
          {FILTERS.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`rounded-2xl border p-3 text-right transition-all ${
                filter === f.key
                  ? "border-[#2e8b73]/40 bg-[#e8f4f0]"
                  : "border-gray-100 bg-white hover:border-[#2e8b73]/20"
              }`}>
              <div className={`mb-1.5 h-1.5 w-6 rounded-full ${f.color}`} />
              <p className="text-[10px] text-gray-500">{f.label}</p>
              <p className="text-lg font-black text-gray-900">{counts[f.key]}</p>
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 focus-within:border-[#2e8b73]/40">
          <Search size={16} className="text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث برقم الطلب أو السبب..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400" />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <RotateCcw className="mx-auto mb-3 h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">لا توجد طلبات استرداد</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((r) => (
              <RefundCard key={r.id} refund={r} busy={busy === r.id} onUpdate={updateStatus} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RefundCard({ refund, busy, onUpdate }: { refund: Refund; busy: boolean; onUpdate: (id: string, s: any) => void }) {
  const statusInfo: Record<string, { label: string; cls: string; Icon: any }> = {
    pending:  { label: "بانتظار المراجعة", cls: "bg-amber-50 text-amber-700",     Icon: Clock },
    approved: { label: "مقبول",            cls: "bg-blue-50 text-blue-700",       Icon: CheckCircle2 },
    refunded: { label: "تم الاسترداد",     cls: "bg-[#e8f4f0] text-[#1e6b57]",    Icon: CheckCircle2 },
    rejected: { label: "مرفوض",            cls: "bg-red-50 text-red-700",         Icon: XCircle },
  };
  const st = statusInfo[refund.status] || statusInfo.pending;
  const StIcon = st.Icon;
  const dateStr = String(refund.created_at || "").slice(0, 16);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 hover:border-[#2e8b73]/20">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="text-sm font-black text-gray-900">
              {refund.order_number || `#${refund.order_id}`}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${st.cls}`}>
              <StIcon size={11} /> {st.label}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <User size={11} /> {refund.requester_name || "مستخدم"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar size={10} /> {dateStr}
            </span>
          </div>

          {refund.reason && (
            <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
              {refund.reason}
            </p>
          )}
        </div>

        <div className="flex-shrink-0 text-left">
          <p className="text-lg font-black text-[#2e8b73]">{formatCurrency(refund.amount)}</p>
          {refund.order_total && (
            <p className="text-[10px] text-gray-400">من {formatCurrency(refund.order_total)}</p>
          )}
        </div>
      </div>

      {refund.status === "pending" && (
        <div className="flex gap-2 border-t border-gray-50 pt-3">
          <button onClick={() => onUpdate(refund.id, "approved")} disabled={busy}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#2e8b73] py-2 text-xs font-bold text-white hover:bg-[#1e6b57] active:scale-95 disabled:opacity-50">
            <CheckCircle2 size={14} /> موافقة
          </button>
          <button onClick={() => onUpdate(refund.id, "rejected")} disabled={busy}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 active:scale-95 disabled:opacity-50">
            <XCircle size={14} /> رفض
          </button>
        </div>
      )}

      {refund.status === "approved" && (
        <div className="border-t border-gray-50 pt-3">
          <button onClick={() => onUpdate(refund.id, "refunded")} disabled={busy}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#2e8b73] py-2 text-xs font-bold text-white hover:bg-[#1e6b57] active:scale-95 disabled:opacity-50">
            <CheckCircle2 size={14} /> تأكيد الاسترداد
          </button>
        </div>
      )}
    </div>
  );
}
