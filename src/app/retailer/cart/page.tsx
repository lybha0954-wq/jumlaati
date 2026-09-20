'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { orderService } from '@/lib/services/orderService';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, CheckCircle, Truck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RetailerCartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalAmount, itemCount } = useCart();
  const { user, profile } = useAuth();
  const router = useRouter();

  const [address, setAddress] = useState('شارع الرشيد، بغداد');
  const [city, setCity] = useState(profile?.city || 'بغداد');
  const [phone, setPhone] = useState(profile?.phone || '07701234567');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    try {
      // Group items by supplier if multiple suppliers exist
      const suppliersMap = new Map<string, typeof items>();
      items.forEach((item) => {
        const suppId = item.product.supplierId || 'general-supplier';
        const list = suppliersMap.get(suppId) || [];
        list.push(item);
        suppliersMap.set(suppId, list);
      });

      // Create orders for each supplier in Firestore
      for (const [suppId, suppItems] of suppliersMap.entries()) {
        const orderSubtotal = suppItems.reduce(
          (sum, i) => sum + (i.product.finalPrice || i.product.originalPrice || 0) * i.quantity,
          0
        );

        await orderService.create({
          supplierId: suppId,
          retailerId: user?.uid || 'guest-retailer',
          status: 'pending',
          paymentStatus: paymentMethod === 'cash' ? 'paid' : 'pending',
          buyer: {
            name: profile?.fullName || user?.displayName || 'صاحب محل',
            storeName: profile?.businessName || 'المحل التجاري',
            phone: phone || profile?.phone || '',
          },
          delivery: {
            address,
            city,
            notes,
          },
          items: suppItems.map((si) => ({
            id: si.product.id,
            name: si.product.name,
            qty: si.quantity,
            unit: si.product.unit,
            unitPrice: si.product.finalPrice || si.product.originalPrice || 0,
          })),
          total: orderSubtotal,
          commission: Math.round(orderSubtotal * 0.025),
        });
      }

      clearCart();
      toast.success('تم إرسال الطلب بنجاح إلى الموردين!');
      router.push('/retailer/orders');
    } catch (e: any) {
      console.error('Checkout error:', e);
      toast.error('حدث خطأ أثناء إتمام الطلب، يرجى المحاولة لاحقاً');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout activeRoute="/retailer-cart">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-foreground font-arabic">سلة المشتريات</h1>
            <p className="text-xs text-muted-foreground font-arabic mt-1">
              مراجعة المنتجات وتأكيد طلب التوريد للمحل
            </p>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1 font-arabic"
            >
              <Trash2 size={14} />
              إفراغ السلة
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-2xl">
            <ShoppingBag size={48} className="mx-auto text-muted-foreground/30 mb-3" />
            <h2 className="text-lg font-bold text-foreground font-arabic">سلة المشتريات فارغة</h2>
            <p className="text-xs text-muted-foreground font-arabic mt-1 mb-6">
              لم تضف أي منتجات إلى السلة بعد.
            </p>
            <Link
              href="/retailer/catalog"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold font-arabic hover:bg-primary/90 transition-colors shadow-sm"
            >
              تصفح المنتجات وأضف بضائعك
              <ArrowLeft size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((it) => {
                const itemTotal =
                  (it.product.finalPrice || it.product.originalPrice || 0) * it.quantity;
                return (
                  <div
                    key={it.product.id}
                    className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground font-arabic">
                          {it.product.category}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-arabic">
                          {it.product.supplierName}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-foreground font-arabic">
                        {it.product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-arabic mt-0.5">
                        السعر الفردي:{' '}
                        <span className="text-foreground font-semibold">
                          {(it.product.finalPrice || it.product.originalPrice).toLocaleString()} د.ع
                        </span>{' '}
                        / {it.product.unit}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(it.product.id, it.quantity - 1)}
                          className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-xs font-bold font-arabic tabular-nums">
                          {it.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(it.product.id, it.quantity + 1)}
                          className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-left min-w-[100px]">
                        <p className="text-xs text-muted-foreground font-arabic">الإجمالي</p>
                        <p className="text-sm font-black text-primary font-arabic">
                          {itemTotal.toLocaleString()} د.ع
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(it.product.id)}
                        className="p-2 text-muted-foreground hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="حذف من السلة"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary & Delivery Details */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-5 h-fit">
              <h2 className="text-base font-bold text-foreground font-arabic">تفاصيل التوصيل والطلب</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground font-arabic mb-1">
                    عنوان التوصيل (المحل)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="اسم الشارع، المنطقة، أقرب نقطة دالة"
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-foreground font-arabic mb-1">
                      المدينة
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="بغداد"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground font-arabic mb-1">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07700000000"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground font-arabic mb-1">
                    طريقة الدفع
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-2.5 rounded-xl border text-xs font-bold font-arabic transition-all ${
                        paymentMethod === 'cash'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background text-muted-foreground'
                      }`}
                    >
                      دفع عند الاستلام (كاش)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit')}
                      className={`p-2.5 rounded-xl border text-xs font-bold font-arabic transition-all ${
                        paymentMethod === 'credit'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background text-muted-foreground'
                      }`}
                    >
                      دفع آجل (حساب تاجر)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground font-arabic mb-1">
                    ملاحظات للمورد أو المندوب (اختياري)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="أي تعليمات خاصة بالاستلام أو التوقيت..."
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-xs font-arabic text-muted-foreground">
                  <span>عدد الأصناف</span>
                  <span>{itemCount} وحدة</span>
                </div>
                <div className="flex justify-between text-xs font-arabic text-muted-foreground">
                  <span>أجور التوصيل</span>
                  <span className="text-emerald-600 font-bold">مجاني</span>
                </div>
                <div className="flex justify-between text-base font-black font-arabic text-foreground pt-2 border-t border-border">
                  <span>المبلغ الإجمالي</span>
                  <span className="text-primary">{totalAmount.toLocaleString()} د.ع</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold font-arabic text-sm hover:bg-primary/90 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  'جاري إرسال الطلب...'
                ) : (
                  <>
                    <Truck size={18} />
                    تأكيد وإرسال الطلب للمورد
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
