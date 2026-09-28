"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { useCartStore } from "@/lib/stores/cartStore";
import { formatCurrency } from "@/lib/utils/currency";
import {
  ArrowRight, Plus, Minus, ShoppingCart, Store, Package, Phone,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock?: number;
  image?: string;
  images?: string[];
}

interface Supplier {
  id: string;
  full_name: string;
  phone?: string;
}

export default function SupplierCatalogPage({
  params,
}: {
  params: Promise<{ supplierId: string }>;
}) {
  const { supplierId } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const { showToast } = useToast();
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    Promise.all([
      fetch(`/api/products?supplier_id=${supplierId}`).then((r) => r.json()),
      fetch("/api/users?role=supplier").then((r) => r.json()),
    ])
      .then(([prodRes, usersRes]) => {
        const list = Array.isArray(prodRes) ? prodRes : (prodRes.products || []);
        setProducts(list);
        const arr = Array.isArray(usersRes) ? usersRes : [];
        const found = arr.find((u: any) => u.id === supplierId);
        setSupplier(found || null);
      })
      .catch(() => showToast("فشل تحميل المنتجات", "error"))
      .finally(() => setLoading(false));
  }, [supplierId, showToast]);

  const getQty = (id: string) => quantities[id] || 0;

  const setQty = (id: string, q: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, q) }));
  };

  const handleAdd = (p: Product) => {
    const qty = getQty(p.id);
    if (qty <= 0) {
      showToast("أضف كمية أولاً", "error");
      return;
    }
    if (p.stock !== undefined && qty > p.stock) {
      showToast(`المتوفر ${p.stock} فقط`, "error");
      return;
    }
    addItem({
      productId: p.id,
      wholesalerId: supplierId,
      name: p.name,
      price: p.price,
      quantity: qty,
      image: p.image || (p.images && p.images[0]),
    });
    showToast(`تمت إضافة ${qty} × ${p.name}`, "success");
    setQty(p.id, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-32">
      <Topbar />

      <div className="mx-auto max-w-4xl px-4 py-5">
        {/* ═════ رأس الصفحة ═════ */}
        <div className="mb-5 flex items-center gap-3">
          <Link
            href="/retailer/shop"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 transition-colors hover:border-[#2e8b73]/30 hover:text-[#2e8b73]"
            aria-label="رجوع"
          >
            <ArrowRight size={18} />
          </Link>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-black text-gray-900">
              {supplier?.full_name || "تاجر جملة"}
            </h1>
            {supplier?.phone && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                <Phone size={11} />
                <span dir="ltr">{supplier.phone}</span>
              </p>
            )}
          </div>

          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#e8f4f0] text-[#2e8b73]">
            <Store size={18} />
          </div>
        </div>

        {/* ═════ المحتوى ═════ */}
        {loading ? (
          <div className="py-16">
            <LoadingSpinner />
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f4f0]">
              <Package className="h-7 w-7 text-[#2e8b73]" />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              لا توجد منتجات حالياً
            </p>
            <p className="mt-1 text-xs text-gray-500">
              هذا التاجر لم يُضف منتجات بعد
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => {
              const qty = getQty(p.id);
              const outOfStock = p.stock !== undefined && p.stock <= 0;

              return (
                <div
                  key={p.id}
                  className="flex flex-col rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-[#2e8b73]/30 hover:shadow-md hover:shadow-[#2e8b73]/5"
                >
                  {/* صورة/أيقونة */}
                  <div className="mb-3 flex h-24 items-center justify-center rounded-xl bg-gray-50">
                    {p.image || p.images?.[0] ? (
                      <img
                        src={p.image || p.images?.[0]}
                        alt={p.name}
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      <Package className="h-10 w-10 text-gray-300" />
                    )}
                  </div>

                  {/* اسم وسعر */}
                  <h3 className="mb-1 line-clamp-1 text-sm font-bold text-gray-900">
                    {p.name}
                  </h3>
                  <p className="mb-3 text-base font-black text-[#2e8b73]">
                    {formatCurrency(p.price)}
                  </p>

                  {/* المخزون */}
                  {p.stock !== undefined && (
                    <p
                      className={`mb-3 text-[11px] ${
                        outOfStock ? "text-red-500" : "text-gray-400"
                      }`}
                    >
                      {outOfStock ? "نفد المخزون" : `المتوفر: ${p.stock}`}
                    </p>
                  )}

                  {/* عناصر التحكم */}
                  <div className="mt-auto space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setQty(p.id, qty - 1)}
                        disabled={qty <= 0 || outOfStock}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-[#2e8b73]/40 hover:text-[#2e8b73] disabled:opacity-40"
                        aria-label="تقليل"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="min-w-8 text-center text-base font-black text-gray-900">
                        {qty}
                      </span>

                      <button
                        type="button"
                        onClick={() => setQty(p.id, qty + 1)}
                        disabled={outOfStock}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2e8b73]/30 bg-[#e8f4f0] text-[#2e8b73] transition-colors hover:bg-[#2e8b73] hover:text-white disabled:opacity-40"
                        aria-label="زيادة"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdd(p)}
                      disabled={outOfStock || qty === 0}
                      className="w-full rounded-lg bg-[#2e8b73] py-2.5 text-xs font-bold text-white transition-all hover:bg-[#1e6b57] active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                    >
                      {outOfStock ? "غير متوفر" : "أضف للسلة"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ═════ شريط السلة العائم ═════ */}
      {cartCount > 0 && (
        <Link
          href="/retailer/cart"
          className="fixed bottom-20 left-4 right-4 z-30 flex items-center justify-between gap-3 rounded-2xl bg-[#2e8b73] px-5 py-3.5 text-white shadow-xl shadow-[#2e8b73]/30 transition-all hover:bg-[#1e6b57] active:scale-[0.98] md:bottom-6 md:left-auto md:right-6 md:w-80"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <ShoppingCart size={18} />
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-black text-[#1e6b57]">
                {cartCount}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-black">{formatCurrency(cartTotal)}</div>
              <div className="text-[11px] text-white/80">{cartCount} منتج</div>
            </div>
          </div>
          <span className="text-sm font-bold">عرض السلة ←</span>
        </Link>
      )}
    </div>
  );
}
