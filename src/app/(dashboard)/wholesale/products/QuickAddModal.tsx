"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/useToast";

export function QuickAddModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("50");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const handleSave = async () => {
    setError("");
    if (!name.trim()) return setError("أدخل اسم المنتج");
    if (!price || Number(price) <= 0) return setError("أدخل سعراً صحيحاً");
    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), price: Number(price), stock: Number(stock) || 0 }),
      });
      const d = await res.json();
      if (!res.ok || !d.ok) throw new Error(d.message || d.error || "فشل");
      showToast("تمت الإضافة ✅", "success");
      onSuccess();
    } catch (e: any) {
      setError(e?.message || "خطأ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-3xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900">إضافة منتج جديد</h2>
          <button onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-gray-700">اسم المنتج</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="مثال: شاي 500g"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none focus:border-[#2e8b73] focus:bg-white focus:ring-2 focus:ring-[#2e8b73]/20" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">السعر (د.ع)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                placeholder="5000" dir="ltr"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none focus:border-[#2e8b73] focus:bg-white focus:ring-2 focus:ring-[#2e8b73]/20" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">المخزون</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)}
                placeholder="50" dir="ltr"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none focus:border-[#2e8b73] focus:bg-white focus:ring-2 focus:ring-[#2e8b73]/20" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
              <AlertTriangle size={14} className="text-red-500" />
              <p className="text-xs font-bold text-red-700">{error}</p>
            </div>
          )}

          <button onClick={handleSave} disabled={saving}
            className="w-full rounded-xl bg-[#2e8b73] py-3.5 text-sm font-black text-white shadow-lg shadow-[#2e8b73]/20 hover:bg-[#1e6b57] active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none">
            {saving ? "جارٍ الحفظ..." : "حفظ المنتج"}
          </button>
        </div>
      </div>
    </div>
  );
}
