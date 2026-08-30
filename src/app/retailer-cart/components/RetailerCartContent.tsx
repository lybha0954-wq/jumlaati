'use client';

import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Store, 
  CheckCircle, 
  ShoppingBag,
  ShieldCheck 
} from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  supplierName: string;
  price: number;
  quantity: number;
  unit: string;
}

export default function RetailerCartContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'علب برجر ورق (مقاس وسط)', supplierName: 'شركة التغليف الذكي المحدودة', price: 140, quantity: 5, unit: 'كرتون' },
    { id: 2, name: 'أكياس ورقية بشعار المطعم', supplierName: 'شركة التغليف الذكي المحدودة', price: 220, quantity: 2, unit: 'شدة' },
    { id: 3, name: 'مناديل مطاعم معقمة مفردة', supplierName: 'مؤسسة النظافة الشاملة للمطاعم', price: 90, quantity: 4, unit: 'كرتون' },
  ]);

  const [orderPlaced, setOrderPlaced] = useState(false);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setOrderPlaced(true);
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">سلة مشتريات الفرع</h1>
            <p className="text-sm text-gray-500 mt-1">مراجعة المنتجات المختارة من الموردين قبل تأكيد إرسال أمر الشراء.</p>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </header>

        {orderPlaced ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">تم إرسال طلب الشراء بنجاح!</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">تم تحويل السلة إلى أمر شراء معتمد وإرساله للموردين المختصين لمتابعة التجهيز والشحن.</p>
            <button 
              onClick={() => { setOrderPlaced(false); setCartItems([]); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
            >
              العودة للتسوق
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-2xl border border-gray-100 space-y-3">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
            <h2 className="text-lg font-bold text-gray-700">سلة المشتريات فارغة</h2>
            <p className="text-xs text-gray-400">لم تقم بإضافة أي منتجات توريد للسلة حتى الآن.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* قائمة المنتجات في السلة */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50/50 transition-all">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                        <Store className="w-3.5 h-3.5" />
                        {item.supplierName}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                      <span className="text-xs text-gray-400">السعر للوحدة: {item.price} ر.س</span>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                      {/* التحكم بالكمية */}
                      <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 hover:bg-gray-100 text-gray-600 transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-900">{item.quantity} {item.unit}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 hover:bg-gray-100 text-gray-600 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-left font-bold text-gray-900 text-sm min-w-[70px]">
                        {item.price * item.quantity} ر.س
                      </div>

                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        title="حذف المنتج"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ملخص الطلب والفواتير */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 h-fit">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">ملخص أمر الشراء</h2>
              
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>إجمالي المنتجات</span>
                  <span className="font-bold text-gray-900">{subtotal.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span>ضريبة القيمة المضافة (15%)</span>
                  <span className="font-bold text-gray-900">{vat.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-bold text-gray-900">
                  <span>الإجمالي الكلي</span>
                  <span className="text-blue-600">{total.toLocaleString()} ر.س</span>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl text-sm transition-all shadow-sm shadow-blue-200 flex items-center justify-center gap-2"
                >
                  <span>تأكيد وإرسال الطلب للموردين</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2 text-[11px] text-gray-400 justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>عملية توريد آمنة وموثوقة عبر النظام</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { createClient } from '@/lib/supabase/client';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const supabase = createClient();

    // 1. استدعاء Edge Function لإنشاء نية الدفع
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: { orderId },
    });

    if (error) { alert('فشل إنشاء الدفع'); setLoading(false); return; }

    // 2. توجيه المستخدم إلى واجهة Stripe (Checkout أو Elements)
    const stripe = await stripePromise;
    const { error: stripeError } = await stripe!.confirmPayment({
      elements: {
        clientSecret: data.clientSecret,
        // هنا يمكنك إضافة حقول البطاقة (CardElement)
      },
      confirmParams: { return_url: `${window.location.origin}/retailer/orders/${orderId}` },
    });

    if (stripeError) { alert(stripeError.message); }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleCheckout} 
      disabled={loading}
      className="w-full bg-green-600 text-white py-4 text-xl rounded-2xl hover:bg-green-700 disabled:bg-gray-400 transition"
    >
      {loading ? 'جاري تحويلك للدفع...' : '💳 إتمام الشراء'}
    </button>
  );
}
// داخل CheckoutButton.tsx، بعد إتمام الدفع
const { error: stripeError } = await stripe!.confirmPayment({
  // ...
  confirmParams: { 
    return_url: `${window.location.origin}/retailer/orders/${orderId}` 
  },
});

if (stripeError) {
  // إذا فشل الدفع، تأكد من استرجاع المخزون (حماية إضافية)
  await fetch('/api/restore-inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId })
  });
  alert('فشل الدفع، تم استرجاع المخزون. حاول مرة أخرى');
}
'use client';

import { useState } from 'react';
import { orderService } from '@/lib/services/orderService';

interface CouponInputProps {
  orderTotal: number;
  onCouponApplied: (discount: number, finalTotal: number, couponId: string) => void;
  onCouponRemoved: () => void;
}

export default function CouponInput({ orderTotal, onCouponApplied, onCouponRemoved }: CouponInputProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  const handleApply = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setError('');

    try {
      const result = await orderService.validateCoupon(code.trim(), orderTotal);
      
      if (!result.valid) {
        setError(result.error || 'كوبون غير صالح');
        return;
      }

      if (result.discount && result.final_total && result.coupon_id) {
        setAppliedCoupon({ code: code.trim(), discount: result.discount });
        onCouponApplied(result.discount, result.final_total, result.coupon_id);
        setError('');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setAppliedCoupon(null);
    setCode('');
    onCouponRemoved();
    setError('');
  };

  return (
    <div className="border-t pt-4 space-y-3">
      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
          <div>
            <span className="font-semibold text-green-700">✅ كوبون مطبق: {appliedCoupon.code}</span>
            <span className="text-sm text-green-600 mr-4">(خصم {appliedCoupon.discount.toFixed(2)} ريال)</span>
          </div>
          <button onClick={handleRemove} className="text-red-500 hover:text-red-700 text-sm font-medium">
            إلغاء
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="أدخل كود الخصم"
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={loading}
            dir="ltr"
          />
          <button
            onClick={handleApply}
            disabled={loading || !code.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'جاري...' : 'تطبيق'}
          </button>
        </div>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <p className="text-xs text-gray-400">يمكنك إدخال كود الخصم المتوفر لديك للحصول على خصم إضافي</p>
    </div>
  );
}
