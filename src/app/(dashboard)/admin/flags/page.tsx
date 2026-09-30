"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { Flag, Search, CheckCircle2, XCircle, Zap } from "lucide-react";

interface FeatureFlag {
  key: string;
  enabled: boolean;
  label: string;
  description: string | null;
  category: string | null;
}

const CATEGORY_AR: Record<string, string> = {
  core: "أساسي",
  finance: "مالية",
  marketing: "تسويق",
  retailer: "سوبرماركت",
  delivery: "توصيل",
  communication: "تواصل",
  operations: "عمليات",
  quality: "جودة",
  admin: "إدارة",
  ai: "ذكاء",
  ui: "واجهة",
  i18n: "لغات",
};

const CATEGORY_COLOR: Record<string, string> = {
  core: "bg-[#e8f4f0] text-[#2e8b73]",
  finance: "bg-emerald-50 text-emerald-700",
  marketing: "bg-purple-50 text-purple-700",
  retailer: "bg-blue-50 text-blue-700",
  delivery: "bg-amber-50 text-amber-700",
  communication: "bg-cyan-50 text-cyan-700",
  operations: "bg-slate-50 text-slate-700",
  quality: "bg-pink-50 text-pink-700",
  admin: "bg-indigo-50 text-indigo-700",
  ai: "bg-violet-50 text-violet-700",
  ui: "bg-rose-50 text-rose-700",
  i18n: "bg-teal-50 text-teal-700",
};

export default function AdminFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "on" | "off">("all");
  const { showToast } = useToast();

  const fetchFlags = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/feature-flags");
      const d = res.ok ? await res.json() : {};
      setFlags(Array.isArray(d.flags) ? d.flags : []);
    } catch {
      showToast("فشل التحميل", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFlags(); }, [fetchFlags]);

  const toggle = async (key: string, currentValue: boolean) => {
    setSaving(key);
    try {
      const res = await fetch("/api/admin/feature-flags", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, enabled: !currentValue }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "فشل");
      }
      setFlags((prev) => prev.map((f) => f.key === key ? { ...f, enabled: !currentValue } : f));
      showToast(!currentValue ? "✅ تم التفعيل" : "تم الإيقاف", "success");
    } catch (e: any) {
      showToast(e?.message || "خطأ", "error");
    } finally {
      setSaving(null);
    }
  };

  const filtered = useMemo(() => {
    let list = flags;
    if (filter === "on") list = list.filter((f) => f.enabled);
    else if (filter === "off") list = list.filter((f) => !f.enabled);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((f) =>
        f.key.toLowerCase().includes(q) ||
        (f.label || "").toLowerCase().includes(q) ||
        (f.description || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [flags, search, filter]);

  const counts = {
    all: flags.length,
    on: flags.filter((f) => f.enabled).length,
    off: flags.filter((f) => !f.enabled).length,
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
            <Flag size={22} className="text-[#2e8b73]" /> الميزات
          </h1>
          <p className="text-sm text-gray-500">
            فعّل/أوقف ميزات النظام بضغطة زر — بدون إعادة نشر
          </p>
        </div>

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
            placeholder="ابحث في الميزات..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400" />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <Flag className="mx-auto mb-3 h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">لا نتائج مطابقة</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((f) => (
              <FlagCard key={f.key} flag={f} saving={saving === f.key} onToggle={() => toggle(f.key, f.enabled)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FlagCard({ flag, saving, onToggle }: { flag: FeatureFlag; saving: boolean; onToggle: () => void }) {
  const catColor = CATEGORY_COLOR[flag.category || ""] || "bg-gray-50 text-gray-600";
  const catLabel = CATEGORY_AR[flag.category || ""] || flag.category || "عام";

  return (
    <div className={`rounded-2xl border bg-white p-4 transition-all ${
      flag.enabled ? "border-[#2e8b73]/30" : "border-gray-100"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <p className={`truncate text-sm font-black ${flag.enabled ? "text-gray-900" : "text-gray-600"}`}>
              {flag.label}
            </p>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${catColor}`}>
              {catLabel}
            </span>
          </div>
          {flag.description && (
            <p className="mb-1 text-xs text-gray-500">{flag.description}</p>
          )}
          <p className="text-[10px] font-mono text-gray-400" dir="ltr">{flag.key}</p>
        </div>

        <button
          onClick={onToggle}
          disabled={saving}
          aria-label={flag.enabled ? "إيقاف" : "تفعيل"}
          className={`relative flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
            flag.enabled ? "bg-[#2e8b73]" : "bg-gray-200"
          } ${saving ? "opacity-50" : ""}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            flag.enabled ? "translate-x-0.5" : "translate-x-5"
          }`} />
        </button>
      </div>
    </div>
  );
}
