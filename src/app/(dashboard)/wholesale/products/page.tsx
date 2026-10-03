"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Topbar } from "@/components/dashboard/Topbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListSkeleton, KPISkeleton } from "@/components/shared/SkeletonLoader";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import {
  Package, Plus, Trash2, Pencil, AlertTriangle, X, Download,
  TrendingDown, TrendingUp, Minus, Boxes,
} from "lucide-react";

import dynamic from "next/dynamic";

const QuickAddModal = dynamic(
  () => import("./QuickAddModal").then((m) => ({ default: m.QuickAddModal })),
  {
    loading: () => (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="h-32 w-64 animate-pulse rounded-3xl bg-white dark:bg-gray-900" />
      </div>
    ),
  }
);
interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity?: number;
  category?: string;
  status?: string;
  image_url?: string;
  unit?: string;
}

type Tab = "products" | "inventory";

export default function WholesaleProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<Tab>("products");
  const [saving, setSaving] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/my-products");
      const d = await res.json();
      const list = Array.isArray(d) ? d : (d.products || []);
      setProducts(list);
    } catch {
      showToast("فشل تحميل المنتجات", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`حذف "${name}"؟`)) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) { showToast("تم الحذف", "success"); fetchProducts(); }
    else showToast("فشل الحذف", "error");
  };

  const adjustStock = async (id: string, delta: number) => {
    setSaving(id);
    try {
      const res = await fetch(`/api/products/${id}/stock`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta }),
      });
      if (!res.ok) throw new Error("fail");
      await fetchProducts();
      showToast("تم التحديث", "success");
    } catch {
      showToast("فشل التحديث", "error");
    } finally {
      setSaving(null);
    }
  };

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
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h1 className="mb-1 text-2xl font-black text-gray-900">منتجاتي</h1>
            <p className="text-sm text-gray-500">{products.length} منتج في متجرك</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="/api/export/my-products"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:border-[#2e8b73]/40 hover:text-[#2e8b73]">
              <Download size={14} /> CSV
            </a>
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 rounded-full bg-[#2e8b73] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#2e8b73]/20 hover:bg-[#1e6b57] active:scale-95">
              <Plus size={14} /> إضافة
            </button>
          </div>
        </div>

        <div className="mb-5 flex gap-2">
          <button onClick={() => setTab("products")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
              tab === "products" ? "bg-[#2e8b73] text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"
            }`}>
            <Package size={14} /> المنتجات ({products.length})
          </button>
          <button onClick={() => setTab("inventory")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
              tab === "inventory" ? "bg-[#2e8b73] text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"
            }`}>
            <Boxes size={14} /> المخزون
          </button>
        </div>

        {tab === "products" ? (
          <ProductsView products={products} onDelete={handleDelete} onAdd={() => setShowForm(true)} />
        ) : (
          <InventoryView products={products} onAdjust={adjustStock} saving={saving} />
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

function ProductsView({ products, onDelete, onAdd }: any) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f0]">
          <Package className="h-7 w-7 text-[#2e8b73]" />
        </div>
        <p className="text-sm font-bold text-gray-800">لا توجد منتجات بعد</p>
        <button onClick={onAdd}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2e8b73] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#2e8b73]/20 hover:bg-[#1e6b57] active:scale-95">
          <Plus size={16} /> أضف منتجك الأول
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((p: Product) => {
        const stock = Number(p.stock_quantity ?? 0);
        const stockInfo =
          stock === 0
            ? { label: "نفد", cls: "bg-red-50 text-red-700" }
            : stock < 10
            ? { label: `منخفض (${stock})`, cls: "bg-amber-50 text-amber-700" }
            : { label: `${stock} متوفر`, cls: "bg-[#e8f4f0] text-[#1e6b57]" };
        const price = Number(p.price ?? 0);

        return (
          <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 hover:border-[#2e8b73]/30">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
              {p.image_url ? (
                <Image src={p.image_url} alt={p.name} fill sizes="64px" className="object-cover" />
              ) : (
                <Package className="h-6 w-6 text-gray-300" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-gray-900">{p.name}</p>
              <p className="mt-0.5 text-base font-black text-[#2e8b73]">{formatCurrency(price)}</p>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${stockInfo.cls}`}>
                {stockInfo.label}
              </span>
            </div>

            <div className="flex flex-shrink-0 gap-1">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 text-gray-500 hover:border-[#2e8b73]/30 hover:text-[#2e8b73]">
                <Pencil size={14} />
              </button>
              <button onClick={() => onDelete(p.id, p.name)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InventoryView({ products, onAdjust, saving }: any) {
  const totalItems = products.length;
  const lowStock = products.filter((p: Product) => Number(p.stock_quantity) < 10 && Number(p.stock_quantity) > 0).length;
  const outOfStock = products.filter((p: Product) => Number(p.stock_quantity) === 0).length;

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
        <Package className="mx-auto mb-4 h-10 w-10 text-gray-300" />
        <p className="text-sm text-gray-500">لا توجد منتجات بعد</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-3 text-center">
          <p className="mb-1 text-[10px] text-gray-500">إجمالي</p>
          <p className="text-xl font-black text-gray-900">{totalItems}</p>
        </div>
        <div className={`rounded-2xl border bg-white p-3 text-center ${lowStock > 0 ? "border-amber-200" : "border-gray-100"}`}>
          <p className="mb-1 text-[10px] text-gray-500">منخفضة</p>
          <p className={`text-xl font-black ${lowStock > 0 ? "text-amber-600" : "text-gray-900"}`}>{lowStock}</p>
        </div>
        <div className={`rounded-2xl border bg-white p-3 text-center ${outOfStock > 0 ? "border-red-200" : "border-gray-100"}`}>
          <p className="mb-1 text-[10px] text-gray-500">نفد</p>
          <p className={`text-xl font-black ${outOfStock > 0 ? "text-red-600" : "text-gray-900"}`}>{outOfStock}</p>
        </div>
      </div>

      <div className="space-y-3">
        {products.map((p: Product) => {
          const stock = Number(p.stock_quantity ?? 0);
          const stockInfo =
            stock === 0
              ? { label: "نفد", cls: "bg-red-50 text-red-700", icon: <TrendingDown size={12} /> }
              : stock < 10
              ? { label: "منخفض", cls: "bg-amber-50 text-amber-700", icon: <TrendingDown size={12} /> }
              : { label: "متوفر", cls: "bg-[#e8f4f0] text-[#1e6b57]", icon: <TrendingUp size={12} /> };
          const busy = saving === p.id;

          return (
            <div key={p.id} className="rounded-2xl border border-gray-100 bg-white p-4 hover:border-[#2e8b73]/30">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-gray-900">{p.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${stockInfo.cls}`}>
                      {stockInfo.icon} {stockInfo.label}
                    </span>
                    <span className="text-xs text-gray-500">{stock} {p.unit || "قطعة"}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => onAdjust(p.id, -10)} disabled={busy || stock < 10}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 py-2 text-xs font-bold text-gray-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-30">
                  <Minus size={12} /> 10
                </button>
                <button onClick={() => onAdjust(p.id, -1)} disabled={busy || stock < 1}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 py-2 text-xs font-bold text-gray-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-30">
                  <Minus size={12} /> 1
                </button>
                <button onClick={() => onAdjust(p.id, 1)} disabled={busy}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#2e8b73] py-2 text-xs font-bold text-white hover:bg-[#1e6b57] disabled:opacity-50">
                  <Plus size={12} /> 1
                </button>
                <button onClick={() => onAdjust(p.id, 10)} disabled={busy}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#2e8b73] py-2 text-xs font-bold text-white hover:bg-[#1e6b57] disabled:opacity-50">
                  <Plus size={12} /> 10
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

