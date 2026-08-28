'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Package, Tag, Truck, AlertCircle, RefreshCw, CheckCircle, Wallet, CreditCard, Banknote, ChevronDown, ChevronUp, MapPin, ArrowLeft,  } from 'lucide-react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { orderService } from '@/lib/services/orderService';
import InvoicePrintModal, { type InvoiceData } from '@/components/ui/InvoicePrintModal';


interface CartItem {
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

const fmt = (n: number) => n.toLocaleString('ar-IQ') + ' د.ع';

type Tab = 'cart' | 'checkout';

export default function RetailerOrdersContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('cart');
  const [confirmed, setConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'credit'>('cod');
  const [selectedZone, setSelectedZone] = useState('dz-1');
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [debtOpen, setDebtOpen] = useState(false);
  const [pastOrders, setPastOrders] = useState(PAST_ORDERS);
  const [realtimePulse, setRealtimePulse] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState<InvoiceData | null>(null);
  const [orderSearch, setOrderSearch] = useState('');

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

  // ── Real-time: order status updates for retailer ─────────────────────────────
  useRealtimeSubscription({
    table: 'orders',
    event: 'UPDATE',
    onData: () => {
      setRealtimePulse(true);
      setTimeout(() => setRealtimePulse(false), 1500);
      loadPastOrders();
    },
  });

  // ── Real-time: cart items sync ───────────────────────────────────────────────
  useRealtimeSubscription({
    table: 'cart_items',
    event: '*',
    onData: () => {
      // Sync cart from sessionStorage on external changes
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

  const removeItem = (id: string) => setCartItems((prev) => prev.filter((i) => i.id !== id));

  const reorder = (order: typeof PAST_ORDERS[0]) => {
    setCartItems(MOCK_CART);
    setActiveTab('cart');
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

  const handleConfirmOrder = () => {
    setConfirmed(true);
    if (typeof window !== 'undefined') sessionStorage.removeItem('jumlaati_cart');
  };

  if (confirmed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 p-8 text-center" dir="rtl">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle size={40} className="text-emerald-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground font-arabic mb-2">تم تأكيد الطلب! 🎉</h2>
          <p className="text-muted-foreground font-arabic text-sm">سيتم التواصل معك لتأكيد موعد التوصيل</p>
          <p className="font-arabic text-lg font-bold text-primary mt-2 tabular-nums">{fmt(grandTotal)}</p>
        </div>
        <button
          onClick={() => { setConfirmed(false); setCartItems([]); setActiveTab('cart'); }}
          className="bg-primary text-white px-8 py-3 rounded-xl font-arabic font-bold hover:bg-primary/90 transition-colors"
        >
          طلب جديد
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4" dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground font-arabic">السلة والطلب</h1>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">
            {cartItems.length} منتج · {fmt(grandTotal)}
          </p>
        </div>
        <Link href="/retailer-catalog" className="flex items-center gap-1.5 text-xs text-primary font-arabic hover:underline">
          <ArrowLeft size={13} />
          متابعة التسوق
        </Link>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-muted/30 border border-border rounded-xl p-1">
        {(['cart', 'checkout'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-arabic font-semibold transition-all ${activeTab === tab ? 'bg-card text-primary shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tab === 'cart' ? `🛒 السلة (${cartItems.length})` : '✅ إتمام الطلب'}
          </button>
        ))}
      </div>

      {/* ── CART TAB ── */}
      {activeTab === 'cart' && (
        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <div className="bg-card border border-border rounded-xl py-14 flex flex-col items-center gap-3">
              <ShoppingCart size={40} className="text-muted-foreground/40" />
              <p className="font-arabic text-muted-foreground">السلة فارغة</p>
              <Link href="/retailer-catalog" className="bg-primary text-white px-6 py-2.5 rounded-xl font-arabic font-semibold text-sm hover:bg-primary/90 transition-colors">
                تصفح المنتجات
              </Link>
            </div>
          ) : (
            <>
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
                      {items.map((item) => (
                        <div key={item.id} className="px-4 py-3">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                              <Package size={16} className="text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground font-arabic leading-snug">{item.name}</p>
                              <p className="text-xs text-muted-foreground font-arabic">{item.unit} · {item.category}</p>
                              <p className="text-xs text-primary font-arabic mt-0.5 font-medium">{fmt(item.finalPrice)} / وحدة</p>
                            </div>
                            <button onClick={() => removeItem(item.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0">
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-2.5">
                            <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                              <button onClick={() => updateQty(item.id, -1)} disabled={item.quantity <= item.minOrderQty}
                                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-card disabled:opacity-30 transition-colors">
                                <Minus size={13} />
                              </button>
                              <span className="w-9 text-center text-sm font-bold font-arabic tabular-nums">{item.quantity}</span>
                              <button onClick={() => updateQty(item.id, 1)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-card transition-colors">
                                <Plus size={13} />
                              </button>
                            </div>
                            {item.quantity === item.minOrderQty && (
                              <span className="text-[10px] text-warning font-arabic flex items-center gap-1">
                                <AlertCircle size={10} />
                                الحد الأدنى {item.minOrderQty}
                              </span>
                            )}
                            <p className="text-base font-bold text-foreground font-arabic tabular-nums">{fmt(item.finalPrice * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between px-4 py-2.5 bg-muted/20 border-t border-border">
                      <span className="text-xs text-muted-foreground font-arabic flex items-center gap-1.5"><Truck size={11} />رسوم التوصيل</span>
                      <span className="text-xs font-semibold font-arabic tabular-nums">{fmt(DELIVERY_FEE)}</span>
                    </div>
                  </div>
                );
              })}

              {/* Order Summary */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                <button
                  onClick={() => setSummaryOpen(!summaryOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <h3 className="text-sm font-bold text-foreground font-arabic flex items-center gap-2">
                    <Tag size={14} className="text-primary" />
                    ملخص الطلب
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
                      <span className="text-muted-foreground">رسوم التوصيل ({Object.keys(supplierGroups).length} مورد)</span>
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
                    الرصيد الائتماني
                  </h3>
                  {debtOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
                {debtOpen && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="flex justify-between text-sm font-arabic">
                      <span className="text-muted-foreground">الحد الائتماني</span>
                      <span className="font-semibold tabular-nums">{fmt(CREDIT_LIMIT)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-arabic">
                      <span className="text-muted-foreground">المستخدم</span>
                      <span className="font-semibold text-amber-600 tabular-nums">{fmt(CREDIT_USED)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div className={`h-2 rounded-full transition-all ${creditPct >= 80 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${creditPct}%` }} />
                    </div>
                    <div className="flex justify-between text-sm font-arabic">
                      <span className="text-muted-foreground">المتاح</span>
                      <span className={`font-bold tabular-nums ${creditAvailable > 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(creditAvailable)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Proceed CTA */}
              <button
                onClick={() => setActiveTab('checkout')}
                className="w-full bg-primary text-white py-4 rounded-2xl font-arabic font-bold text-base hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg flex items-center justify-between px-5"
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart size={20} />
                  إتمام الطلب
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-lg tabular-nums text-sm">{fmt(grandTotal)}</span>
              </button>
            </>
          )}

          {/* Past Orders / Reorder */}
          <div>
            <h2 className="font-arabic font-bold text-foreground text-sm flex items-center gap-2 mb-3">
              <RefreshCw size={14} className="text-primary" />
              إعادة طلب سابق
            </h2>
            <div className="space-y-2">
              {pastOrders.map((order) => (
                <div key={order.id} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-arabic text-sm font-semibold text-foreground">{order.id}</p>
                    <p className="font-arabic text-xs text-muted-foreground truncate">{order.items.join(' · ')}</p>
                    <p className="font-arabic text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="text-left flex-shrink-0">
                    <p className="font-arabic text-sm font-bold tabular-nums">{fmt(order.total)}</p>
                    <button
                      onClick={() => reorder(order)}
                      className="text-xs text-primary font-arabic flex items-center gap-1 hover:underline mt-0.5"
                    >
                      <RefreshCw size={10} />
                      إعادة الطلب
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CHECKOUT TAB ── */}
      {activeTab === 'checkout' && (
        <div className="space-y-4">
          {/* Delivery Zone */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <h3 className="font-arabic font-bold text-foreground text-sm flex items-center gap-2">
              <MapPin size={14} className="text-primary" />
              منطقة التوصيل
            </h3>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              <option value="dz-1">المنطقة الخضراء — بغداد (3,000 د.ع)</option>
              <option value="dz-2">الرصافة الشمالية — بغداد (3,500 د.ع)</option>
              <option value="dz-3">الجادرية والدورة — بغداد (4,000 د.ع)</option>
              <option value="dz-4">المدينة الطبية — بغداد (2,500 د.ع)</option>
              <option value="dz-7">الموصل المركز — نينوى (8,000 د.ع)</option>
              <option value="dz-8">البصرة القديمة — البصرة (9,000 د.ع)</option>
            </select>
          </div>

          {/* Payment Method */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <h3 className="font-arabic font-bold text-foreground text-sm flex items-center gap-2">
              <CreditCard size={14} className="text-primary" />
              طريقة الدفع
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'cod', label: 'الدفع عند الاستلام', icon: Banknote, desc: 'نقداً عند التوصيل' },
                { id: 'credit', label: 'الرصيد الائتماني', icon: Wallet, desc: `متاح: ${fmt(creditAvailable)}` },
              ].map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as 'cod' | 'credit')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === method.id ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-arabic text-xs font-semibold">{method.label}</span>
                    <span className="font-arabic text-[10px] text-muted-foreground">{method.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-2.5">
            <h3 className="font-arabic font-bold text-foreground text-sm mb-3">ملخص الطلب</h3>
            <div className="flex justify-between text-sm font-arabic">
              <span className="text-muted-foreground">المنتجات</span>
              <span className="font-semibold tabular-nums">{fmt(itemsSubtotal)}</span>
            </div>
            <div className="flex justify-between text-sm font-arabic">
              <span className="text-muted-foreground">التوصيل</span>
              <span className="font-semibold tabular-nums">{fmt(totalDelivery)}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between font-arabic">
              <span className="text-base font-bold">الإجمالي</span>
              <span className="text-xl font-bold text-primary tabular-nums">{fmt(grandTotal)}</span>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirmOrder}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-arabic font-bold text-base hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-3"
          >
            <CheckCircle size={20} />
            تأكيد الطلب الآن
          </button>

          <button
            onClick={() => setActiveTab('cart')}
            className="w-full text-muted-foreground font-arabic text-sm py-2 hover:text-foreground transition-colors"
          >
            ← العودة للسلة
          </button>
        </div>
      )}
    </div>
  );
}
