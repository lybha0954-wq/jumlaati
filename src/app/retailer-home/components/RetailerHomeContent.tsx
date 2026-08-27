'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, ShoppingCart, Package, Plus, Minus, Trash2, Truck, Zap, Bell, Clock, ChevronLeft, Flame, Tag, RefreshCw, Star, Barcode, X, Camera } from 'lucide-react';
import Link from 'next/link';
import { productService, type Product } from '@/lib/services/productService';
import { orderService } from '@/lib/services/orderService';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { useToast } from '@/components/ui/Toast';

export interface CartItem {
  id: string;
  name: string;
  unit: string;
  finalPrice: number;
  minOrderQty: number;
  quantity: number;
  supplierId: string;
  supplierName: string;
}

export interface SupplierProduct extends Product {
  supplierId: string;
  supplierName: string;
  supplierRating: number;
  deliveryDays: number;
}

const QUICK_CATS = ['الكل', 'زيوت', 'حبوب', 'مشروبات', 'مواد أساسية', 'منظفات', 'معلبات'];

const STATUS_MAP: Record<string, { label: string; color: string; dot: string }> = {
  delivered: { label: 'تم التوصيل', color: 'text-emerald-600', dot: 'bg-emerald-500' },
  transit: { label: 'في الطريق', color: 'text-blue-600', dot: 'bg-blue-500' },
  pending: { label: 'قيد المعالجة', color: 'text-amber-600', dot: 'bg-amber-500' },
};

const fmt = (n: number) => n.toLocaleString('ar-IQ') + ' د.ع';

// ── Product Detail Modal ──────────────────────────────────────────────────────
function ProductDetailModal({ product, onClose, onAddToCart, cartItem, onUpdateQty }: {
  product: SupplierProduct;
  onClose: () => void;
  onAddToCart: (p: SupplierProduct) => void;
  cartItem?: CartItem;
  onUpdateQty: (id: string, delta: number, min: number) => void;
}) {
  const disc = product.originalPrice > product.finalPrice
    ? Math.round(((product.originalPrice - product.finalPrice) / product.originalPrice) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} dir="rtl">
      <div className="bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-arabic font-bold text-lg text-foreground">تفاصيل المنتج</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
        </div>
        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Product name & category */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-arabic font-bold text-xl text-foreground leading-snug">{product.name}</h3>
              <span className="inline-block mt-1 text-xs bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 font-arabic">{product.category}</span>
            </div>
            {disc > 0 && (
              <span className="bg-red-100 text-red-600 text-sm font-bold rounded-xl px-2.5 py-1 font-arabic flex-shrink-0">-{disc}%</span>
            )}
          </div>

          {/* Price */}
          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4">
            <div className="flex items-baseline gap-2">
              <span className="font-arabic text-3xl font-bold text-primary tabular-nums">{product.finalPrice.toLocaleString('ar-IQ')}</span>
              <span className="font-arabic text-sm text-muted-foreground">د.ع / {product.unit}</span>
            </div>
            {product.originalPrice > product.finalPrice && (
              <span className="font-arabic text-sm text-muted-foreground line-through tabular-nums">{product.originalPrice.toLocaleString('ar-IQ')} د.ع</span>
            )}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-[10px] text-muted-foreground font-arabic mb-1">الباركود</p>
              <div className="flex items-center gap-1.5">
                <Barcode size={14} className="text-foreground flex-shrink-0" />
                <p className="font-arabic text-sm font-semibold text-foreground tabular-nums truncate">{product.barcode || 'غير محدد'}</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-[10px] text-muted-foreground font-arabic mb-1">الكمية المتاحة</p>
              <p className={`font-arabic text-sm font-bold tabular-nums ${product.stock > 20 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} ${product.unit}` : 'نفد المخزون'}
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-[10px] text-muted-foreground font-arabic mb-1">اسم المورد</p>
              <div className="flex items-center gap-1.5">
                <Truck size={12} className="text-muted-foreground flex-shrink-0" />
                <p className="font-arabic text-sm font-semibold text-foreground truncate">{product.supplierName}</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-[10px] text-muted-foreground font-arabic mb-1">تقييم المورد</p>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={12} className={s <= Math.round(product.supplierRating) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'} />
                ))}
                <span className="font-arabic text-xs text-muted-foreground mr-1 tabular-nums">{product.supplierRating}</span>
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-[10px] text-muted-foreground font-arabic mb-1">الحد الأدنى للطلب</p>
              <p className="font-arabic text-sm font-bold text-foreground tabular-nums">{product.minOrderQty} {product.unit}</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-[10px] text-muted-foreground font-arabic mb-1">التوصيل</p>
              <p className="font-arabic text-sm font-bold text-foreground">{product.deliveryDays} يوم</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          {cartItem ? (
            <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3">
              <button onClick={() => onUpdateQty(product.id, -product.minOrderQty, product.minOrderQty)}
                className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center hover:bg-red-50 active:scale-95 transition-all">
                {cartItem.quantity <= product.minOrderQty ? <Trash2 size={14} className="text-red-500" /> : <Minus size={14} />}
              </button>
              <div className="text-center">
                <span className="font-arabic text-xl font-bold text-primary tabular-nums">{cartItem.quantity}</span>
                <p className="font-arabic text-xs text-muted-foreground">{product.unit} في السلة</p>
              </div>
              <button onClick={() => onUpdateQty(product.id, product.minOrderQty, product.minOrderQty)}
                className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all">
                <Plus size={14} className="text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { onAddToCart(product); onClose(); }}
              className="w-full bg-primary text-white rounded-2xl py-3.5 font-arabic font-bold text-base hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <ShoppingCart size={18} />
              إضافة للسلة
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Offer Banner Modal ────────────────────────────────────────────────────────
function OfferBannerModal({ deals, onClose, onAddToCart, getCartItem, onUpdateQty }: {
  deals: SupplierProduct[];
  onClose: () => void;
  onAddToCart: (p: SupplierProduct) => void;
  getCartItem: (id: string) => CartItem | undefined;
  onUpdateQty: (id: string, delta: number, min: number) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} dir="rtl">
      <div className="bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="bg-gradient-to-l from-orange-500 to-red-500 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-yellow-300" />
            <h2 className="font-arabic font-bold text-white text-lg">عروض اليوم الحصرية</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {deals.map((p) => {
            const disc = Math.round(((p.originalPrice - p.finalPrice) / p.originalPrice) * 100);
            const cartItem = getCartItem(p.id);
            return (
              <div key={p.id} className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm font-arabic">-{disc}%</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-arabic font-bold text-sm text-foreground leading-snug">{p.name}</p>
                  <p className="font-arabic text-xs text-muted-foreground">{p.supplierName}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-arabic text-base font-bold text-primary tabular-nums">{p.finalPrice.toLocaleString('ar-IQ')}</span>
                    <span className="font-arabic text-xs text-muted-foreground line-through tabular-nums">{p.originalPrice.toLocaleString('ar-IQ')}</span>
                    <span className="font-arabic text-xs text-muted-foreground">د.ع</span>
                  </div>
                </div>
                {cartItem ? (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => onUpdateQty(p.id, -p.minOrderQty, p.minOrderQty)} className="w-7 h-7 rounded-lg bg-white border border-border flex items-center justify-center active:scale-95 transition-all">
                      <Minus size={11} />
                    </button>
                    <span className="font-arabic text-sm font-bold text-primary tabular-nums w-6 text-center">{cartItem.quantity}</span>
                    <button onClick={() => onUpdateQty(p.id, p.minOrderQty, p.minOrderQty)} className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center active:scale-95 transition-all">
                      <Plus size={11} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => onAddToCart(p)} className="flex-shrink-0 bg-primary text-white rounded-xl px-3 py-2 font-arabic text-xs font-semibold active:scale-95 transition-all">
                    أضف
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Barcode Scanner Modal ─────────────────────────────────────────────────────
function BarcodeScannerModal({ onClose, onFound, allProducts }: {
  onClose: () => void;
  onFound: (product: SupplierProduct) => void;
  allProducts: SupplierProduct[];
}) {
  const [input, setInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    if (!input.trim()) return;
    setScanning(true);
    setNotFound(false);
    setTimeout(() => {
      const found = allProducts.find((p) => p.barcode === input.trim() || p.id === input.trim());
      setScanning(false);
      if (found) {
        onFound(found);
      } else {
        setNotFound(true);
      }
    }, 800);
  };

  const handleDemo = () => {
    if (allProducts.length > 0) {
      setInput(allProducts[0].barcode || allProducts[0].id);
    } else {
      setInput('6281000123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} dir="rtl">
      <div className="bg-card w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Barcode size={18} className="text-primary" />
            <h2 className="font-arabic font-bold text-lg text-foreground">مسح الباركود</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* Camera viewfinder */}
          <div className="bg-gray-900 rounded-2xl h-40 flex flex-col items-center justify-center gap-3 relative overflow-hidden">
            <div className="absolute inset-4 border-2 border-white/30 rounded-xl" />
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg" />
            {scanning ? (
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Camera size={32} className="text-white/50" />
                <p className="text-white/50 text-xs font-arabic">وجّه الكاميرا نحو الباركود</p>
              </>
            )}
          </div>

          {/* Manual input */}
          <div className="space-y-2">
            <p className="text-xs font-arabic text-muted-foreground">أو أدخل رقم الباركود يدوياً:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value); setNotFound(false); }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="مثال: 6281000123"
                className="flex-1 border border-border rounded-xl px-3 py-2.5 text-sm font-arabic focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <button onClick={handleSearch} disabled={scanning} className="bg-primary text-white rounded-xl px-4 py-2.5 font-arabic text-sm font-semibold active:scale-95 transition-all disabled:opacity-50">
                بحث
              </button>
            </div>
            {notFound && (
              <p className="text-xs font-arabic text-red-500 flex items-center gap-1">
                <X size={12} /> لم يتم العثور على منتج بهذا الباركود
              </p>
            )}
          </div>

          <button onClick={handleDemo} className="w-full border border-dashed border-primary/40 text-primary rounded-xl py-2.5 font-arabic text-sm font-semibold hover:bg-primary/5 active:scale-95 transition-all">
            تجربة بباركود تجريبي
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Order Detail Modal ────────────────────────────────────────────────────────
function OrderDetailModal({ order, onClose, onReorder }: {
  order: { id: string; supplier: string; total: number; status: string; date: string };
  onClose: () => void;
  onReorder: () => void;
}) {
  const st = STATUS_MAP[order.status] || STATUS_MAP.pending;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} dir="rtl">
      <div className="bg-card w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-arabic font-bold text-lg text-foreground">تفاصيل الطلب</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-arabic font-bold text-foreground text-lg">{order.id}</span>
            <span className={`flex items-center gap-1.5 text-sm font-arabic font-semibold ${st.color}`}>
              <span className={`w-2 h-2 rounded-full ${st.dot}`} />
              {st.label}
            </span>
          </div>
          <div className="bg-muted/50 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="font-arabic text-sm text-muted-foreground">المورد</span>
              <span className="font-arabic text-sm font-semibold text-foreground">{order.supplier}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-arabic text-sm text-muted-foreground">التاريخ</span>
              <span className="font-arabic text-sm font-semibold text-foreground">{order.date}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <span className="font-arabic text-sm font-bold text-foreground">الإجمالي</span>
              <span className="font-arabic text-base font-bold text-primary tabular-nums">{fmt(order.total)}</span>
            </div>
          </div>
          <button onClick={() => { onReorder(); onClose(); }}
            className="w-full bg-primary text-white rounded-2xl py-3.5 font-arabic font-bold text-base hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2">
            <RefreshCw size={16} />
            إعادة الطلب
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RetailerHomeContent() {
  const { showToast } = useToast();
  const [allProducts, setAllProducts] = useState<SupplierProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('الكل');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentOrders, setRecentOrders] = useState([
    { id: 'ORD-1041', supplier: 'مورد الخير', total: 315000, status: 'delivered', date: 'اليوم' },
    { id: 'ORD-1040', supplier: 'النهرين للتوزيع', total: 182000, status: 'transit', date: 'أمس' },
    { id: 'ORD-1039', supplier: 'الفرات التجارية', total: 97000, status: 'pending', date: 'منذ يومين' },
  ]);
  const [realtimePulse, setRealtimePulse] = useState(false);

  // ── Modal states ──────────────────────────────────────────────────────────────
  const [selectedProduct, setSelectedProduct] = useState<SupplierProduct | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<typeof recentOrders[0] | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      const data = await productService.getAll();
      const products = data
        .filter((p) => p.status !== 'موقوف' && p.stock > 0)
        .map((p) => ({
          ...p,
          supplierId: p.supplierId ?? '',
          supplierName: p.supplierName ?? 'مورد',
          supplierRating: p.supplierRating ?? 4.5,
          deliveryDays: p.deliveryDays ?? 1,
        })) as SupplierProduct[];
      setAllProducts(products);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      const orders = await orderService.getAll?.();
      if (orders && orders.length > 0) {
        const mapped = orders.slice(0, 3).map((o: any) => ({
          id: o.orderNumber || o.id,
          supplier: o.buyerStoreName || o.buyer_store_name || 'مورد',
          total: Number(o.total) || 0,
          status: o.status === 'delivered' ? 'delivered' : o.status === 'shipped' ? 'transit' : 'pending',
          date: 'الآن',
        }));
        setRecentOrders(mapped);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, [loadProducts, loadOrders]);

  useRealtimeSubscription({ table: 'products', event: '*', onData: () => { setRealtimePulse(true); setTimeout(() => setRealtimePulse(false), 1500); loadProducts(); } });
  useRealtimeSubscription({ table: 'orders', event: 'UPDATE', onData: () => { loadOrders(); } });
  useRealtimeSubscription({ table: 'orders', event: 'INSERT', onData: () => { loadOrders(); } });

  const deals = useMemo(() => allProducts.filter((p) => p.originalPrice > p.finalPrice).slice(0, 8), [allProducts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const results = allProducts.filter((p) => {
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.supplierName || '').toLowerCase().includes(q) || (p.barcode || '').includes(q);
      const matchCat = activeCat === 'الكل' || p.category === activeCat;
      return matchSearch && matchCat;
    });
    // Show all when searching, limit to 12 when browsing
    return q ? results : results.slice(0, 12);
  }, [allProducts, search, activeCat]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.finalPrice * i.quantity, 0);
  const getCartItem = (id: string) => cart.find((c) => c.id === id);

  const addToCart = (product: SupplierProduct) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.id === product.id);
      if (ex) return prev.map((c) => c.id === product.id ? { ...c, quantity: c.quantity + product.minOrderQty } : c);
      return [...prev, { id: product.id, name: product.name, unit: product.unit, finalPrice: product.finalPrice, minOrderQty: product.minOrderQty, quantity: product.minOrderQty, supplierId: product.supplierId, supplierName: product.supplierName }];
    });
    showToast('cart', `تمت الإضافة للسلة`, product.name, 2500);
  };

  const updateQty = (id: string, delta: number, minQty: number) => {
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, quantity: Math.max(minQty, c.quantity + delta) } : c));
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.id !== id));

  const handleCheckout = () => {
    if (typeof window !== 'undefined') sessionStorage.setItem('jumlaati_cart', JSON.stringify(cart));
  };

  const discountPct = (p: SupplierProduct) =>
    p.originalPrice > p.finalPrice ? Math.round(((p.originalPrice - p.finalPrice) / p.originalPrice) * 100) : 0;

  const handleReorder = () => {
    showToast('order', 'تمت إعادة الطلب', 'سيتم إرسال الطلب للمورد قريباً', 3000);
  };

  return (
    <div className="space-y-5 pb-4" dir="rtl">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-arabic">مرحباً بك 👋</p>
          <h1 className="text-xl font-bold text-foreground font-arabic leading-tight">الرئيسية</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCartOpen(true)}
            className="relative w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 active:scale-95 transition-all"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] min-h-[18px] flex items-center justify-center px-1 tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
          <button className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-95 transition-all">
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* ── Live Search ── */}
      <div className={`relative transition-all duration-200 ${searchFocused ? 'ring-2 ring-primary/30 rounded-xl' : ''}`}>
        <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="بحث فوري: منتج، مورد، فئة، باركود..."
          className="w-full bg-card border border-border rounded-xl pr-10 pl-12 py-3 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none transition-all shadow-sm"
        />
        <button
          onClick={() => setShowBarcodeModal(true)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 active:scale-95 transition-all"
          title="مسح الباركود"
        >
          <Barcode size={14} />
        </button>
        {search && (
          <button onClick={() => setSearch('')} className="absolute left-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">✕</button>
        )}
      </div>
      {/* Search result count */}
      {search.trim() && (
        <p className="text-xs text-muted-foreground font-arabic -mt-2">
          {filtered.length > 0 ? `${filtered.length} نتيجة لـ "${search}"` : `لا توجد نتائج لـ "${search}"`}
        </p>
      )}

      {/* ── Quick Category Chips ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {QUICK_CATS.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-arabic font-semibold transition-all active:scale-95 ${
              activeCat === cat ? 'bg-primary text-white shadow-sm' : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Daily Deals Banner — clickable ── */}
      {deals.length > 0 && (
        <button
          onClick={() => setShowOfferModal(true)}
          className="w-full text-right bg-gradient-to-l from-orange-500 to-red-500 rounded-2xl p-4 text-white overflow-hidden relative active:scale-[0.98] transition-all hover:shadow-lg"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={18} className="text-yellow-300" />
              <span className="font-arabic font-bold text-sm">عروض اليوم</span>
              <span className="bg-white/20 text-white text-xs font-arabic px-2 py-0.5 rounded-full">{deals.length} منتج</span>
              <span className="mr-auto text-white/70 text-xs font-arabic">اضغط للتفاصيل ←</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {deals.slice(0, 4).map((p) => (
                <div key={p.id} className="flex-shrink-0 bg-white/15 backdrop-blur-sm rounded-xl p-3 min-w-[140px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded-md px-1.5 py-0.5 font-arabic">-{discountPct(p)}%</span>
                    <Tag size={12} className="text-white/70" />
                  </div>
                  <p className="font-arabic text-xs font-semibold text-white leading-snug line-clamp-2 mb-1.5">{p.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-arabic text-sm font-bold tabular-nums">{p.finalPrice.toLocaleString('ar-IQ')}</span>
                    <span className="font-arabic text-[10px] text-white/70">د.ع</span>
                  </div>
                  <span className="font-arabic text-[10px] text-white/60 line-through tabular-nums">{p.originalPrice.toLocaleString('ar-IQ')}</span>
                </div>
              ))}
            </div>
          </div>
        </button>
      )}

      {/* ── Recent Orders — clickable ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-arabic font-bold text-foreground text-sm flex items-center gap-2">
            <Clock size={15} className="text-primary" />
            آخر الطلبات
          </h2>
          <Link href="/retailer-orders" className="text-xs text-primary font-arabic flex items-center gap-1 hover:underline">
            عرض الكل <ChevronLeft size={12} />
          </Link>
        </div>
        <div className="space-y-2">
          {recentOrders.map((order) => {
            const st = STATUS_MAP[order.status];
            return (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="w-full text-right bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3 hover:border-primary/30 hover:shadow-sm active:scale-[0.98] transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-arabic text-sm font-semibold text-foreground">{order.id}</span>
                    <span className={`flex items-center gap-1 text-[10px] font-arabic ${st.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </div>
                  <p className="font-arabic text-xs text-muted-foreground truncate">{order.supplier} · {order.date}</p>
                </div>
                <div className="text-left flex-shrink-0">
                  <p className="font-arabic text-sm font-bold text-foreground tabular-nums">{fmt(order.total)}</p>
                  <span className="text-[10px] text-primary font-arabic flex items-center gap-0.5 mt-0.5">
                    <RefreshCw size={10} />
                    إعادة الطلب
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Latest Products — clickable cards ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-arabic font-bold text-foreground text-sm flex items-center gap-2">
            <Zap size={15} className="text-primary" />
            {search || activeCat !== 'الكل' ? 'نتائج البحث' : 'أحدث المنتجات'}
          </h2>
          <Link href="/retailer-catalog" className="text-xs text-primary font-arabic flex items-center gap-1 hover:underline">
            عرض الكل <ChevronLeft size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 h-36 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-xl py-10 flex flex-col items-center gap-2">
            <Package size={32} className="text-muted-foreground/40" />
            <p className="font-arabic text-muted-foreground text-sm">لا توجد منتجات</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => {
              const cartItem = getCartItem(product.id);
              const disc = discountPct(product);
              return (
                <div
                  key={product.id}
                  className="bg-card border border-border rounded-xl p-3 flex flex-col gap-2 hover:border-primary/30 hover:shadow-md active:scale-[0.97] transition-all cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-arabic font-semibold text-xs text-foreground leading-snug line-clamp-2 flex-1">{product.name}</h3>
                    {disc > 0 && (
                      <span className="bg-red-100 text-red-600 text-[10px] font-bold rounded-md px-1 py-0.5 flex-shrink-0 font-arabic">-{disc}%</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck size={10} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-[10px] text-muted-foreground font-arabic truncate">{product.supplierName}</span>
                  </div>
                  <div>
                    <span className="font-arabic text-base font-bold text-primary tabular-nums">{product.finalPrice.toLocaleString('ar-IQ')}</span>
                    <span className="font-arabic text-[10px] text-muted-foreground"> د.ع/{product.unit}</span>
                  </div>
                  {cartItem ? (
                    <div
                      className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-2 py-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button onClick={() => updateQty(product.id, -product.minOrderQty, product.minOrderQty)}
                        className="w-6 h-6 rounded-md bg-white border border-border flex items-center justify-center hover:bg-red-50 active:scale-95 transition-all">
                        {cartItem.quantity <= product.minOrderQty ? <Trash2 size={10} className="text-red-500" /> : <Minus size={10} />}
                      </button>
                      <span className="font-arabic text-xs font-bold text-primary tabular-nums">{cartItem.quantity}</span>
                      <button onClick={() => updateQty(product.id, product.minOrderQty, product.minOrderQty)}
                        className="w-6 h-6 rounded-md bg-primary flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all">
                        <Plus size={10} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      className="w-full bg-primary text-white rounded-lg py-1.5 font-arabic font-semibold text-xs hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus size={12} />
                      أضف للسلة
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Cart Drawer ── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex" dir="rtl">
          <div className="flex-1 bg-black/50" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm bg-card shadow-2xl flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-arabic font-bold text-foreground text-lg">السلة ({cartCount})</h2>
              <button onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12">
                  <ShoppingCart size={40} className="text-muted-foreground/40" />
                  <p className="font-arabic text-muted-foreground text-sm">السلة فارغة</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-arabic text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="font-arabic text-xs text-muted-foreground tabular-nums">{fmt(item.finalPrice)} / {item.unit}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => updateQty(item.id, -item.minOrderQty, item.minOrderQty)}
                        className="w-6 h-6 rounded-md bg-white border border-border flex items-center justify-center hover:bg-red-50 active:scale-95 transition-all">
                        {item.quantity <= item.minOrderQty ? <Trash2 size={10} className="text-red-500" /> : <Minus size={10} />}
                      </button>
                      <span className="font-arabic text-xs font-bold tabular-nums w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.minOrderQty, item.minOrderQty)}
                        className="w-6 h-6 rounded-md bg-primary flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all">
                        <Plus size={10} className="text-white" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t border-border p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-arabic text-sm text-muted-foreground">الإجمالي</span>
                  <span className="font-arabic font-bold text-foreground tabular-nums">{fmt(cartTotal)}</span>
                </div>
                <Link href="/retailer-orders" onClick={handleCheckout}
                  className="block w-full text-center bg-primary text-white rounded-xl py-3 font-arabic font-bold text-sm hover:bg-primary/90 active:scale-95 transition-all">
                  إتمام الطلب ←
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          cartItem={getCartItem(selectedProduct.id)}
          onUpdateQty={updateQty}
        />
      )}
      {showOfferModal && (
        <OfferBannerModal
          deals={deals}
          onClose={() => setShowOfferModal(false)}
          onAddToCart={addToCart}
          getCartItem={getCartItem}
          onUpdateQty={updateQty}
        />
      )}
      {showBarcodeModal && (
        <BarcodeScannerModal
          onClose={() => setShowBarcodeModal(false)}
          allProducts={allProducts}
          onFound={(product) => {
            setShowBarcodeModal(false);
            setSelectedProduct(product);
          }}
        />
      )}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onReorder={handleReorder}
        />
      )}
    </div>
  );
}
