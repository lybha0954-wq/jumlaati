"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import {
  Wallet, Search, CheckCircle2, XCircle, Zap, Lock,
  Percent, Info, DollarSign,
} from "lucide-react";

interface PaymentMethod {
  key: string;
  enabled: boolean;
  label: string;
  description: string | null;
  fee_percent: number;
  icon: string | null;
  requires_contract: boolean;
  sort_order: number;
}

export default function AdminPaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "on" | "off">("all");
  const { showToast } = useToast();

  const fetchMethods = useCallback(async () => {
    try {
      const res = await fetch("/api/payment-methods");
      const d = res.ok ? await res.json() : [];
      setMethods(Array.isArray(d) ? d : []);
    } catch {
      showToast("فشل التحميل", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMethods(); }, [fetchMethods]);

  const toggle = async (key: string, currentValue: boolean) => {
    setSaving(key);
    try {
      const res = await fetch("/api/payment-methods", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, enabled: !currentValue }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "فشل");
      }
      setMethods((prev) => prev.map((m) => m.key === key ? { ...m, enabled: !currentValue } : m));
      showToast(!currentValue ? "✅ تم التفعيل" : "تم الإيقاف", "success");
    } catch (e: any) {
      showToast(e?.message || "خطأ", "error");
    } finally {
      setSaving(null);
    }
  };

  const filtered = useMemo(() => {
    let list = methods;
    if (filter === "on") list = list.filter((m) => m.enabled);
    else if (filter === "off") list = list.filter((m) => !m.enabled);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((m) =>
        m.key.toLowerCase().includes(q) ||
        (m.label || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [methods, search, filter]);

  const counts = {
    all: methods.length,
    on: methods.filter((m) => m.enabled).length,
    off: methods.filter((m) => !m.enabled).length,
  };

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
          <h1 className="mb-1 flex items-center gap-2 text-2xl font-black text-gray-900">
            <Wallet size={22} className="text-[#2e8b73]" /> طرق الدفع
          </h1>
          <p className="text-sm text-gray-500">
            فعّل/أوقف طرق الدفع — بدون إعادة نشر
          </p>
        </div>

        {/* KPIs */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          <button onClick={() => setFilter("all")}
            className={`rounded-2xl border p-4 text-right transition-all ${
              filter === "all" ? "border-[#2e8b73]/40 bg-[#e8f4f0]" : "border-gray-100 bg-white hover:border-[#2e8b73]/20"
            }`}>
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#2e8b73]">
              <Zap size={14} />
            </div>
            <p className="text-[10px] text-gray-500">الكل</p>
            <p className="text-lg font-black text-gray-900">{counts.all}</p>
          </button>
          <button onClick={() => setFilter("on")}
            className={`rounded-2xl border p-4 text-right transition-all ${
              filter === "on" ? "border-[#2e8b73]/40 bg-[#e8f4f0]" : "border-gray-100 bg-white hover:border-[#2e8b73]/20"
            }`}>
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-emerald-600">
              <CheckCircle2 size={14} />
            </div>
            <p className="text-[10px] text-gray-500">مفعّلة</p>
            <p className="text-lg font-black text-emerald-600">{counts.on}</p>
          </button>
          <button onClick={() => setFilter("off")}
            className={`rounded-2xl border p-4 text-right transition-all ${
              filter === "off" ? "border-gray-300 bg-gray-100" : "border-gray-100 bg-white hover:border-gray-200"
            }`}>
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-500">
              <XCircle size={14} />
            </div>
            <p className="text-[10px] text-gray-500">معطّلة</p>
            <p className="text-lg font-black text-gray-700">{counts.off}</p>
          </button>
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 focus-within:border-[#2e8b73]/40">
          <Search size={16} className="text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في طرق الدفع..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400" />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <Wallet className="mx-auto mb-3 h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">لا نتائج مطابقة</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((m) => (
              <PaymentMethodCard key={m.key} method={m} saving={saving === m.key} onToggle={() => toggle(m.key, m.enabled)} />
            ))}
          </div>
        )}

        {/* ملاحظة توضيحية */}
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <Info size={16} className="mt-0.5 flex-shrink-0 text-blue-600" />
          <div className="text-xs leading-relaxed text-blue-800">
            <strong>ملاحظة:</strong> لتفعيل زين كاش / فاست باي / FIB — تحتاج للتعاقد مع المزود أولاً.
            الطرق المعطّلة ستظهر للعميل بـ "قريباً" بشكل أنيق.
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentMethodCard({ method, saving, onToggle }: {
  method: PaymentMethod;
  saving: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`rounded-2xl border bg-white p-4 transition-all ${
      method.enabled ? "border-[#2e8b73]/30" : "border-gray-100"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* أيقونة */}
          <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl ${
            method.enabled ? "bg-[#e8f4f0]" : "bg-gray-50"
          }`}>
            {method.icon || "💳"}
          </div>

          {/* التفاصيل */}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <p className={`truncate text-sm font-black ${method.enabled ? "text-gray-900" : "text-gray-600"}`}>
                {method.label}
              </p>
              {method.requires_contract && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                  <Lock size={10} /> يحتاج عقد
                </span>
              )}
            </div>

            {method.description && (
              <p className="mb-1.5 text-xs text-gray-500">{method.description}</p>
            )}

            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-400">
              <span className="font-mono" dir="ltr">{method.key}</span>
              {method.fee_percent > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Percent size={9} /> رسوم {method.fee_percent}%
                </span>
              )}
              {method.fee_percent === 0 && (
                <span className="inline-flex items-center gap-1 text-[#2e8b73]">
                  <DollarSign size={9} /> بدون رسوم
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Toggle */}
        <button
          onClick={onToggle}
          disabled={saving}
          aria-label={method.enabled ? "إيقاف" : "تفعيل"}
          className={`relative flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
            method.enabled ? "bg-[#2e8b73]" : "bg-gray-200"
          } ${saving ? "opacity-50" : ""}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            method.enabled ? "translate-x-0.5" : "translate-x-5"
          }`} />
        </button>
      </div>
    </div>
  );
}
