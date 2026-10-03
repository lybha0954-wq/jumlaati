"use client";

import { use, useEffect, useState, useMemo, useCallback } from "react";
import { FilterChip } from "@/components/shared/FilterChip";
import Image from "next/image";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { useCartStore } from "@/lib/stores/cartStore";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { formatCurrency } from "@/lib/utils/currency";
import {
  ArrowRight, Plus, Minus, ShoppingCart, Store, Package, Phone,
  Search, AlertTriangle, CheckCircle2, Heart,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;

  stock_quantity?: number;
  image_url?: string;

  category?: string;
}

interface Supplier {
  id: string;
  full_name?: string;
  name?: string;
  phone?: string;
}

type FilterKey = "all" | "available" | "out";

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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const { showToast } = useToast();
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const wishlistEnabled = useFeatureFlag("wishlist");
  const [wishlistIds, setWishlistIds] = useState<Record<string, string>>({}); // productId -> wishlistId

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

  // تحميل المفضلة
  const reloadWishlist = useCallback(async () => {
    if (!wishlistEnabled) return;
    try {
      const res = await fetch("/api/wishlist");
      if (!res.ok) return;
      const data = await res.json();
      const map: Record<string, string> = {};
      (Array.isArray(data) ? data : []).forEach((w: any) => {
        const pid = w.product_id || w.products?.id || w.product?.id;
        if (pid) map[String(pid)] = String(w.id);
      });
      setWishlistIds(map);
    } catch (err) {
      console.warn("[shop] fetch failed:", err);
    }
  }, [wishlistEnabled]);

  useEffect(() => { reloadWishlist(); }, [reloadWishlist]);

  const toggleWishlist = async (productId: string) => {
    const existing = wishlistIds[productId];
    try {
      if (existing) {
        const res = await fetch(`/api/wishlist/${existing}`, { method: "DELETE" });
        if (res.ok) {
          setWishlistIds((prev) => {
            const next = { ...prev };
            delete next[productId];
            return next;
          });
          showToast("أُزيل من المفضلة", "success");
        } else {
          showToast("فشل الحذف", "error");
        }
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (res.ok) {
          const w = await res.json();
          setWishlistIds((prev) => ({ ...prev, [productId]: String(w.id) }));
          showToast("أُضيف للمفضلة ❤️", "success");
        } else {
          showToast("فشل الإضافة", "error");
        }
      }
    } catch {
      showToast("خطأ في الاتصال", "error");
    }
  };

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
    const stock = Number(p.stock_quantity ?? 999);
    if (qty > stock) {
      showToast(`المتوفر ${stock} فقط`, "error");
      return;
    }
    const price = Number(p.price ?? 0);
    addItem({
      productId: p.id,
      wholesalerId: supplierId,
      name: p.name,
      price,
      quantity: qty,
      image: p.image_url || undefined,
    });
    showToast(`تمت إضافة ${qty} × ${p.name}`, "success");
    setQty(p.id, 0);
  };

  const isOutOfStock = (p: Product) => {
    const stock = Number(p.stock_quantity ?? 1);
    return stock <= 0;
  };

  /* ═════ الفلترة والترتيب ═════ */
  const filtered = useMemo(() => {
    let list = products;

    if (filter === "available") {
      list = list.filter((p) => !isOutOfStock(p));
    } else if (filter === "out") {
      list = list.filter((p) => isOutOfStock(p));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    // ترتيب: المتوفر أولاً، ثم الاسم
    return list.sort((a, b) => {
      const ao = isOutOfStock(a) ? 1 : 0;
      const bo = isOutOfStock(b) ? 1 : 0;
      if (ao !== bo) return ao - bo;
      return a.name.localeCompare(b.name, "ar");
    });
  }, [products, filter, search]);

  const outCount = products.filter(isOutOfStock).length;
  const availableCount = products.length - outCount;

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
              {supplier?.full_name || supplier?.name || "تاجر جملة"}
            </h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
              {products.length > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Package size={11} />
                  {products.length} منتج
                </span>
              )}
              {availableCount > 0 && (
                <span className="inline-flex items-center gap-1 text-[#1e6b57]">
                  <CheckCircle2 size={11} />
                  {availableCount} متوفر
                </span>
              )}
              {outCount > 0 && (
                <span className="inline-flex items-center gap-1 text-red-500">
                  <AlertTriangle size={11} />
                  {outCount} نفد
                </span>
              )}
            </div>
          </div>

          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#e8f4f0] text-[#2e8b73]">
            <Store size={18} />
          </div>
        </div>

        {/* ═════ البحث ═════ */}
        {products.length > 0 && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm focus-within:border-[#2e8b73]/40">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في منتجات هذا التاجر..."
              className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
            />
          </div>
        )}

        {/* ═════ الفلاتر ═════ */}
        {products.length > 0 && (outCount > 0 || availableCount > 0) && (
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
            <FilterChip
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label="الكل"
              count={products.length}
            />
            <FilterChip
              active={filter === "available"}
              onClick={() => setFilter("available")}
              label="متوفر"
              count={availableCount}
              color="emerald"
            />
            {outCount > 0 && (
              <FilterChip
                active={filter === "out"}
                onClick={() => setFilter("out")}
                label="نفد"
                count={outCount}
                color="red"
              />
            )}
          </div>
        )}

        {/* ═════ المحتوى ═════ */}
        {loading ? (
          <div className="py-16"><LoadingSpinner /></div>
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
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <Search className="mx-auto mb-3 h-8 w-8 text-gray-300" />
            <p className="text-sm font-semibold text-gray-700">لا نتائج مطابقة</p>
            <p className="mt-1 text-xs text-gray-500">جرّب كلمة أخرى</p>
            {(search || filter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#2e8b73] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#1e6b57] active:scale-95"
              >
                عرض الكل
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => {
              const qty = getQty(p.id);
              const outOfStock = isOutOfStock(p);
              const stock = Number(p.stock_quantity ?? 0);
              const price = Number(p.price ?? 0);

              return (
                <div
                  key={p.id}
                  className={`flex flex-col rounded-2xl border bg-white p-3 transition-all ${
                    outOfStock
                      ? "border-gray-100 opacity-60"
                      : "border-gray-100 hover:border-[#2e8b73]/30 hover:shadow-md hover:shadow-[#2e8b73]/5"
                  }`}
                >
                  {/* صورة */}
                  <div className="relative mb-3 flex h-24 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <Package className="h-10 w-10 text-gray-300" />
                    )}
                    {outOfStock && (
                      <span className="absolute top-2 right-2 rounded-full bg-red-500 px-2 py-0.5 text-[9px] font-black text-white">
                        نفد
                      </span>
                    )}
                    {wishlistEnabled && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(p.id);
                        }}
                        aria-label="المفضلة"
                        className={`absolute top-2 left-2 flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-all ${
                          wishlistIds[p.id]
                            ? "bg-rose-500 text-white"
                            : "bg-white/90 text-gray-400 hover:text-rose-500"
                        }`}
                      >
                        <Heart
                          size={13}
                          fill={wishlistIds[p.id] ? "currentColor" : "none"}
                        />
                      </button>
                    )}
                  </div>

                  {/* الاسم */}
                  <h3 className="mb-1 line-clamp-2 min-h-[2.5rem] text-xs font-bold text-gray-900">
                    {p.name}
                  </h3>

                  {/* السعر */}
                  <p className="mb-2 text-base font-black text-[#2e8b73]">
                    {formatCurrency(price)}
                  </p>

                  {/* المخزون */}
                  {p.stock_quantity !== undefined && (
                    <p
                      className={`mb-2 text-[10px] ${
                        outOfStock
                          ? "font-bold text-red-500"
                          : stock < 10
                          ? "text-amber-600"
                          : "text-gray-400"
                      }`}
                    >
                      {outOfStock
                        ? "غير متوفر"
                        : stock < 10
                        ? `⚠️ آخر ${stock} قطع`
                        : `المتوفر: ${stock}`}
                    </p>
                  )}

                  {/* عناصر التحكم */}
                  <div className="mt-auto space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <button
                        type="button"
                        onClick={() => setQty(p.id, qty - 1)}
                        disabled={qty <= 0 || outOfStock}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-[#2e8b73]/40 hover:text-[#2e8b73] disabled:opacity-40"
                        aria-label="تقليل"
                      >
                        <Minus size={12} />
                      </button>

                      <span className="min-w-6 text-center text-sm font-black text-gray-900">
                        {qty}
                      </span>

                      <button
                        type="button"
                        onClick={() => setQty(p.id, qty + 1)}
                        disabled={outOfStock || qty >= stock}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2e8b73]/30 bg-[#e8f4f0] text-[#2e8b73] transition-colors hover:bg-[#2e8b73] hover:text-white disabled:opacity-40"
                        aria-label="زيادة"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdd(p)}
                      disabled={outOfStock || qty === 0}
                      className="w-full rounded-lg bg-[#2e8b73] py-2 text-[11px] font-bold text-white transition-all hover:bg-[#1e6b57] active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
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
        <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-gray-100 bg-white/95 px-4 py-3 backdrop-blur-md md:bottom-0">
          <div className="mx-auto flex max-w-4xl items-center gap-3">
            <div className="flex-1">
              <div className="text-[10px] text-gray-500">في السلة</div>
              <div className="text-base font-black text-[#2e8b73]">
                {formatCurrency(cartTotal)}
              </div>
            </div>
            <Link
              href="/retailer/shop"
              className="hidden rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 transition-all hover:border-[#2e8b73]/40 hover:text-[#1e6b57] sm:inline-flex"
            >
              متابعة التسوق
            </Link>
            <Link
              href="/retailer/cart"
              className="flex items-center gap-2 rounded-full bg-[#2e8b73] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#2e8b73]/25 transition-all hover:bg-[#1e6b57] active:scale-95"
            >
              <ShoppingCart size={16} />
              <span>عرض السلة ({cartCount})</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═════════════════════ مكونات فرعية ═════════════════════ */

