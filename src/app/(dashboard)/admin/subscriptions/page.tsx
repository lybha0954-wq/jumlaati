"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import {
  Crown, Search, Users, TrendingUp, Calendar, CheckCircle2,
  XCircle, Clock, Wallet,
} from "lucide-react";

interface Subscription {
  id: string;
  user_id: string;
  plan_key: string;
  status: string;
  paid_amount: number;
  payment_method: string | null;
  started_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "expired" | "cancelled">("all");
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/subscriptions");
      const d = res.ok ? await res.json() : [];
      setSubs(Array.isArray(d) ? d : []);
    } catch {
      showToast("فشل التحميل", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const counts = useMemo(() => ({
    all: subs.length,
    active: subs.filter((s) => s.status === "active").length,
    expired: subs.filter((s) => s.status === "expired").length,
    cancelled: subs.filter((s) => s.status === "cancelled").length,
  }), [subs]);

  const revenue = useMemo(() => {
    return subs
      .filter((s) => s.status === "active" || s.status === "expired")
      .reduce((sum, s) => sum + Number(s.paid_amount || 0), 0);
  }, [subs]);

  const filtered = useMemo(() => {
    let list = subs;
    if (filter !== "all") list = list.filter((s) => s.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) =>
        s.plan_key.toLowerCase().includes(q) ||
        s.user_id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [subs, filter, search]);

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
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 flex items-center gap-2 text-2xl font-black text-gray-900">
            <Crown size={22} className="text-amber-500" /> الاشتراكات
          </h1>
          <p className="text-sm text-gray-500">{subs.length} اشتراك مسجّل</p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <KPI icon={<Users size={16} />} label="الإجمالي" value={String(counts.all)} color="blue" />
          <KPI icon={<CheckCircle2 size={16} />} label="نشط" value={String(counts.active)} color="emerald" />
          <KPI icon={<Clock size={16} />} label="منتهي" value={String(counts.expired)} color="amber" />
          <KPI icon={<Wallet size={16} />} label="الإيراد" value={formatCurrency(revenue)} color="purple" />
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {(["all", "active", "expired", "cancelled"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                filter === f
                  ? "bg-[#2e8b73] text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"
              }`}>
              {f === "all" ? "الكل" : f === "active" ? "نشط" : f === "expired" ? "منتهي" : "ملغي"}
              <span className="ml-1.5">{counts[f]}</span>
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3">
          <Search size={16} className="text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالباقة أو رقم المستخدم..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400" />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <Crown className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500">لا توجد اشتراكات</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((s) => (
              <SubCard key={s.id} sub={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KPI({ icon, label, value, color }: any) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-[#e8f4f0] text-[#2e8b73]",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl ${colors[color]}`}>
        {icon}
      </div>
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <p className="text-base font-black text-gray-900">{value}</p>
    </div>
  );
}

function SubCard({ sub }: { sub: Subscription }) {
  const statusInfo: Record<string, { label: string; cls: string }> = {
    active:    { label: "نشط",   cls: "bg-[#e8f4f0] text-[#1e6b57]" },
    expired:   { label: "منتهي", cls: "bg-amber-50 text-amber-700" },
    cancelled: { label: "ملغي",  cls: "bg-red-50 text-red-700" },
    pending:   { label: "معلّق", cls: "bg-blue-50 text-blue-700" },
  };
  const st = statusInfo[sub.status] || statusInfo.pending;

  const daysLeft = sub.expires_at
    ? Math.ceil((new Date(sub.expires_at).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 uppercase">
              {sub.plan_key}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${st.cls}`}>
              {st.label}
            </span>
            {sub.status === "active" && daysLeft !== null && (
              <span className="text-[10px] text-gray-400">
                ({daysLeft > 0 ? `${daysLeft} يوم` : "اليوم"})
              </span>
            )}
          </div>
          <p className="truncate font-mono text-[10px] text-gray-400" dir="ltr">
            user: {sub.user_id.slice(0, 12)}...
          </p>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-gray-500">
            {sub.started_at && (
              <span className="inline-flex items-center gap-1">
                <Calendar size={9} /> بدأ {new Date(sub.started_at).toLocaleDateString("ar-IQ")}
              </span>
            )}
            {sub.expires_at && (
              <span>ينتهي {new Date(sub.expires_at).toLocaleDateString("ar-IQ")}</span>
            )}
          </div>
        </div>
        <div className="text-left flex-shrink-0">
          <p className="text-base font-black text-[#2e8b73]">
            {formatCurrency(sub.paid_amount)}
          </p>
          {sub.payment_method && (
            <p className="text-[10px] text-gray-400">{sub.payment_method}</p>
          )}
        </div>
      </div>
    </div>
  );
}
