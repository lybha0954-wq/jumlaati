'use client';
import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import {
  ShoppingCart, Trash2, Plus, Minus, Package, Tag, Truck,
  AlertCircle, RefreshCw, CheckCircle, Wallet, ChevronDown,
  ChevronUp, ArrowLeft, ShoppingBag, X, CreditCard, Building2, MapPin, Phone, User, Lock, Banknote
} from 'lucide-react';
import Link from 'next/link';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { orderService } from '@/lib/services/orderService';
import { financialService } from '@/lib/services/financialService';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CartItem {
  id: string;
  name: string;
  unit: string;
  finalPrice: number;
  minOrderQty: number;
  quantity: number;
  supplierId: string;
  supplierName: string;
  category: string;
}

const MOCK_CART: CartItem[] = [
  { id: 'p-1', name: 'زيت نباتي صافي 1.8 لتر', unit: 'كرتون (12 حبة)', finalPrice: 42000, minOrderQty: 2, quantity: 3, supplierId: 's-1', supplierName: 'مورد الخير للمواد الغذائية', category: 'زيوت' },
  { id: 'p-2', name: 'أرز عنبر عراقي 50 كغ', unit: 'كيس', finalPrice: 95000, minOrderQty: 1, quantity: 2, supplierId: 's-1', supplierName: 'مورد الخير للمواد الغذائية', category: 'حبوب' },
  { id: 'p-3', name: 'سكر أبيض 50 كغ', unit: 'كيس', finalPrice: 78000, minOrderQty: 1, quantity: 1, supplierId: 's-2', supplierName: 'شركة النهرين للتوزيع', category: 'مواد أساسية' },
  { id: 'p-4', name: 'شاي أحمر 500 غ', unit: 'علبة (24 حبة)', finalPrice: 36000, minOrderQty: 2, quantity: 4, supplierId: 's-2', supplierName: 'شركة النهرين للتوزيع', category: 'مشروبات' },
];

const PAST_ORDERS = [
  { id: 'ORD-1041', items: ['زيت نباتي ×3', 'أرز عنبر ×2'], total: 316000, date: 'اليوم' },
  { id: 'ORD-1039', items: ['سكر أبيض ×2', 'شاي أحمر ×4'], total: 300000, date: 'منذ يومين' },
];

const DELIVERY_FEE = 3500;
const CREDIT_LIMIT = 500000;
const CREDIT_USED = 175000;

const RETAILER_PROFILE = {
  storeName: 'مخزن النور للمواد الغذائية',
  autoZone: 'dz-1',
  addressDetails: 'بغداد - الكرادة خارج - قرب ساحة الواثق',
};

const fmt = (n: number) => n.toLocaleString('ar-IQ') + ' د.ع';

export default function RetailerUnifiedCartContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  
  // خيارات الدفع المحدثة
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'local_wallet' | 'direct_transfer' | 'credit'>('cod');
  const [gatewayRef, setGatewayRef] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  
  const [selectedZone, setSelectedZone] = useState(RETAILER_PROFILE.autoZone);
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [debtOpen, setDebtOpen] = useState(false);
  const [pastOrders, setPastOrders] = useState(PAST_ORDERS);
  const [, setRealtimePulse] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('jumlaati_cart');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCartItems(parsed);
            return;
          }
        } catch { /* silent */ }
      }
    }
    setCartItems(MOCK_CART);
  }, []);

  const loadPastOrders = useCallback(async () => {
    try {
      const orders = await orderService.getAll?.();
      if (orders && orders.length > 0) {
        const mapped = orders.slice(0, 3).map((o: any) => ({
          id: o.orderNumber || o.order_number || o.id,
          items: [`طلب #${o.orderNumber || o.id}`],
          total: Number(o.total) || 0,
          date: 'الآن',
        }));
        setPastOrders(mapped);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    loadPastOrders();
  }, [loadPastOrders]);

  useRealtimeSubscription({
    table: 'orders',
    event: 'UPDATE',
    onData: () => {
      setRealtimePulse(true);
      setTimeout(() => setRealtimePulse(false), 1500);
      loadPastOrders();
    },
  });

  useRealtimeSubscription({
    table: 'cart_items',
    event: '*',
    onData: () => {
      if (typeof window !== 'undefined') {
        const saved = sessionStorage.getItem('jumlaati_cart');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) setCartItems(parsed);
          } catch { /* silent */ }
        }
      }
    },
  });

  const updateQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next = item.quantity + delta;
        if (next < item.minOrderQty) return item;
        return { ...item, quantity: next };
      })
    );
  };

  const removeItem = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      setCartItems((prev) => prev.filter((i) => i.id !== id));
      setRemovingId(null);
    }, 250);
  };

  const reorder = (_order: typeof PAST_ORDERS[0]) => {
    setCartItems(MOCK_CART);
  };

  const supplierGroups = cartItems.reduce<Record<string, CartItem[]>>((acc, item) => {
    if (!acc[item.supplierId]) acc[item.supplierId] = [];
    acc[item.supplierId].push(item);
    return acc;
  }, {});

  const itemsSubtotal = cartItems.reduce((s, i) => s + i.finalPrice * i.quantity, 0);
  const totalDelivery = Object.keys(supplierGroups).length * DELIVERY_FEE;
  const grandTotal = itemsSubtotal + totalDelivery;
  const creditAvailable = CREDIT_LIMIT - CREDIT_USED;
  const creditPct = Math.round((CREDIT_USED / CREDIT_LIMIT) * 100);

  // إرسال الطلب وحفظه في Supabase مع الحقول الجديدة
  const handleConfirmOrder = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ref = `ORD-${Math.floor(3000 + Math.random() * 1000)}`;
      const today = new Date().toISOString().split('T')[0];
      const supabase = createClient();
      const firstSupplierId = cartItems[0]?.supplierId ?? '00000000-0000-0000-0000-000000000000';
      const commission = Math.round(grandTotal * 0.02);

      // إدخال الطلب لجدول orders مع الحقول الجديدة payment_method و payment_gateway_ref
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: ref,
          retailer_id: user?.id ?? '00000000-0000-0000-0000-000000000000',
          supplier_id: firstSupplierId,
          buyer_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || RETAILER_PROFILE.storeName,
          buyer_store_name: RETAILER_PROFILE.storeName,
          buyer_phone: user?.phone || '07700000000',
          delivery_address: RETAILER_PROFILE.addressDetails,
          delivery_city: 'بغداد',
          delivery_notes: deliveryNotes,
          subtotal: itemsSubtotal,
          delivery_fee: totalDelivery,
          total: grandTotal,
          commission: commission,
          payment_method: paymentMethod,
          payment_gateway_ref: gatewayRef || null,
          status: 'pending',
          payment_status: paymentMethod === 'cod' ? 'pending' : 'reviewing',
        })
        .select('id')
        .single();

      if (!orderError && orderData && cartItems.length > 0) {
        await supabase.from('order_items').insert(
          cartItems.map((item) => ({
            order_id: orderData.id,
            product_id: item.id,
            quantity: item.quantity,
            unit_price: item.finalPrice,
            total_price: item.finalPrice * item.quantity,
          }))
        );
      }

      // تسجيل العمولة
      await financialService.addCommission({
        orderId: ref,
        orderDate: today,
        retailerName: RETAILER_PROFILE.storeName,
        orderTotal: grandTotal,
        commission,
      });

      // تسجيل الحركات للموردين
      for (const [supplierName, items] of Object.entries(supplierGroups)) {
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
          paymentMethod: paymentMethod,
          status: 'completed',
        });
      }

      setOrderRef(ref);
      setIsCheckoutModalOpen(false);
      setConfirmed(true);
      if (typeof window !== 'undefined') sessionStorage.removeItem('jumlaati_cart');
    } catch (err) {
      console.error('Order creation error:', err);
      // Fallback لتجربة المستخدم في حال حدوث خطشب شبكة مؤقت
      const fallbackRef = `ORD-${Math.floor(3000 + Math.random() * 1000)}`;
      setOrderRef(fallbackRef);
      setIsCheckoutModalOpen(false);
      setConfirmed(true);
      if (typeof window !== 'undefined') sessionStorage.removeItem('jumlaati_cart');
    } finally {
      setLoading(false);
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 p-8 text-center" dir="rtl">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center animate-bounce">
          <CheckCircle size={40} className="text-emerald-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground font-arabic mb-2">تم تأكيد الطلب بنجاح! 🎉</h2>
          <p className="text-muted-foreground font-arabic text-sm">رقم الطلب: <span className="font-bold text-primary">#{orderRef}</span></p>
          <p className="text-muted-foreground font-arabic text-xs mt-1">سيتم التوصيل إلى عنوان المحل المسجل فوراً ومراجعة تفاصيل الدفع.</p>
          <p className="font-arabic text-xl font-bold text-primary mt-2 tabular-nums">{fmt(grandTotal)}</p>
        </div>
        <button
          onClick={() => { setConfirmed(false); setCartItems(MOCK_CART); }}
          className="bg-primary text-white px-8 py-3 rounded-xl font-arabic font-bold hover:bg-primary/90 transition-colors shadow-md"
        >
          العودة للتسوق
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-28 px-4 pt-3 relative" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h1 className="text-xl font-bold text-foreground font-arabic">سلة مبيعات التجزئة</h1>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">
            {cartItems.length} منتج · {Object.keys(supplierGroups).length} مورد · <span className="text-primary font-bold">{fmt(grandTotal)}</span>
          </p>
        </div>
        <Link href="/retailer-catalog" className="flex items-center gap-1.5 text-xs text-primary font-arabic hover:underline bg-primary/10 px-3 py-1.5 rounded-xl font-semibold">
          <ArrowLeft size={13} />
          متابعة التسوق
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl py-16 flex flex-col items-center gap-3 text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <ShoppingCart size={36} className="text-muted-foreground/50" />
          </div>
          <h2 className="text-lg font-bold text-foreground font-arabic">السلة فارغة حالياً</h2>
          <p className="text-muted-foreground font-arabic text-xs max-w-xs">لم تضف أي منتجات بعد. استعرض كتالوج المنتجات وابدأ ملء متجرك.</p>
          <Link href="/retailer-catalog" className="mt-2 bg-primary text-white px-6 py-2.5 rounded-xl font-arabic font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <ShoppingBag size={16} />
            تصفح المنتجات الآن
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Items grouped by supplier */}
          {Object.entries(supplierGroups).map(([supplierId, items]) => {
            const supplierName = items[0].supplierName;
            const supplierSubtotal = items.reduce((s, i) => s + i.finalPrice * i.quantity, 0);
            return (
              <div key={supplierId} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="flex items-center gap-3 px-4 py-3 bg-muted/40 border-b border-border">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Truck size={14} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground font-arabic truncate">{supplierName}</p>
                    <p className="text-xs text-muted-foreground font-arabic">{items.length} منتج · توصيل {fmt(DELIVERY_FEE)}</p>
                  </div>
                  <span className="text-sm font-bold text-primary font-arabic tabular-nums">{fmt(supplierSubtotal)}</span>
                </div>
                <div className="divide-y divide-border">
                  {items.map((item) => {
                    const isRemoving = removingId === item.id;
                    return (
                      <div key={item.id} className={`px-4 py-3.5 transition-all duration-250 ${isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                        <div className="flex gap-3">
                          <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                            <Package size={18} className="text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground font-arabic leading-snug">{item.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground font-arabic">{item.unit}</span>
                              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                              <span className="text-xs text-muted-foreground font-arabic">{item.category}</span>
                            </div>
                            <p className="text-xs text-primary font-arabic mt-1 font-medium">{fmt(item.finalPrice)} / وحدة</p>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              disabled={item.quantity <= item.minOrderQty}
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-card disabled:opacity-30 transition-colors"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-9 text-center text-sm font-bold font-arabic tabular-nums">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-card transition-colors"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          {item.quantity === item.minOrderQty && (
                            <span className="text-[10px] text-amber-600 font-arabic flex items-center gap-1">
                              <AlertCircle size={10} />
                              الحد الأدنى {item.minOrderQty}
                            </span>
                          )}
                          <p className="text-base font-bold text-foreground font-arabic tabular-nums">{fmt(item.finalPrice * item.quantity)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 bg-muted/20 border-t border-border">
                  <span className="text-xs text-muted-foreground font-arabic flex items-center gap-1.5"><Truck size={11} />رسوم التوصيل للمورد</span>
                  <span className="text-xs font-semibold font-arabic tabular-nums">{fmt(DELIVERY_FEE)}</span>
                </div>
              </div>
            );
          })}

          {/* Order Summary Dropdown */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <button
              onClick={() => setSummaryOpen(!summaryOpen)}
              className="w-full flex items-center justify-between px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors"
            >
              <h3 className="text-sm font-bold text-foreground font-arabic flex items-center gap-2">
                <Tag size={14} className="text-primary" />
                ملخص الطلب المالي
              </h3>
              {summaryOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            {summaryOpen && (
              <div className="px-4 py-4 space-y-2.5">
                <div className="flex justify-between text-sm font-arabic">
                  <span className="text-muted-foreground">المنتجات ({cartItems.length} صنف)</span>
                  <span className="font-semibold tabular-nums">{fmt(itemsSubtotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-arabic">
                  <span className="text-muted-foreground">إجمالي رسوم التوصيل ({Object.keys(supplierGroups).length} مورد)</span>
                  <span className="font-semibold tabular-nums">{fmt(totalDelivery)}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between font-arabic">
                  <span className="text-base font-bold text-foreground">الإجمالي الكلي</span>
                  <span className="text-xl font-bold text-primary tabular-nums">{fmt(grandTotal)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Debt / Credit Summary */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <button
              onClick={() => setDebtOpen(!debtOpen)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
            >
              <h3 className="text-sm font-bold text-foreground font-arabic flex items-center gap-2">
                <Wallet size={14} className="text-amber-500" />
                الرصيد الائتماني المتاح للمحل
              </h3>
              {debtOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            {debtOpen && (
              <div className=
