'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import {
  ShoppingCart, Truck, CreditCard, CheckCircle, ChevronRight,
  MapPin, Phone, User, Package, AlertCircle, Banknote, Clock,
  ArrowLeft, ArrowRight, Star, Lock
} from 'lucide-react';
import Link from 'next/link';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import type { PaymentIntent } from '@stripe/stripe-js';
import type { CartItem } from '@/app/retailer-shop/components/RetailerShopContent';
import { COMMISSION_RATE, CURRENCY } from '@/lib/commissionStore';
import { financialService } from '@/lib/services/financialService';
import { createClient } from '@/lib/supabase/client';
import { getStripe } from '../../../lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type PaymentMethod = 'cod' | 'credit';
type CheckoutStep = 'review' | 'delivery' | 'payment' | 'confirmed';

const CREDIT_LIMIT = 500000;
const CREDIT_USED = 175000;
const CREDIT_AVAILABLE = CREDIT_LIMIT - CREDIT_USED;

interface DeliveryZone {
  id: string;
  name: string;
  city: string;
  fee: number;
  estimatedTime: string;
  available: boolean;
}

const DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'dz-1', name: 'المنطقة الخضراء', city: 'بغداد — الكرخ', fee: 3000, estimatedTime: '٢-٤ ساعات', available: true },
  { id: 'dz-2', name: 'الرصافة الشمالية', city: 'بغداد — الرصافة', fee: 3500, estimatedTime: '٣-٥ ساعات', available: true },
  { id: 'dz-3', name: 'الجادرية والدورة', city: 'بغداد — الجنوب', fee: 4000, estimatedTime: '٤-٦ ساعات', available: true },
  { id: 'dz-4', name: 'المدينة الطبية', city: 'بغداد — الوسط', fee: 2500, estimatedTime: '١-٣ ساعات', available: true },
  { id: 'dz-5', name: 'الكاظمية', city: 'بغداد — الشمال', fee: 3000, estimatedTime: '٢-٤ ساعات', available: true },
  { id: 'dz-6', name: 'أبو غريب', city: 'بغداد — الغرب', fee: 6000, estimatedTime: '٥-٨ ساعات', available: false },
  { id: 'dz-7', name: 'الموصل المركز', city: 'نينوى', fee: 8000, estimatedTime: '٢٤-٤٨ ساعة', available: true },
  { id: 'dz-8', name: 'البصرة القديمة', city: 'البصرة', fee: 9000, estimatedTime: '٢٤-٤٨ ساعة', available: true },
];

const STEPS: { key: CheckoutStep; label: string; icon: React.ElementType }[] = [
  { key: 'review', label: 'مراجعة السلة', icon: ShoppingCart },
  { key: 'delivery', label: 'منطقة التوصيل', icon: MapPin },
  { key: 'payment', label: 'طريقة الدفع', icon: CreditCard },
];

// ── Stripe Payment Form ───────────────────────────────────────────────────────
interface StripePaymentFormProps {
  clientSecret: string;
  onSuccess: (paymentIntent: PaymentIntent) => void;
  onError: (msg: string) => void;
  total: number;
}

function StripePaymentForm({ clientSecret, onSuccess, onError, total }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/retailer-checkout`,
      },
      redirect: 'if_required',
    });

    if (error) {
      console.error('Stripe confirmPayment error:', error);
      onError(error.message ?? 'فشل الدفع. يرجى المحاولة مرة أخرى.');
      setIsProcessing(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      // Confirm on backend to update order payment_status
      const { error: confirmError } = await supabase.functions.invoke('confirm-payment', {
        body: { paymentIntentId: paymentIntent.id },
      });
      if (confirmError) {
        console.error('confirm-payment edge function error:', confirmError);
        // Payment succeeded on Stripe side; still treat as success
      }
      onSuccess(paymentIntent);
    } else {
      onError('لم يكتمل الدفع. يرجى المحاولة مرة أخرى.');
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-muted/30 rounded-xl p-4 border border-border">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-arabic">
        <Lock size={12} className="flex-shrink-0" />
        <span>مدفوعاتك محمية بتشفير SSL من Stripe</span>
      </div>
      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full bg-primary text-white rounded-xl py-3.5 font-arabic font-bold text-base hover:bg-primary/90 active:scale-95 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>جاري معالجة الدفع...</span>
          </>
        ) : (
          <>
            <Lock size={16} />
            <span>ادفع الآن</span>
          </>
        )}
      </button>
    </form>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function RetailerCheckoutContent() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<CheckoutStep>('review');
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [notes, setNotes] = useState('');
  const [orderRef, setOrderRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [paidOrderRef, setPaidOrderRef] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('jumlaati_cart');
      if (stored) {
        try { setCart(JSON.parse(stored)); } catch { setCart([]); }
      }
    }
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
  const deliveryFee = selectedZone?.fee ?? 0;
  const total = subtotal + deliveryFee;
  const commission = Math.round(total * COMMISSION_RATE);

  const cartBySupplier = cart.reduce<Record<string, CartItem[]>>((acc, item) => {
    if (!acc[item.supplierName]) acc[item.supplierName] = [];
    acc[item.supplierName].push(item);
    return acc;
  }, {});

  const canPayCredit = total <= CREDIT_AVAILABLE;
  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  // ── COD order placement ──────────────────────────────────────────────────
  const handlePlaceCODOrder = async () => {
    setLoading(true);
    try {
      const ref = `ORD-${Math.floor(3000 + Math.random() * 1000)}`;
      const today = new Date().toISOString().split('T')[0];
      const supabase = createClient();

      // Insert order directly for COD
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: ref,
          retailer_id: user?.id ?? '00000000-0000-0000-0000-000000000000',
          supplier_id: cart[0]?.supplierId ?? '00000000-0000-0000-0000-000000000000',
          buyer_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'تاجر',
          buyer_store_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'تاجر',
          buyer_phone: user?.phone || '',
          delivery_address: selectedZone?.name ?? '',
          delivery_city: selectedZone?.city ?? '',
          delivery_notes: notes,
          subtotal,
          delivery_fee: deliveryFee,
          total,
          commission,
          payment_method: 'cod',
          status: 'pending',
          payment_status: 'pending',
        })
        .select('id')
        .single();

      if (!orderError && orderData && cart.length > 0) {
        await supabase.from('order_items').insert(
          cart.map((item) => ({
            order_id: orderData.id,
            product_id: item.id,
            quantity: item.quantity,
            unit_price: item.finalPrice,
            total_price: item.finalPrice * item.quantity,
          }))
        );
      }

      // Persist commission
      await financialService.addCommission({
        orderId: ref,
        orderDate: today,
        retailerName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'تاجر',
        orderTotal: total,
        commission,
      });

      // Persist ledger entries per supplier
      for (const [supplierName, items] of Object.entries(cartBySupplier)) {
        const supplierTotal = items.reduce((s, i) => s + i.finalPrice * i.quantity, 0);
        const supplierId = items[0]?.supplierId ?? 'sup-unknown';
        await financialService.addLedgerEntry({
          entryDate: today,
          supplierId,
          supplierName,
          entryType: 'order',
          description: `طلب #${ref} — ${items.map((i) => i.name).join('، ').slice(0, 60)}`,
          amount: supplierTotal,
          direction: 'debit',
          balance: 0,
          orderId: ref,
          paymentMethod: 'cod',
          status: 'completed',
        });
      }

      setOrderRef(ref);
      setStep('confirmed');
      if (typeof window !== 'undefined') sessionStorage.removeItem('jumlaati_cart');
    } catch {
      const ref = `ORD-${Math.floor(3000 + Math.random() * 1000)}`;
      setOrderRef(ref);
      setStep('confirmed');
      if (typeof window !== 'undefined') sessionStorage.removeItem('jumlaati_cart');
    } finally {
      setLoading(false);
    }
  };

  // ── Initiate Stripe payment ──────────────────────────────────────────────
  const handleInitiateStripePayment = async () => {
    setStripeLoading(true);
    setStripeError(null);
    try {
      const ref = `ORD-${Math.floor(3000 + Math.random() * 1000)}`;
      const supabase = createClient();

      const { data, error } = await supabase.functions.invoke<{
        clientSecret: string;
        orderId: string;
        paymentIntentId: string;
        error?: string;
      }>('create-payment-intent', {
        body: {
          amount: total,
          currency: 'usd',
          orderNumber: ref,
          buyerName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'تاجر',
          buyerStoreName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'تاجر',
          buyerPhone: user?.phone || '',
          deliveryAddress: selectedZone?.name ?? '',
          deliveryCity: selectedZone?.city ?? '',
          deliveryNotes: notes,
          subtotal,
          deliveryFee,
          total,
          commission,
          paymentMethod: 'credit',
          retailerId: user?.id ?? undefined,
          supplierId: cart[0]?.supplierId ?? undefined,
          items: cart.map((item) => ({
            productId: item.id,
            qty: item.quantity,
            unitPrice: item.finalPrice,
          })),
        },
      });

      if (error) {
        console.error('create-payment-intent error:', error);
        throw new Error((data as { error?: string })?.error ?? error.message ?? 'فشل إعداد الدفع');
      }

      if (!data?.clientSecret) throw new Error('لم يتم استلام بيانات الدفع');

      setPaidOrderRef(ref);
      setStripeClientSecret(data.clientSecret);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'فشل إعداد الدفع. يرجى المحاولة مرة أخرى.';
      setStripeError(msg);
    } finally {
      setStripeLoading(false);
    }
  };

  // ── Stripe payment success ───────────────────────────────────────────────
  const handleStripeSuccess = async (paymentIntent: PaymentIntent) => {
    const today = new Date().toISOString().split('T')[0];
    const ref = paidOrderRef || `ORD-${paymentIntent.id.slice(-6)}`;

    try {
      await financialService.addCommission({
        orderId: ref,
        orderDate: today,
        retailerName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'تاجر',
        orderTotal: total,
        commission,
      });

      for (const [supplierName, items] of Object.entries(cartBySupplier)) {
        const supplierTotal = items.reduce((s, i) => s + i.finalPrice * i.quantity, 0);
        const supplierId = items[0]?.supplierId ?? 'sup-unknown';
        await financialService.addLedgerEntry({
          entryDate: today,
          supplierId,
          supplierName,
          entryType: 'order',
          description: `طلب #${ref} — ${items.map((i) => i.name).join('، ').slice(0, 60)}`,
          amount: supplierTotal,
          direction: 'debit',
          balance: 0,
          orderId: ref,
          paymentMethod: 'credit',
          status: 'completed',
        });
      }
    } catch (e) {
      console.error('Post-payment ledger error:', e);
    }

    setOrderRef(ref);
    setStep('confirmed');
    if (typeof window !== 'undefined') sessionStorage.removeItem('jumlaati_cart');
  };

  // ── Confirmed screen ──────────────────────────────────────────────────────
  if (step === 'confirmed') {
    return (
      <div className="max-w-lg mx-auto py-10 flex flex-col items-center gap-6 text-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle size={48} className="text-success" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
            <Star size={14} className="text-warning fill-warning" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic mb-2">تم تأكيد طلبك! 🎉</h1>
          <p className="text-muted-foreground font-arabic text-sm leading-relaxed">
            طلبك <span className="font-bold text-primary tabular-nums">#{orderRef}</span> قيد المعالجة.
            سيتواصل معك المورد لتأكيد موعد التسليم.
          </p>
        </div>

        <div className="w-full bg-card border border-border rounded-2xl overflow-hidden">
          <div className="bg-primary/5 border-b border-border px-5 py-3">
            <p className="font-arabic font-bold text-sm text-primary">تفاصيل الطلب</p>
          </div>
          <div className="p-5 space-y-3">
            {[
              { label: 'رقم الطلب', value: `#${orderRef}`, bold: true },
              { label: 'المبلغ الإجمالي', value: `${total.toLocaleString('ar-IQ')} ${CURRENCY}`, color: 'text-primary' },
              { label: 'رسوم التوصيل', value: deliveryFee > 0 ? `${deliveryFee.toLocaleString('ar-IQ')} ${CURRENCY}` : 'مجاني' },
              { label: 'منطقة التوصيل', value: selectedZone ? `${selectedZone.name} — ${selectedZone.city}` : '—' },
              { label: 'وقت التوصيل المتوقع', value: selectedZone?.estimatedTime ?? '١-٢ يوم عمل' },
              { label: 'عمولة المنصة (٢٪)', value: `${commission.toLocaleString('ar-IQ')} ${CURRENCY}`, color: 'text-emerald-600' },
              { label: 'طريقة الدفع', value: paymentMethod === 'cod' ? '💵 الدفع عند الاستلام' : '💳 بطاقة ائتمان (Stripe)' },
            ].map(({ label, value, bold, color }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="font-arabic text-sm text-muted-foreground">{label}</span>
                <span className={`font-arabic text-sm ${bold ? 'font-bold text-foreground' : 'font-semibold'} ${color ?? 'text-foreground'} tabular-nums`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link href="/retailer-shop" className="flex-1 text-center bg-primary text-white rounded-xl py-3 font-arabic font-bold text-sm hover:bg-primary/90 transition-all">
            متابعة التسوق
          </Link>
          <Link href="/retailer-ledger" className="flex-1 text-center bg-muted text-foreground rounded-xl py-3 font-arabic font-semibold text-sm hover:bg-border transition-all">
            كشف الحساب
          </Link>
        </div>
      </div>
    );
  }

  // ── Main checkout layout ──────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/retailer-shop" className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
          <ChevronRight size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">إتمام الطلب</h1>
          <p className="text-sm text-muted-foreground font-arabic mt-0.5">
            {cart.length} منتج — {Object.keys(cartBySupplier).length} مورد
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-card border border-border rounded-xl px-5 py-4">
        <div className="flex items-center gap-2">
          {STEPS.map((s, idx) => {
            const StepIcon = s.icon;
            const isActive = step === s.key;
            const isDone = currentStepIndex > idx;
            return (
              <React.Fragment key={s.key}>
                <div className={`flex items-center gap-2 ${isActive ? 'text-primary' : isDone ? 'text-success' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isActive ? 'bg-primary text-white shadow-sm' : isDone ? 'bg-success text-white' : 'bg-muted text-muted-foreground'}`}>
                    {isDone ? <CheckCircle size={15} /> : <StepIcon size={15} />}
                  </div>
                  <span className={`font-arabic text-sm font-medium hidden sm:block ${isActive ? 'font-bold' : ''}`}>{s.label}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 rounded-full ${isDone ? 'bg-success' : 'bg-border'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">

          {/* ── STEP 1: Cart Review ─────────────────────────────────────── */}
          {step === 'review' && (
            <>
              {/* Delivery address */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="font-arabic font-bold text-base text-foreground mb-4 flex items-center gap-2">
                  <User size={16} className="text-primary" />
                  بيانات المحل
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-arabic text-muted-foreground mb-1.5">اسم المحل</label>
                    <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
                      <User size={14} className="text-muted-foreground flex-shrink-0" />
                      <span className="font-arabic text-sm text-foreground">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'تاجر'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-arabic text-muted-foreground mb-1.5">رقم الهاتف</label>
                    <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
                      <Phone size={14} className="text-muted-foreground flex-shrink-0" />
                      <span className="font-arabic text-sm text-foreground tabular-nums" dir="ltr">+964 770 123 4567</span>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-arabic text-muted-foreground mb-1.5">عنوان التوصيل</label>
                    <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
                      <MapPin size={14} className="text-muted-foreground flex-shrink-0" />
                      <span className="font-arabic text-sm text-foreground">بغداد / الكرادة — شارع الأميرات، بناية 14</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart items by supplier */}
              {cart.length === 0 ? (
                <div className="bg-card border border-border rounded-xl py-16 flex flex-col items-center gap-3">
                  <ShoppingCart size={36} className="text-muted-foreground/40" />
                  <p className="font-arabic text-muted-foreground">السلة فارغة</p>
                  <Link href="/retailer-shop" className="text-primary font-arabic text-sm font-semibold hover:underline">
                    تسوق الآن
                  </Link>
                </div>
              ) : (
                Object.entries(cartBySupplier).map(([supplierName, items]) => {
                  const supplierTotal = items.reduce((s, i) => s + i.finalPrice * i.quantity, 0);
                  return (
                    <div key={`sup-${supplierName}`} className="bg-card border border-border rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-3 bg-muted/40 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Truck size={14} className="text-accent" />
                          <span className="font-arabic font-semibold text-sm text-foreground">{supplierName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-arabic">
                          <Clock size={12} />
                          <span>توصيل خلال 1-2 يوم</span>
                        </div>
                      </div>
                      <div className="divide-y divide-border/60">
                        {items.map((item) => (
                          <div key={`item-${item.id}`} className="flex items-center justify-between px-5 py-3 gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-arabic text-sm font-semibold text-foreground truncate">{item.name}</p>
                              <p className="font-arabic text-xs text-muted-foreground tabular-nums">
                                {item.quantity} {item.unit} × {item.finalPrice.toLocaleString('ar-IQ')} {CURRENCY}
                              </p>
                            </div>
                            <span className="font-arabic font-bold text-primary tabular-nums text-sm flex-shrink-0">
                              {(item.finalPrice * item.quantity).toLocaleString('ar-IQ')} {CURRENCY}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center px-5 py-2.5 bg-muted/20 border-t border-border">
                        <span className="font-arabic text-xs text-muted-foreground">مجموع {supplierName}</span>
                        <span className="font-arabic font-bold text-sm text-foreground tabular-nums">
                          {supplierTotal.toLocaleString('ar-IQ')} {CURRENCY}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Notes */}
              <div className="bg-card border border-border rounded-xl p-5">
                <label className="block font-arabic font-semibold text-sm text-foreground mb-2">ملاحظات للمورد (اختياري)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي تعليمات خاصة للتوصيل أو الطلب..."
                  rows={3}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none transition-all"
                />
              </div>

              <button
                onClick={() => setStep('delivery')}
                disabled={cart.length === 0}
                className="w-full bg-primary text-white rounded-xl py-3.5 font-arabic font-bold text-base hover:bg-primary/90 active:scale-95 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>اختيار منطقة التوصيل</span>
                <ArrowLeft size={18} />
              </button>
            </>
          )}

          {/* ── STEP 2: Delivery Zone ───────────────────────────────────── */}
          {step === 'delivery' && (
            <>
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="font-arabic font-bold text-base text-foreground mb-1 flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  اختر منطقة التوصيل
                </h2>
                <p className="font-arabic text-xs text-muted-foreground mb-5">
                  اختر المنطقة الأقرب لمحلك لتحديد رسوم ووقت التوصيل
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DELIVERY_ZONES.map((zone) => {
                    const isSelected = selectedZone?.id === zone.id;
                    return (
                      <button
                        key={zone.id}
                        onClick={() => zone.available && setSelectedZone(zone)}
                        disabled={!zone.available}
                        className={`text-right p-4 rounded-xl border-2 transition-all duration-150 ${
                          !zone.available
                            ? 'opacity-50 cursor-not-allowed border-border bg-muted/30'
                            : isSelected
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border hover:border-primary/40 hover:bg-muted/30 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <p className="font-arabic font-bold text-sm text-foreground">{zone.name}</p>
                            <p className="font-arabic text-xs text-muted-foreground mt-0.5">{zone.city}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected ? 'border-primary bg-primary' : 'border-border'}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-muted-foreground" />
                            <span className="font-arabic text-xs text-muted-foreground">{zone.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Truck size={12} className={isSelected ? 'text-primary' : 'text-muted-foreground'} />
                            <span className={`font-arabic text-xs font-bold tabular-nums ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                              {zone.fee.toLocaleString('ar-IQ')} {CURRENCY}
                            </span>
                          </div>
                        </div>
                        {!zone.available && (
                          <div className="mt-2 flex items-center gap-1">
                            <AlertCircle size={11} className="text-danger" />
                            <span className="font-arabic text-xs text-danger">غير متاح حالياً</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('review')}
                  className="flex-1 bg-muted text-foreground rounded-xl py-3 font-arabic font-semibold text-sm hover:bg-border transition-all flex items-center justify-center gap-2"
                >
                  <ArrowRight size={16} />
                  رجوع
                </button>
                <button
                  onClick={() => setStep('payment')}
                  disabled={!selectedZone}
                  className="flex-[2] bg-primary text-white rounded-xl py-3 font-arabic font-bold text-base hover:bg-primary/90 active:scale-95 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>متابعة لطريقة الدفع</span>
                  <ArrowLeft size={18} />
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3: Payment ─────────────────────────────────────────── */}
          {step === 'payment' && (
            <>
              {/* Delivery zone summary */}
              {selectedZone && (
                <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-arabic text-sm font-bold text-foreground">{selectedZone.name}</p>
                      <p className="font-arabic text-xs text-muted-foreground">{selectedZone.city} — {selectedZone.estimatedTime}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-arabic text-xs text-muted-foreground">رسوم التوصيل</p>
                    <p className="font-arabic font-bold text-sm text-primary tabular-nums">{selectedZone.fee.toLocaleString('ar-IQ')} {CURRENCY}</p>
                  </div>
                </div>
              )}

              <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                <h2 className="font-arabic font-bold text-base text-foreground flex items-center gap-2">
                  <CreditCard size={16} className="text-primary" />
                  اختر طريقة الدفع
                </h2>

                {/* COD */}
                <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-muted/30'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => { setPaymentMethod('cod'); setStripeClientSecret(null); setStripeError(null); }} className="mt-1 accent-primary cursor-pointer" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Banknote size={18} className="text-success" />
                      <span className="font-arabic font-bold text-foreground">الدفع عند الاستلام (كاش)</span>
                    </div>
                    <p className="font-arabic text-xs text-muted-foreground leading-relaxed">ادفع نقداً عند استلام البضاعة من المورد. لا توجد رسوم إضافية.</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <CheckCircle size={12} className="text-success" />
                      <span className="font-arabic text-xs text-success font-medium">متاح دائماً</span>
                    </div>
                  </div>
                </label>

                {/* Credit Card via Stripe */}
                <label className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${!canPayCredit ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${paymentMethod === 'credit' && canPayCredit ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-muted/30'}`}>
                  <input type="radio" name="payment" value="credit" checked={paymentMethod === 'credit'} onChange={() => { if (canPayCredit) { setPaymentMethod('credit'); setStripeClientSecret(null); setStripeError(null); } }} disabled={!canPayCredit} className="mt-1 accent-primary cursor-pointer disabled:cursor-not-allowed" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard size={18} className="text-primary" />
                      <span className="font-arabic font-bold text-foreground">بطاقة ائتمان / مدين</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium" dir="ltr">Stripe</span>
                    </div>
                    <p className="font-arabic text-xs text-muted-foreground leading-relaxed">ادفع بأمان باستخدام بطاقتك الائتمانية أو المدينة عبر Stripe.</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Lock size={11} className="text-muted-foreground" />
                        <span className="font-arabic text-xs text-muted-foreground">مدفوعات آمنة بتشفير SSL</span>
                      </div>
                    </div>
                    {!canPayCredit && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <AlertCircle size={12} className="text-danger" />
                        <span className="font-arabic text-xs text-danger font-medium">الرصيد غير كافٍ لهذا الطلب ({total.toLocaleString('ar-IQ')} {CURRENCY})</span>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Stripe Payment Element (shown when credit selected and client secret ready) */}
              {paymentMethod === 'credit' && canPayCredit && (
                <div className="bg-card border border-border rounded-xl p-5">
                  {!stripeClientSecret ? (
                    <div className="space-y-3">
                      <p className="font-arabic text-sm text-muted-foreground">اضغط لإعداد نموذج الدفع الآمن</p>
                      {stripeError && (
                        <div className="flex items-start gap-2 bg-danger/10 border border-danger/20 rounded-lg px-3 py-2.5">
                          <AlertCircle size={14} className="text-danger flex-shrink-0 mt-0.5" />
                          <p className="font-arabic text-xs text-danger">{stripeError}</p>
                        </div>
                      )}
                      <button
                        onClick={handleInitiateStripePayment}
                        disabled={stripeLoading}
                        className="w-full bg-primary text-white rounded-xl py-3 font-arabic font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                      >
                        {stripeLoading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>جاري إعداد الدفع...</span>
                          </>
                        ) : (
                          <>
                            <Lock size={15} />
                            <span>إعداد نموذج الدفع الآمن</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <Elements
                      stripe={getStripe()}
                      options={{
                        clientSecret: stripeClientSecret,
                        appearance: {
                          theme: 'stripe',
                          variables: {
                            fontFamily: 'inherit',
                            borderRadius: '8px',
                          },
                        },
                      }}
                    >
                      <StripePaymentForm
                        clientSecret={stripeClientSecret}
                        onSuccess={handleStripeSuccess}
                        onError={(msg) => setStripeError(msg)}
                        total={total}
                      />
                    </Elements>
                  )}
                </div>
              )}

              {/* Order confirmation summary */}
              {paymentMethod === 'cod' && (
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-arabic font-bold text-sm text-foreground mb-3 flex items-center gap-2">
                    <Package size={15} className="text-primary" />
                    تأكيد تفاصيل الطلب
                  </h3>
                  <div className="space-y-2.5">
                    {[
                      { label: 'عدد المنتجات', value: `${cart.length} منتج` },
                      { label: 'عدد الموردين', value: `${Object.keys(cartBySupplier).length} مورد` },
                      { label: 'منطقة التوصيل', value: selectedZone?.name ?? '—' },
                      { label: 'وقت التوصيل', value: selectedZone?.estimatedTime ?? '—' },
                      { label: 'طريقة الدفع', value: 'الدفع عند الاستلام' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center text-sm font-arabic">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-semibold text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="flex gap-3">
                  <button onClick={() => setStep('delivery')} className="flex-1 bg-muted text-foreground rounded-xl py-3 font-arabic font-semibold text-sm hover:bg-border transition-all flex items-center justify-center gap-2">
                    <ArrowRight size={16} />
                    رجوع
                  </button>
                  <button
                    onClick={handlePlaceCODOrder}
                    disabled={loading}
                    className="flex-[2] bg-primary text-white rounded-xl py-3 font-arabic font-bold text-base hover:bg-primary/90 active:scale-95 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="font-arabic">جاري تأكيد الطلب...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        <span className="font-arabic">تأكيد الطلب ومتابعة</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {paymentMethod === 'credit' && !stripeClientSecret && (
                <button onClick={() => setStep('delivery')} className="w-full bg-muted text-foreground rounded-xl py-3 font-arabic font-semibold text-sm hover:bg-border transition-all flex items-center justify-center gap-2">
                  <ArrowRight size={16} />
                  رجوع
                </button>
              )}
            </>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-5 space-y-3 sticky top-20">
            <h3 className="font-arabic font-bold text-base text-foreground flex items-center gap-2">
              <ShoppingCart size={16} className="text-primary" />
              ملخص الطلب
            </h3>

            {cart.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cart.map((item) => (
                  <div key={`sum-${item.id}`} className="flex justify-between items-start gap-2 text-xs">
                    <span className="font-arabic text-muted-foreground flex-1 leading-snug">{item.name} × {item.quantity}</span>
                    <span className="font-arabic font-semibold text-foreground tabular-nums flex-shrink-0">
                      {(item.finalPrice * item.quantity).toLocaleString('ar-IQ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-arabic text-xs text-muted-foreground text-center py-3">لا توجد منتجات في السلة</p>
            )}

            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between text-sm font-arabic">
                <span className="text-muted-foreground">المجموع الفرعي</span>
                <span className="tabular-nums">{subtotal.toLocaleString('ar-IQ')} {CURRENCY}</span>
              </div>
              <div className="flex justify-between text-sm font-arabic">
                <span className="text-muted-foreground">رسوم التوصيل</span>
                {selectedZone ? (
                  <span className="tabular-nums font-medium">{selectedZone.fee.toLocaleString('ar-IQ')} {CURRENCY}</span>
                ) : (
                  <span className="text-muted-foreground text-xs">يُحدَّد لاحقاً</span>
                )}
              </div>
              <div className="flex justify-between text-sm font-arabic text-emerald-600">
                <span>عمولة المنصة (٢٪)</span>
                <span className="tabular-nums font-semibold">{commission.toLocaleString('ar-IQ')} {CURRENCY}</span>
              </div>
              <div className="flex justify-between font-arabic font-bold border-t border-border pt-2">
                <span className="text-foreground">الإجمالي</span>
                <span className="text-primary text-lg tabular-nums">{total.toLocaleString('ar-IQ')} {CURRENCY}</span>
              </div>
            </div>

            {selectedZone && (
              <div className="bg-muted/50 rounded-lg px-3 py-2 flex items-center gap-2">
                <MapPin size={13} className="text-primary flex-shrink-0" />
                <span className="font-arabic text-xs text-foreground font-medium">{selectedZone.name}</span>
                <span className="font-arabic text-xs text-muted-foreground mr-auto">{selectedZone.estimatedTime}</span>
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-muted/50 rounded-lg px-3 py-2 flex items-center gap-2">
                {paymentMethod === 'cod' ? (
                  <Banknote size={13} className="text-success flex-shrink-0" />
                ) : (
                  <CreditCard size={13} className="text-primary flex-shrink-0" />
                )}
                <span className="font-arabic text-xs text-foreground font-medium">
                  {paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان (Stripe)'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
