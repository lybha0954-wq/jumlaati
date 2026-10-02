"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { Heart, Package, ArrowLeft } from "lucide-react";

export default function RetailerFavoritesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const remove = async (id: string) => {
    setRemoving(id);
    try {
      const res = await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("تم الحذف من المفضلة", "success");
        fetchWishlist();
      } else {
        showToast("فشل الحذف", "error");
      }
    } catch {
      showToast("خطأ في الاتصال", "error");
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-24 dark:bg-gray-950">
        <Topbar />
        <div className="flex items-center justify-center py-32">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 dark:bg-gray-950">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 flex items-center gap-2 text-2xl font-black text-gray-900 dark:text-gray-100">
            <Heart size={22} className="text-rose-500" /> المفضلة
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {items.length} منتج محفوظ
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/40">
              <Heart className="h-8 w-8 text-rose-400" />
            </div>
            <p className="text-base font-bold text-gray-800 dark:text-gray-200">
              لا توجد منتجات مفضلة
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              عند حفظ منتجات، ستظهر هنا
            </p>
            <Link
              href="/retailer/shop"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#2e8b73] px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#1e6b57]"
            >
              تصفّح المنتجات <ArrowLeft size={12} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item: any) => {
              const p = item.products || item.product || {};
              const price = Number(p.price || 0);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-gray-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">
                      {p.name || "منتج"}
                    </p>
                    <p className="mt-0.5 text-base font-black text-[#2e8b73] dark:text-[#6ecdb0]">
                      {price.toLocaleString()} د.ع
                    </p>
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    disabled={removing === item.id}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-gray-100 text-rose-400 transition-colors hover:border-rose-200 hover:bg-rose-50 disabled:opacity-50 dark:border-gray-800 dark:hover:bg-rose-950/30"
                    aria-label="إزالة"
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
