"use client";

import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import { Package, Plus, Trash2, Pencil, AlertTriangle, X } from "lucide-react";

interface Product {
  id: string; name: string; price: number; final_price?: number;
  stock?: number; category?: string; status?: string; image?: string;
}

export default function WholesaleProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/my-products");
      const d = await res.json();
      const list = Array.isArray(d) ? d : (d.products || []);
      setProducts(list);
    } catch { showToast("فشل تحميل المنتجات", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`حذف "${name}"؟`)) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) { showToast("تم الحذف", "success"); fetchProducts(); }
    else showToast("فشل الحذف", "error");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h1 className="mb-1 text-2xl font-black text-gray-900">منتجاتي</h1>
            <p className="text-sm text-gray-500">{products.length} منتج في متجرك</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-full bg-[#2e8b73] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#2e8b73]/20 transition-all hover:bg-[#1e6b57] active:scale-95">
            <Plus size={14} /> إضافة
          </button>
        </div>

        {loading ? (
          <div className="py-16"><LoadingSpinner /></div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f0]">
              <Package className="h-7 w-7 text-[#2e8b73]" />
            </div>
            <p className="text-sm font-bold text-gray-800">لا توجد منتجات بعد</p>
            <button onClick={() => setShowForm(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2e8b73] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#2e8b73]/20 transition-all hover:bg-[#1e6b57] active:scale-95">
              <Plus size={16} /> أضف منتجك الأول
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => {
              const stock = Number(p.stock ?? 0);
              const stockInfo =
                stock === 0
                  ? { label: "نفد", cls: "bg-red-50 text-red-700" }
                  : stock < 10
                  ? { label: `منخفض (${stock})`, cls: "bg-amber-50 text-amber-700" }
                  : { label: `${stock} متوفر`, cls: "bg-[#e8f4f0] text-[#1e6b57]" };
              const price = Number(p.final_price ?? 0);

              return (
                <div key={p.id}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 transition-all hover:border-[#2e8b73]/30">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <Package className="h-6 w-6 text-gray-300" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">{p.name}</p>
                    <p className="mt-0.5 text-base font-black text-[#2e8b73]">
                      {formatCurrency(price)}
                    </p>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${stockInfo.cls}`}>
                      {stockInfo.label}
                    </span>
                  </div>

                  <div className="flex flex-shrink-0 gap-1">
                    <button onClick={() => showToast("التعديل قريباً", "info")}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 text-gray-500 transition-colors hover:border-[#2e8b73]/30 hover:text-[#2e8b73]">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(p.id, p.name)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 text-gray-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <QuickAddModal
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); fetchProducts(); }}
        />
      )}
    </div>
  );
}

/* ═══════════ نافذة الإضافة السريعة ═══════════ */

function QuickAddModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
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
        body: JSON.stringify({
          name: name.trim(),
          price: Number(price),
          stock: Number(stock) || 0,
        }),
      });
      const d = await res.json();
      if (!res.ok || !d.ok) throw new Error(d.message || d.error || "فشل");
      showToast("تمت الإضافة ✅", "success");
      onSuccess();
    } catch (e: any) {
      setError(e?.message || "خطأ");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4 animate-fade-in">
      <div className="w-full rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-3xl animate-slide-up">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900">إضافة منتج جديد</h2>
          <button onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-gray-700">اسم المنتج</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="مثال: شاي العروسة 500g"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm transition-all focus:border-[#2e8b73] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2e8b73]/20" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">السعر (د.ع)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                placeholder="5000" dir="ltr"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm transition-all focus:border-[#2e8b73] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2e8b73]/20" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">المخزون</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)}
                placeholder="50" dir="ltr"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm transition-all focus:border-[#2e8b73] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2e8b73]/20" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
              <AlertTriangle size={14} className="text-red-500" />
              <p className="text-xs font-bold text-red-700">{error}</p>
            </div>
          )}

          <button onClick={handleSave} disabled={saving}
            className="w-full rounded-xl bg-[#2e8b73] py-3.5 text-sm font-black text-white shadow-lg shadow-[#2e8b73]/20 transition-all hover:bg-[#1e6b57] active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none">
            {saving ? "جارٍ الحفظ..." : "حفظ المنتج"}
          </button>
        </div>
      </div>
    </div>
  );
}
