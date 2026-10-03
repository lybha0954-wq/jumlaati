"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// ═══ Lazy: يُحمَّل فقط عند الحاجة ═══
const PaymentMethodsSection = dynamic(
  () => import("@/components/shared/PaymentMethodsSection"),
  {
    loading: () => (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
        ))}
      </div>
    ),
  }
);
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { useToast } from "@/hooks/useToast";
import { useCartStore } from "@/lib/stores/cartStore";
import { formatCurrency } from "@/lib/utils/currency";
import {
  ShoppingCart, Plus, Minus, Trash2, MapPin,
  ArrowRight, ArrowLeft, Package, CheckCircle2, Ticket, X, Wallet, Store,
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
  const [savedAddresses, setSavedAddresses] = useState<string[]>([]);
  const [attempted, setAttempted] = useState(false);

  const DELIVERY_FEE = 3000;

  useEffect(() => {
    fetch("/api/payment-methods")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => {
        const arr = Array.isArray(d) ? d : [];
        setPaymentMethods(arr);
        const firstEnabled = arr.find((m: any) => m.enabled);
        if (firstEnabled) setPaymentMethod(firstEnabled.key);
      })
      .catch(() => setPaymentMethods([]));
  }, []);

  // ═══ جلب العناوين المحفوظة ═══
  useEffect(() => {
    // من localStorage
    try {
      const raw = localStorage.getItem("jumlati-saved-addresses");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          setSavedAddresses(
            arr.filter((a: any) => typeof a === "string" && a.trim()).slice(0, 5)
          );
        }
      }
    } catch {}

    // من DB (العنوان الأخير)
    fetch("/api/users/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.address && typeof d.address === "string" && d.address.trim()) {
          setAddress(d.address);
          setSavedAddresses((prev) => {
            const merged = [d.address, ...prev.filter((a) => a !== d.address)];
            return merged.slice(0, 5);
          });
        }
      })
      .catch(() => {});
  }, []);

  const total = getTotal();
  const grouped = getGroupedItems();
  const supplierIds = Object.keys(grouped);
  const itemsCount = items.reduce((s, i) => s + i.quantity, 0);

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

  // ═══ حفظ العنوان (localStorage + DB) ═══
  const rememberAddress = async (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    try {
      const current: string[] = (() => {
        try {
          const r = localStorage.getItem("jumlati-saved-addresses");
          return r ? JSON.parse(r) : [];
        } catch {
          return [];
        }
      })();
      const merged = [trimmed, ...current.filter((a) => a !== trimmed)].slice(0, 5);
      localStorage.setItem("jumlati-saved-addresses", JSON.stringify(merged));
      setSavedAddresses(merged);
    } catch (err) {
      console.warn('[cart] save addresses failed:', err);
    }

    try {
      await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: trimmed }),
      });
    } catch (err) {
      console.warn('[cart] rememberAddress failed:', err);
    }
  };

  const handleCheckout = async () => {
    setError("");
    setAttempted(true);
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

      await rememberAddress(address);
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

  /* ═══════════ حالة فارغة ═══════════ */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-24 dark:bg-gray-950">
        <Topbar />
        <div className="mx-auto max-w-2xl px-4 py-6">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/retailer/shop"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 transition-colors hover:border-[#2e8b73]/30 hover:text-[#2e8b73] dark:border-gray-800 dark:bg-gray-900"
              aria-label="رجوع"
            >
              <ArrowRight size={18} />
            </Link>
            <h1 className="text-lg font-black text-gray-900 dark:text-gray-100">السلة</h1>
          </div>

          <div className="overflow-hidden rounded-2xl border border-dashed border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <div className="p-10 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#e8f4f0] dark:bg-[#1e3a33]">
                <ShoppingCart className="h-10 w-10 text-[#2e8b73]" />
              </div>
              <p className="text-lg font-black text-gray-900 dark:text-gray-100">السلة فارغة</p>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                ابدأ بتصفّح تجار الجملة وأضف منتجاتك
              </p>

              <Link
                href="/retailer/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2e8b73] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#2e8b73]/25 transition-all hover:bg-[#1e6b57] hover:shadow-xl active:scale-95"
              >
                تصفّح التجار
                <ArrowLeft size={16} />
              </Link>
            </div>

            {/* مقترحات سريعة */}
            <div className="border-t border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/60">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                ابدأ من هنا
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/retailer/shop"
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-[#2e8b73]/40 hover:bg-[#e8f4f0] dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-[#1e3a33]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f4f0] text-[#2e8b73] dark:bg-[#1e3a33]">
                    <Store size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100">التجار</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">تصفّح</p>
                  </div>
                </Link>

                <Link
                  href="/products"
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-[#2e8b73]/40 hover:bg-[#e8f4f0] dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-[#1e3a33]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f4f0] text-[#2e8b73] dark:bg-[#1e3a33]">
                    <Package size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100">المنتجات</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">عرض الكل</p>
                  </div>
                </Link>

                <Link
                  href="/retailer/orders"
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-[#2e8b73]/40 hover:bg-[#e8f4f0] dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-[#1e3a33]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f4f0] text-[#2e8b73] dark:bg-[#1e3a33]">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100">طلباتي</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">تتبّع</p>
                  </div>
                </Link>

                <Link
                  href="/retailer/invoices"
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-[#2e8b73]/40 hover:bg-[#e8f4f0] dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-[#1e3a33]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f4f0] text-[#2e8b73] dark:bg-[#1e3a33]">
                    <Ticket size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100">الفواتير</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">تصفّح</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══ طرق الدفع المفعلة فقط ═══
  const enabledMethods = paymentMethods.filter((pm) => pm.enabled);

  /* ═══════════ السلة مع المنتجات ═══════════ */
  return (
    <div className="min-h-screen bg-gray-50/50 pb-40 dark:bg-gray-950">
      <Topbar />

      <div className="mx-auto max-w-2xl px-4 py-5">
        {/* ═══ الرأس + شريط التقدم ═══ */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/retailer/shop"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 transition-colors hover:border-[#2e8b73]/30 hover:text-[#2e8b73] dark:border-gray-800 dark:bg-gray-900"
              aria-label="رجوع"
            >
              <ArrowRight size={18} />
            </Link>
            <div>
              <h1 className="text-lg font-black text-gray-900 dark:text-gray-100">السلة</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
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
            className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-bold text-red-600 transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
          >
            <Trash2 size={10} className="ml-1 inline" />
            إفراغ
          </button>
        </div>

        {/* ═══ شريط التقدم (3 خطوات) ═══ */}
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
          <StepChip num={1} label="السلة" active done />
          <div className="h-0.5 flex-1 rounded-full bg-[#2e8b73]" />
          <StepChip num={2} label="العنوان" active={!address.trim()} done={!!address.trim()} />
          <div className={`h-0.5 flex-1 rounded-full ${address.trim() ? "bg-[#2e8b73]" : "bg-gray-200 dark:bg-gray-700"}`} />
          <StepChip num={3} label="الإتمام" active={!!address.trim()} />
        </div>

        {/* ═══ تحذير: عدة تجار ═══ */}
        {supplierIds.length > 1 && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/60 dark:bg-amber-950/30">
            <span className="text-base">⚠️</span>
            <div>
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                لديك منتجات من {supplierIds.length} تجار — لا يمكن إتمام الطلب.
              </p>
              <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-400/80">
                أتمّ الطلب من تاجر واحد، ثم ابدأ طلباً جديداً من الآخر.
              </p>
            </div>
          </div>
        )}

        {/* ═══ 1) قائمة المنتجات ═══ */}
        <SectionLabel num={1} label="منتجاتك" count={itemsCount} />

        <div className="mb-5 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((item) => (
              <li key={`${item.wholesalerId}-${item.productId}`} className="p-4">
                <div className="flex gap-3">
                  <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-bold text-gray-900 dark:text-gray-100">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {formatCurrency(item.price)} للوحدة
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`حذف "${item.name}" من السلة؟`)) {
                            removeItem(item.productId);
                            showToast("تم الحذف من السلة", "info");
                          }
                        }}
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 active:scale-90 dark:hover:bg-red-950/30"
                        aria-label="حذف"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="mt-auto space-y-2">
                      {/* أزرار الكمية السريعة */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">
                          إضافة سريعة:
                        </span>
                        {[5, 10, 50, 100].map((add) => (
                          <button
                            key={add}
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + add)
                            }
                            className="rounded-full border border-[#2e8b73]/30 bg-[#e8f4f0] px-2 py-0.5 text-[10px] font-black text-[#1e6b57] transition-all hover:bg-[#2e8b73] hover:text-white active:scale-90 dark:bg-[#1e3a33] dark:text-[#6ecdb0] dark:hover:bg-[#2e8b73]"
                          >
                            +{add}
                          </button>
                        ))}
                      </div>

                      {/* عدّاد الكمية */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#2e8b73] active:scale-95 dark:bg-gray-700 dark:text-gray-300"
                            aria-label="تقليل"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="min-w-12 text-center text-base font-black text-gray-900 dark:text-gray-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2e8b73] text-white transition-colors hover:bg-[#1e6b57] active:scale-95"
                            aria-label="زيادة"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <p className="text-lg font-black text-[#2e8b73] dark:text-[#6ecdb0]">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ═══ 2) العنوان ═══ */}
        <SectionLabel num={2} label="عنوان التوصيل" />

        <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e8f4f0] dark:bg-[#1e3a33]">
              <MapPin size={15} className="text-[#2e8b73]" />
            </div>
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
              أين نوصّل الطلب؟
            </p>
            {savedAddresses.length > 0 && (
              <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {savedAddresses.length}/5 محفوظ
              </span>
            )}
          </div>

          {/* العناوين المحفوظة (chips) */}
          {savedAddresses.length > 0 && (
            <div className="mb-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                عناوينك المحفوظة — اضغط للاختيار
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {savedAddresses.map((addr, i) => {
                  const isSelected = address.trim() === addr.trim();
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setAddress(addr);
                        showToast("تم اختيار العنوان", "success");
                        setTimeout(() => {
                          const input = document.getElementById("cart-address-input");
                          if (input) {
                            input.scrollIntoView({ behavior: "smooth", block: "center" });
                          }
                        }, 100);
                      }}
                      className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-[11px] font-bold transition-all active:scale-95 ${
                        isSelected
                          ? "border-[#2e8b73] bg-[#e8f4f0] text-[#1e6b57] dark:bg-[#1e3a33] dark:text-[#6ecdb0]"
                          : "border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {isSelected && <CheckCircle2 size={11} />}
                      <span className="max-w-[180px] truncate">{addr}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <textarea
            id="cart-address-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="مثال: كربلاء — حي الحسين — شارع الجمهورية — محل رقم 12"
            rows={3}
            className={`w-full resize-none rounded-xl border bg-gray-50/50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 ${
              attempted && !address.trim()
                ? "border-red-500 ring-2 ring-red-500/20 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500"
                : "border-gray-200 focus:border-[#2e8b73] focus:bg-white focus:ring-[#2e8b73]/20 dark:border-gray-700 dark:focus:bg-gray-800"
            }`}
          />
          {attempted && !address.trim() && (
            <p className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-red-600 dark:text-red-400">
              <X size={12} />
              هذا الحقل مطلوب — أدخل عنوان التوصيل
            </p>
          )}

          {/* زر حفظ يدوي — يظهر إذا كان العنوان جديداً */}
          {address.trim() && !savedAddresses.includes(address.trim()) && (
            <button
              onClick={() => rememberAddress(address)}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#e8f4f0] px-3 py-1.5 text-[11px] font-bold text-[#1e6b57] transition-all hover:bg-[#d8ecdf] active:scale-95 dark:bg-[#1e3a33] dark:text-[#6ecdb0]"
            >
              <Plus size={11} />
              حفظ للاستخدام القادم
            </button>
          )}
        </div>

        {/* ═══ 3) الدفع ═══ */}
        <SectionLabel num={3} label="طريقة الدفع" />

        {enabledMethods.length > 0 && (
          <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <PaymentMethodsSection
              methods={enabledMethods}
              selected={paymentMethod}
              onSelect={setPaymentMethod}
            />
          </div>
        )}

        {/* ═══ الكوبون ═══ */}
        <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40">
              <Ticket size={15} className="text-amber-500" />
            </div>
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
              كود الخصم (اختياري)
            </p>
          </div>

          {coupon ? (
            <div className="flex items-center justify-between gap-2 rounded-xl border border-[#2e8b73]/30 bg-[#e8f4f0] p-3 dark:bg-[#1e3a33]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#2e8b73]" />
                <span
                  className="font-mono text-sm font-black text-[#1e6b57] dark:text-[#6ecdb0]"
                  dir="ltr"
                >
                  {coupon.code}
                </span>
                <span className="text-xs font-bold text-[#1e6b57] dark:text-[#6ecdb0]">
                  {coupon.discount_type === "percent"
                    ? `-${coupon.discount_value}%`
                    : `-${formatCurrency(coupon.discount_value)}`}
                </span>
              </div>
              <button
                onClick={removeCoupon}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[#1e6b57] transition-colors hover:bg-white/60 dark:text-[#6ecdb0]"
              >
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 font-mono text-sm uppercase outline-none transition-all focus:border-[#2e8b73] focus:bg-white focus:ring-2 focus:ring-[#2e8b73]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-800"
                />
                <button
                  onClick={applyCoupon}
                  disabled={couponBusy || !couponCode.trim()}
                  className="flex-shrink-0 rounded-xl bg-amber-500 px-4 text-xs font-bold text-white transition-all hover:bg-amber-600 active:scale-95 disabled:opacity-50"
                >
                  {couponBusy ? "..." : "تطبيق"}
                </button>
              </div>
              {couponError && (
                <p className="mt-2 text-xs font-bold text-red-600 dark:text-red-400">
                  {couponError}
                </p>
              )}
            </>
          )}
        </div>

        {/* ═══ رسالة خطأ ═══ */}
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
            <X size={14} className="mt-0.5 flex-shrink-0 text-red-500" />
            <p className="text-xs font-bold text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* ═══ الملخص ═══ */}
        <div className="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/60">
            <h2 className="text-sm font-black text-gray-900 dark:text-gray-100">
              ملخص الطلب
            </h2>
          </div>
          <div className="space-y-2 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                عدد المنتجات
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {itemsCount}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">المجموع الفرعي</span>
              <span className="font-bold text-gray-900 dark:text-gray-100" dir="ltr">
                {formatCurrency(total)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <ArrowLeft size={11} />
                رسوم التوصيل
              </span>
              <span className="font-bold text-gray-700 dark:text-gray-300" dir="ltr">
                {formatCurrency(DELIVERY_FEE)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                  <Ticket size={11} />
                  الخصم
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400" dir="ltr">
                  - {formatCurrency(discount)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
              <span className="text-sm font-black text-gray-900 dark:text-gray-100">
                الإجمالي
              </span>
              <span className="text-xl font-black text-[#2e8b73] dark:text-[#6ecdb0]" dir="ltr">
                {formatCurrency(finalTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ الشريط الثابت — إتمام الطلب ═══ */}
      <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.06)] backdrop-blur-md md:bottom-0 dark:border-gray-800 dark:bg-gray-900/95">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              الإجمالي النهائي
            </div>
            <div className="text-lg font-black text-[#2e8b73] dark:text-[#6ecdb0]" dir="ltr">
              {formatCurrency(finalTotal)}
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading || supplierIds.length > 1}
            className="group flex items-center gap-2 rounded-full bg-[#2e8b73] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#2e8b73]/25 transition-all hover:bg-[#1e6b57] hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none dark:disabled:bg-gray-800 dark:disabled:text-gray-500"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                جارٍ الإرسال
              </>
            ) : (
              <>
                إتمام الطلب
                <ArrowLeft
                  size={16}
                  className="transition-transform group-hover:-translate-x-1"
                />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ مكونات فرعية ═══════════════ */

function SectionLabel({
  num,
  label,
  count,
}: {
  num: number;
  label: string;
  count?: number;
}) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2e8b73] text-[10px] font-black text-white">
        {num}
      </div>
      <h2 className="text-sm font-black text-gray-900 dark:text-gray-100">{label}</h2>
      {count !== undefined && (
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          {count}
        </span>
      )}
    </div>
  );
}

function StepChip({
  num,
  label,
  active,
  done,
}: {
  num: number;
  label: string;
  active?: boolean;
  done?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black transition-all ${
          done
            ? "bg-[#2e8b73] text-white"
            : active
              ? "bg-[#2e8b73] text-white ring-2 ring-[#2e8b73]/30"
              : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
        }`}
      >
        {done ? <CheckCircle2 size={11} /> : num}
      </div>
      <span
        className={`text-[10px] font-bold ${
          done || active
            ? "text-gray-900 dark:text-gray-100"
            : "text-gray-400 dark:text-gray-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
