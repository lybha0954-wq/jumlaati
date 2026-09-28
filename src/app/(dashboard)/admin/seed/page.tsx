"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { useToast } from "@/hooks/useToast";
import {
  Sparkles, Trash2, CheckCircle2, XCircle,
  Loader2, FlaskConical, AlertTriangle,
} from "lucide-react";

export default function SeedPage() {
  const [loading, setLoading] = useState<"seed" | "clean" | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [lastResult, setLastResult] = useState<"ok" | "err" | null>(null);
  const { showToast } = useToast();

  const run = async (method: "POST" | "DELETE") => {
    setLoading(method === "POST" ? "seed" : "clean");
    setLog([]);
    setLastResult(null);

    try {
      const res = await fetch("/api/dev/seed", { method });
      const data = await res.json();

      if (data.ok) {
        setLastResult("ok");
        setLog(data.log || [data.message || "تم"]);
        showToast(method === "POST" ? "تم إنشاء البيانات 🌱" : "تم الحذف 🗑️", "success");
      } else {
        setLastResult("err");
        setLog([data.error || "خطأ غير معروف"]);
        showToast("فشل التنفيذ", "error");
      }
    } catch (err: any) {
      setLastResult("err");
      setLog([err?.message || "فشل الاتصال"]);
      showToast("فشل الاتصال", "error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />

      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* رأس */}
        <div className="mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1">
            <FlaskConical size={12} className="text-amber-700" />
            <span className="text-xs font-bold text-amber-700">
              أدوات المطوّر
            </span>
          </div>
          <h1 className="mb-1 text-2xl font-black text-gray-900">
            البيانات التجريبية
          </h1>
          <p className="text-sm text-gray-500">
            املأ التطبيق ببيانات جاهزة للتقييم والاختبار
          </p>
        </div>

        {/* تحذير */}
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-amber-600" />
          <div className="text-xs leading-relaxed text-amber-800">
            <p className="font-bold">للمطورين فقط</p>
            <p className="mt-1">
              هذا ستُستخدم للتقييم. لن تؤثر على المستخدمين الحقيقيين — الطلبات تحمل وسم <code className="rounded bg-white px-1 font-mono text-[10px]">DEMO-</code>.
            </p>
          </div>
        </div>

        {/* الأزرار */}
        <div className="mb-6 space-y-3">
          <button
            onClick={() => run("POST")}
            disabled={loading !== null}
            className="flex w-full items-center justify-between gap-4 rounded-2xl bg-gradient-to-l from-[#2e8b73] to-[#1e6b57] p-5 text-white shadow-lg shadow-[#2e8b73]/20 transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                {loading === "seed" ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Sparkles size={20} />
                )}
              </div>
              <div className="text-right">
                <div className="text-base font-black">املأ البيانات</div>
                <div className="text-xs text-white/80">
                  8 منتجات + 5 طلبات بحالات مختلفة
                </div>
              </div>
            </div>
            <span className="text-sm font-bold">→</span>
          </button>

          <button
            onClick={() => {
              if (!confirm("حذف كل البيانات التجريبية؟")) return;
              run("DELETE");
            }}
            disabled={loading !== null}
            className="flex w-full items-center justify-between gap-4 rounded-2xl border-2 border-red-200 bg-white p-5 text-red-700 transition-all hover:border-red-300 hover:bg-red-50 active:scale-[0.98] disabled:opacity-60"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                {loading === "clean" ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Trash2 size={20} />
                )}
              </div>
              <div className="text-right">
                <div className="text-base font-black">احذف البيانات التجريبية</div>
                <div className="text-xs text-red-500/80">
                  ينظّف كل ما وُسم بـ DEMO-
                </div>
              </div>
            </div>
            <span className="text-sm font-bold">→</span>
          </button>
        </div>

        {/* السجل */}
        {log.length > 0 && (
          <div
            className={`rounded-2xl border p-4 ${
              lastResult === "ok"
                ? "border-[#2e8b73]/30 bg-[#e8f4f0]/50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className="mb-3 flex items-center gap-2">
              {lastResult === "ok" ? (
                <CheckCircle2 size={16} className="text-[#2e8b73]" />
              ) : (
                <XCircle size={16} className="text-red-500" />
              )}
              <span className="text-sm font-bold text-gray-900">
                {lastResult === "ok" ? "نجح ✅" : "فشل ❌"}
              </span>
            </div>
            <ul className="space-y-1.5 text-xs leading-relaxed text-gray-700">
              {log.map((line, i) => (
                <li key={i} className="font-mono">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
