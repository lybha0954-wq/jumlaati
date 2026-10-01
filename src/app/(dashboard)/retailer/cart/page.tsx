"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { useToast } from "@/hooks/useToast";
import { useCartStore } from "@/lib/stores/cartStore";
import { formatCurrency } from "@/lib/utils/currency";
import {
  ShoppingCart, Plus, Minus, Trash2, MapPin,
  ArrowRight, Package, CheckCircle2, Ticket, X, Wallet,
} from "lucide-react";

export default function RetailerCartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotal, clearCart, getGroupedItems } =
    useCartStore();
  const { showToast } = useToast();

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<any>(null);
  const [couponBusy, setCouponBusy] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // ═══ النموذج المالي ═══
  const DELIVERY_FEE = 3000;

  // جلب طرق الدفع
  useEffect(() => {
    fetch("/api/payment-methods")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => {
        const arr = Array.isArray(d) ? d : [];
        setPaymentMethods(arr);
        // اختيار أول طريقة مفعّلة
        const firstEnabled = arr.find((m: any) => m.enabled);
        if (firstEnabled) setPaymentMethod(firstEnabled.key);
      })
      .catch(() => setPaymentMethods([]));
  }, []);

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
          supplier_id: supplierId,
          items: supplierItems.map((i) => ({
            product_id: Number(i.productId),
            quantity: i.quantity,
          })),
          delivery_address: address.trim(),
          buyer_name: "سوبرماركت",
          coupon_code: coupon?.code || null,
          discount: discount,
          payment_method: paymentMethod,
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

  const applyCoupon = async () => {
    setCouponError("");
    setCoupon(null);
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("أدخل كود الكوبون");
      return;
    }
    setCouponBusy(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const d = await res.json();
      if (!res.ok || !d.valid) {
        throw new Error(d.error || "كود غير صالح");
      }
      setCoupon(d.coupon);
      showToast("✅ تم تطبيق الكوبون", "success");
    } catch (e: any) {
      setCouponError(e?.message || "كود غير صالح");
    } finally {
      setCouponBusy(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  // حساب الخصم
  const discount = (() => {
    if (!coupon) return 0;
    const minOrder = Number(coupon.min_order || 0);
    if (minOrder > 0 && total < minOrder) return 0;
    if (coupon.discount_type === "percent") {
      return Math.round(total * (Number(coupon.discount_value) / 100));
    }
    return Math.min(Number(coupon.discount_value || 0), total);
  })();

  const finalTotal = Math.max(0, total + DELIVERY_FEE - discount);

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

        {/* طرق الدفع */}
        {paymentMethods.length > 0 && (
          <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-4">
            <label className="mb-3 flex items-center gap-2 text-xs font-bold text-gray-700">
              <Wallet size={14} className="text-[#2e8b73]" />
              طريقة الدفع
            </label>
            <div className="space-y-2">
              {paymentMethods.map((pm) => (
                <button
                  key={pm.key}
                  onClick={() => pm.enabled && setPaymentMethod(pm.key)}
                  disabled={!pm.enabled}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border-2 p-3 text-right transition-all ${
                    paymentMethod === pm.key && pm.enabled
                      ? "border-[#2e8b73] bg-[#e8f4f0]"
                      : pm.enabled
                      ? "border-gray-100 bg-white hover:border-[#2e8b73]/30"
                      : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl flex-shrink-0">{pm.icon || "💳"}</span>
                    <div className="min-w-0">
                      <p className={`text-sm font-bold ${pm.enabled ? "text-gray-900" : "text-gray-500"}`}>
                        {pm.label}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">
                        {pm.description || ""}
                      </p>
                    </div>
                  </div>
                  {pm.enabled ? (
                    paymentMethod === pm.key ? (
                      <CheckCircle2 size={18} className="flex-shrink-0 text-[#2e8b73]" />
                    ) : (
                      <div className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-gray-300" />
                    )
                  ) : (
                    <span className="flex-shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-[9px] font-bold text-gray-500">
                      قريباً
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* الكوبون */}
        <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-4">
          <label className="mb-2 flex items-center gap-2 text-xs font-bold text-gray-700">
            <Ticket size={14} className="text-amber-500" />
            كود الخصم
          </label>

          {coupon ? (
            <div className="flex items-center justify-between gap-2 rounded-xl border border-[#2e8b73]/30 bg-[#e8f4f0] p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#2e8b73]" />
                <span className="font-mono text-sm font-black text-[#1e6b57]">{coupon.code}</span>
                <span className="text-xs text-[#1e6b57]">
                  {coupon.discount_type === "percent"
                    ? `-${coupon.discount_value}%`
                    : `-${formatCurrency(coupon.discount_value)}`}
                </span>
              </div>
              <button onClick={removeCoupon}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[#1e6b57] hover:bg-white/60">
                <X size={14} />
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="أدخل الكود"
                  dir="ltr"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 font-mono text-sm uppercase outline-none focus:border-[#2e8b73] focus:bg-white"
                />
                <button
                  onClick={applyCoupon}
                  disabled={couponBusy || !couponCode.trim()}
                  className="flex-shrink-0 rounded-xl bg-amber-500 px-4 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-50"
                >
                  {couponBusy ? "..." : "تطبيق"}
                </button>
              </div>
              {couponError && (
                <p className="mt-2 text-xs font-bold text-red-600">{couponError}</p>
              )}
            </>
          )}
        </div>

        {/* الملخص */}
        <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-4">
          <div className="flex items-center justify-between py-1.5 text-sm">
            <span className="text-gray-500">عدد المنتجات</span>
            <span className="font-bold text-gray-900">{itemsCount}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 text-sm">
            <span className="text-gray-500">التوصيل</span>
            <span className="font-bold text-gray-700">{formatCurrency(DELIVERY_FEE)}</span>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between py-1.5 text-sm">
              <span className="text-amber-600">الخصم</span>
              <span className="font-bold text-amber-600">- {formatCurrency(discount)}</span>
            </div>
          )}
          <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-sm font-bold text-gray-700">الإجمالي</span>
            <span className="text-lg font-black text-[#2e8b73]">
              {formatCurrency(finalTotal)}
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
              {formatCurrency(finalTotal)}
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
