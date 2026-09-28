"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { useToast } from "@/hooks/useToast";
import { useCartStore } from "@/lib/stores/cartStore";
import { formatCurrency } from "@/lib/utils/currency";
import {
  ShoppingCart, Plus, Minus, Trash2, MapPin,
  ArrowRight, Package, CheckCircle2,
} from "lucide-react";

export default function RetailerCartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotal, clearCart, getGroupedItems } =
    useCartStore();
  const { showToast } = useToast();

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = getTotal();
  const grouped = getGroupedItems();
  const supplierIds = Object.keys(grouped);
  const itemsCount = items.reduce((s, i) => s + i.quantity, 0);

  const handleCheckout = async () => {
    setError("");

    // التحقق
    if (items.length === 0) {
      setError("السلة فارغة");
      return;
    }
    if (supplierIds.length > 1) {
      setError("لا يمكن الطلب من عدة تجار في نفس الوقت — احذف منتجات أحدهم");
      return;
    }
    if (!address.trim()) {
      setError("أدخل عنوان التوصيل");
      return;
    }

    setLoading(true);
    try {
      const supplierId = supplierIds[0];
      const supplierItems = grouped[supplierId];

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: supplierItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            wholesalerId: supplierId,
            price: i.price,
          })),
          address: address.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل إنشاء الطلب");

      clearCart();
      showToast("تم إنشاء الطلب بنجاح ✅", "success");
      router.push("/retailer/orders");
    } catch (err: any) {
      setError(err?.message || "خطأ غير معروف");
      showToast("فشل إنشاء الطلب", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ═══════════ حالة فارغة ═══════════ */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-24">
        <Topbar />
        <div className="mx-auto max-w-2xl px-4 py-6">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/retailer/shop"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 transition-colors hover:border-[#2e8b73]/30 hover:text-[#2e8b73]"
              aria-label="رجوع"
            >
              <ArrowRight size={18} />
            </Link>
            <h1 className="text-lg font-black text-gray-900">السلة</h1>
          </div>

          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f4f0]">
              <ShoppingCart className="h-8 w-8 text-[#2e8b73]" />
            </div>
            <p className="text-base font-bold text-gray-800">السلة فارغة</p>
            <p className="mt-1 text-sm text-gray-500">
              ابدأ بتصفّح تجار الجملة وأضف منتجاتك
            </p>
            <Link
              href="/retailer/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2e8b73] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#2e8b73]/20 transition-all hover:bg-[#1e6b57] active:scale-95"
            >
              تصفّح التجار
              <ArrowRight size={16} className="rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════ السلة مع المنتجات ═══════════ */
  return (
    <div className="min-h-screen bg-gray-50/50 pb-32">
      <Topbar />

      <div className="mx-auto max-w-2xl px-4 py-5">
        {/* رأس */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/retailer/shop"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 transition-colors hover:border-[#2e8b73]/30 hover:text-[#2e8b73]"
              aria-label="رجوع"
            >
              <ArrowRight size={18} />
            </Link>
            <div>
              <h1 className="text-lg font-black text-gray-900">السلة</h1>
              <p className="text-xs text-gray-500">
                {itemsCount} منتج من {supplierIds.length} تاجر
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (confirm("حذف كل المنتجات من السلة؟")) {
                clearCart();
                showToast("تم إخلاء السلة", "info");
              }
            }}
            className="text-xs font-semibold text-red-500 transition-colors hover:text-red-700"
          >
            إفراغ السلة
          </button>
        </div>

        {/* تحذير: عدة تجار */}
        {supplierIds.length > 1 && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-bold text-amber-800">
              ⚠️ لديك منتجات من {supplierIds.length} تجار — لا يمكن إتمام الطلب.
            </p>
            <p className="mt-1 text-[11px] text-amber-700">
              أتمّ الطلب من تاجر واحد، ثم ابدأ طلباً جديداً من الآخر.
            </p>
          </div>
        )}

        {/* قائمة المنتجات */}
        <div className="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <ul className="divide-y divide-gray-50">
            {items.map((item) => (
              <li key={`${item.wholesalerId}-${item.productId}`} className="p-4">
                <div className="flex gap-3">
                  {/* صورة/أيقونة */}
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-7 w-7 text-gray-300" />
                    )}
                  </div>

                  {/* التفاصيل */}
                  <div className="flex flex-1 flex-col">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-900">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {formatCurrency(item.price)} للوحدة
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        aria-label="حذف"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-2">
                      {/* عدّاد */}
                      <div className="flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50/50 p-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-gray-600 transition-colors hover:text-[#2e8b73]"
                          aria-label="تقليل"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="min-w-8 text-center text-sm font-black text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2e8b73] text-white transition-colors hover:bg-[#1e6b57]"
                          aria-label="زيادة"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* الإجمالي */}
                      <p className="text-base font-black text-[#2e8b73]">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* العنوان */}
        <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-4">
          <label className="mb-2 flex items-center gap-2 text-xs font-bold text-gray-700">
            <MapPin size={14} className="text-[#2e8b73]" />
            عنوان التوصيل
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="مثال: كربلاء — حي الحسين — شارع الجمهورية — محل رقم 12"
            rows={3}
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 transition-all focus:border-[#2e8b73] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2e8b73]/20"
          />
        </div>

        {/* رسالة خطأ */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-xs font-bold text-red-700">{error}</p>
          </div>
        )}

        {/* الملخص */}
        <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-4">
          <div className="flex items-center justify-between py-1.5 text-sm">
            <span className="text-gray-500">عدد المنتجات</span>
            <span className="font-bold text-gray-900">{itemsCount}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 text-sm">
            <span className="text-gray-500">التوصيل</span>
            <span className="text-xs text-gray-400">يُحدد عند القبول</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-sm font-bold text-gray-700">الإجمالي</span>
            <span className="text-lg font-black text-[#2e8b73]">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      {/* زر الإتمام العائم */}
      <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-gray-100 bg-white/95 px-4 py-3 backdrop-blur-md md:bottom-0">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="flex-1">
            <div className="text-[10px] text-gray-500">الإجمالي</div>
            <div className="text-base font-black text-[#2e8b73]">
              {formatCurrency(total)}
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading || supplierIds.length > 1}
            className="flex items-center gap-2 rounded-full bg-[#2e8b73] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#2e8b73]/25 transition-all hover:bg-[#1e6b57] active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                جارٍ الإرسال
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                إتمام الطلب
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
