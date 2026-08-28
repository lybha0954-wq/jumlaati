'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search, ShoppingCart, Package, Plus, Minus, Trash2,
  Star, Truck, ChevronDown, ArrowUpDown, SlidersHorizontal,
  TrendingDown, CheckCircle2, X, BarChart3, Barcode, Camera,
} from 'lucide-react';
import Link from 'next/link';
import { productService, type Product } from '@/lib/services/productService';
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

/* Group products by name for price comparison */
interface ProductGroup {
  name: string;
  category: string;
  unit: string;
  offers: SupplierProduct[];
  bestPrice: number;
  highestPrice: number;
}

type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'delivery' | 'discount';
type ViewMode = 'grid' | 'compare';

const SORT_LABELS: Record<SortOption, string> = {
  'price-asc': 'السعر: الأقل أولاً',
  'price-desc': 'السعر: الأعلى أولاً',
  'rating': 'التقييم الأعلى',
  'delivery': 'أسرع توصيل',
  'discount': 'أكبر خصم',
};

// ── Product Detail Modal ──────────────────────────────────────────────────────
function ProductDetailModal({ group, onClose, onAddToCart, getCartItem, onUpdateQty }: {
  group: ProductGroup;
  onClose: () => void;
  onAddToCart: (p: SupplierProduct) => void;
  getCartItem: (id: string) => CartItem | undefined;
  onUpdateQty: (id: string, delta: number, min: number) => void;
}) {
  const bestOffer = group.offers.reduce((best, o) => o.finalPrice < best.finalPrice ? o : best, group.offers[0]);
  const [selectedOffer, setSelectedOffer] = useState(bestOffer);
  const cartItem = getCartItem(selectedOffer.id);
  const disc = selectedOffer.originalPrice > selectedOffer.finalPrice
    ? Math.round(((selectedOffer.originalPrice - selectedOffer.finalPrice) / selectedOffer.originalPrice) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} dir="rtl">
      <div className="bg-card w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <h2 className="font-arabic font-bold text-lg text-foreground">تفاصيل المنتج</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Name & category */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-arabic font-bold text-xl text-foreground">{group.name}</h3>
              <span className="inline-block mt-1 text-xs bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 font-arabic">{group.category}</span>
            </div>
            {disc > 0 && <span className="bg-red-100 text-red-600 text-sm font-bold rounded-xl px-2.5 py-1 font-arabic flex-shrink-0">-{disc}%</span>}
          </div>

          {/* Price */}
          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4">
            <div className="flex items-baseline gap-2">
              <span className="font-arabic text-3xl font-bold text-primary tabular-nums">{selectedOffer.finalPrice.toLocaleString('ar-IQ')}</span>
              <span className="font-arabic text-sm text-muted-foreground">د.ع / {group.unit}</span>
            </div>
            {selectedOffer.originalPrice > selectedOffer.finalPrice && (
              <span className="font-arabic text-sm text-muted-foreground line-through tabular-nums">{selectedOffer.originalPrice.toLocaleString('ar-IQ')} د.ع</span>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-[10px] text-muted-foreground font-arabic mb-1">الباركود</p>
              <div className="flex items-center gap-1.5">
                <Barcode size={13} className="text-foreground flex-shrink-0" />
                <p className="font-arabic text-sm font-semibold text-foreground tabular-nums truncate">{selectedOffer.barcode || 'غير محدد'}</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-[10px] text-muted-foreground font-arabic mb-1">الكمية المتاحة</p>
              <p className={`font-arabic text-sm font-bold tabular-nums ${selectedOffer.stock > 20 ? 'text-emerald-600' : selectedOffer.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                {selectedOffer.stock > 0 ? `${selectedOffer.stock} ${group.unit}` : 'نفد'}
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-[10px] text-muted-foreground font-arabic mb-1">تقييم المورد</p>
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={11} className={s <= Math.round(selectedOffer.supplierRating) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'} />
                ))}
                <span className="font-arabic text-xs text-muted-foreground mr-1 tabular-nums">{selectedOffer.supplierRating}</span>
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-[10px] text-muted-foreground font-arabic mb-1">التوصيل</p>
              <p className="font-arabic text-sm font-bold text-foreground">{selectedOffer.deliveryDays} يوم</p>
            </div>
          </div>

          {/* Supplier selector (if multiple) */}
          {group.offers.length > 1 && (
            <div>
              <p className="text-xs font-arabic font-semibold text-muted-foreground mb-2">{group.offers.length} موردين — اختر الأفضل:</p>
              <div className="space-y-2">
                {group.offers.sort((a, b) => a.finalPrice - b.finalPrice).map((offer, idx) => (
                  <button
                    key={offer.id}
                    onClick={() => setSelectedOffer(offer)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all active:scale-[0.98] ${selectedOffer.id === offer.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${idx === 0 ? 'bg-success text-white' : 'bg-muted text-muted-foreground'}`}>{idx + 1}</div>
                    <div className="flex-1 text-right">
                      <p className="font-arabic text-sm font-semibold text-foreground">{offer.supplierName}</p>
                      <div className="flex items-center gap-1">
                        <Star size={10} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs text-muted-foreground tabular-nums">{offer.supplierRating}</span>
                        <span className="text-muted-foreground">·</span>
                        <Truck size={10} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-arabic">{offer.deliveryDays} يوم</span>
                      </div>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <p className="font-arabic font-bold text-base text-foreground tabular-nums">{offer.finalPrice.toLocaleString('ar-IQ')}</p>
                      <p className="text-xs text-muted-foreground font-arabic">د.ع</p>
                    </div>
                    {selectedOffer.id === offer.id && <CheckCircle2 size={16} className="text-primary flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-3 border-t border-border flex-shrink-0">
          {cartItem ? (
            <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3">
              <button onClick={() => onUpdateQty(selectedOffer.id, -selectedOffer.minOrderQty, selectedOffer.minOrderQty)}
                className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center hover:bg-red-50 active:scale-95 transition-all">
                {cartItem.quantity <= selectedOffer.minOrderQty ? <Trash2 size={14} className="text-red-500" /> : <Minus size={14} />}
              </button>
              <div className="text-center">
                <span className="font-arabic text-xl font-bold text-primary tabular-nums">{cartItem.quantity}</span>
                <p className="font-arabic text-xs text-muted-foreground">{group.unit} في السلة</p>
              </div>
              <button onClick={() => onUpdateQty(selectedOffer.id, selectedOffer.minOrderQty, selectedOffer.minOrderQty)}
                className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all">
                <Plus size={14} className="text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { onAddToCart(selectedOffer); onClose(); }}
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

// ── Barcode Scanner Modal ─────────────────────────────────────────────────────
function BarcodeScannerModal({ onClose, onFound, allProducts }: {
  onClose: () => void;
  onFound: (group: ProductGroup) => void;
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
        const group: ProductGroup = {
          name: found.name,
          category: found.category,
          unit: found.unit,
          offers: [found],
          bestPrice: found.finalPrice,
          highestPrice: found.finalPrice,
        };
        onFound(group);
      } else {
        setNotFound(true);
      }
    }, 800);
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
          <div className="bg-gray-900 rounded-2xl h-40 flex flex-col items-center justify-center gap-3 relative overflow-hidden">
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
            {notFound && <p className="text-xs font-arabic text-red-500 flex items-center gap-1"><X size={12} /> لم يتم العثور على منتج</p>}
          </div>
          {allProducts.length > 0 && (
            <button onClick={() => setInput(allProducts[0].barcode || allProducts[0].id)} className="w-full border border-dashed border-primary/40 text-primary rounded-xl py-2.5 font-arabic text-sm font-semibold hover:bg-primary/5 active:scale-95 transition-all">
              تجربة بباركود تجريبي
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductBrowseContent() {
  const { showToast } = useToast();
  const [allProducts, setAllProducts] = useState<SupplierProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('الكل');
  const [supplierFilter, setSupplierFilter] = useState('الكل');
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [cartOpen, setCartOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(999999);
  const [priceRange, setPriceRange] = useState<number>(999999);
  const [selectedGroup, setSelectedGroup] = useState<ProductGroup | null>(null);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      const data = await productService.getAll();
      const shopProducts = data
        .filter((p) => p.status !== 'موقوف' && p.stock > 0)
        .map((p) => ({
          ...p,
          supplierId: p.supplierId ?? '',
          supplierName: p.supplierName ?? 'مورد غير محدد',
          supplierRating: p.supplierRating ?? 4.5,
          deliveryDays: p.deliveryDays ?? 1,
        })) as SupplierProduct[];
      setAllProducts(shopProducts);
      const max = Math.max(...shopProducts.map((p) => p.finalPrice), 0);
      setMaxPrice(max || 999999);
      setPriceRange(max || 999999);
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const categories = useMemo(() => ['الكل', ...Array.from(new Set(allProducts.map((p) => p.category)))], [allProducts]);
  const suppliers = useMemo(() => {
    const map = new Map<string, string>();
    allProducts.forEach((p) => { if (p.supplierId) map.set(p.supplierId, p.supplierName); });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [allProducts]);

  /* Filter products */
  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const matchSearch = !search || p.name.includes(search) || p.barcode.includes(search) || p.category.includes(search);
      const matchCat = categoryFilter === 'الكل' || p.category === categoryFilter;
      const matchSup = supplierFilter === 'الكل' || p.supplierId === supplierFilter;
      const matchPrice = p.finalPrice <= priceRange;
      return matchSearch && matchCat && matchSup && matchPrice;
    });
  }, [allProducts, search, categoryFilter, supplierFilter, priceRange]);

  /* Group by product name for price comparison */
  const productGroups = useMemo((): ProductGroup[] => {
    const groupMap = new Map<string, SupplierProduct[]>();
    filtered.forEach((p) => {
      const key = p.name.trim();
      if (!groupMap.has(key)) groupMap.set(key, []);
      groupMap.get(key)!.push(p);
    });

    const groups: ProductGroup[] = Array.from(groupMap.entries()).map(([name, offers]) => {
      const prices = offers.map((o) => o.finalPrice);
      return {
        name,
        category: offers[0].category,
        unit: offers[0].unit,
        offers,
        bestPrice: Math.min(...prices),
        highestPrice: Math.max(...prices),
      };
    });

    return groups.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.bestPrice - b.bestPrice;
        case 'price-desc': return b.bestPrice - a.bestPrice;
        case 'rating': return Math.max(...b.offers.map((o) => o.supplierRating)) - Math.max(...a.offers.map((o) => o.supplierRating));
        case 'delivery': return Math.min(...a.offers.map((o) => o.deliveryDays)) - Math.min(...b.offers.map((o) => o.deliveryDays));
        case 'discount': {
          const discA = a.offers.reduce((mx, o) => Math.max(mx, o.originalPrice > 0 ? ((o.originalPrice - o.finalPrice) / o.originalPrice) : 0), 0);
          const discB = b.offers.reduce((mx, o) => Math.max(mx, o.originalPrice > 0 ? ((o.originalPrice - o.finalPrice) / o.originalPrice) : 0), 0);
          return discB - discA;
        }
        default: return 0;
      }
    });
  }, [filtered, sortBy]);

  /* Cart helpers */
  const cartTotal = cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const getCartItem = (productId: string) => cart.find((c) => c.id === productId);

  const addToCart = (product: SupplierProduct) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === product.id);
      if (existing) return prev.map((c) => c.id === product.id ? { ...c, quantity: c.quantity + product.minOrderQty } : c);
      return [...prev, { id: product.id, name: product.name, unit: product.unit, finalPrice: product.finalPrice, minOrderQty: product.minOrderQty, quantity: product.minOrderQty, supplierId: product.supplierId, supplierName: product.supplierName }];
    });
    showToast('cart', 'تمت الإضافة للسلة', product.name, 2500);
  };

  const updateQty = (id: string, delta: number, minQty: number) => {
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, quantity: Math.max(minQty, c.quantity + delta) } : c).filter((c) => c.quantity > 0));
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.id !== id));

  const handleCheckout = () => {
    if (typeof window !== 'undefined') sessionStorage.setItem('jumlaati_cart', JSON.stringify(cart));
  };

  const cartBySupplier = cart.reduce<Record<string, CartItem[]>>((acc, item) => {
    if (!acc[item.supplierName]) acc[item.supplierName] = [];
    acc[item.supplierName].push(item);
    return acc;
  }, {});

  const activeFiltersCount = [
    categoryFilter !== 'الكل',
    supplierFilter !== 'الكل',
    priceRange < maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4 pb-4">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">تصفح المنتجات</h1>
          <p className="text-sm text-muted-foreground font-arabic mt-0.5">
            {loading ? 'جاري التحميل...' : `${productGroups.length} منتج — قارن الأسعار بين ${suppliers.length} موردين`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-muted border border-border rounded-lg p-1 gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-xs font-arabic font-medium transition-all ${viewMode === 'grid' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              شبكة
            </button>
            <button
              onClick={() => setViewMode('compare')}
              className={`px-3 py-1.5 rounded-md text-xs font-arabic font-medium transition-all flex items-center gap-1.5 ${viewMode === 'compare' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <BarChart3 size={12} />
              مقارنة
            </button>
          </div>
          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-arabic font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
          >
            <ShoppingCart size={16} />
            <span>السلة</span>
            {cartCount > 0 && (
              <span className="bg-warning text-white text-xs font-bold rounded-full px-1.5 py-0.5 tabular-nums min-w-[20px] text-center">{cartCount}</span>
            )}
            {cartCount > 0 && (
              <span className="font-arabic text-sm font-bold border-r border-white/30 pr-2 mr-0.5 tabular-nums">
                {cartTotal.toLocaleString('ar-IQ')} د.ع
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Search + Sort + Filters ── */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن منتج، باركود، أو فئة..."
              className="w-full bg-muted border border-border rounded-lg pr-9 pl-4 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
            />
          </div>
          {/* Barcode scanner button */}
          <button
            onClick={() => setShowBarcodeModal(true)}
            className="flex items-center gap-1.5 bg-muted border border-border rounded-lg px-3 py-2.5 text-sm font-arabic text-foreground hover:bg-muted/80 hover:text-primary active:scale-95 transition-all"
            title="مسح الباركود"
          >
            <Barcode size={15} />
          </button>
          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => { setSortOpen(!sortOpen); setFiltersOpen(false); }}
              className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2.5 text-sm font-arabic text-foreground hover:bg-muted/80 transition-colors whitespace-nowrap"
            >
              <ArrowUpDown size={14} />
              <span className="hidden sm:inline">{SORT_LABELS[sortBy]}</span>
              <ChevronDown size={12} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
              <div className="absolute left-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-20 min-w-[180px] py-1">
                {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => { setSortBy(key); setSortOpen(false); }}
                    className={`w-full text-right px-4 py-2.5 text-sm font-arabic hover:bg-muted transition-colors flex items-center justify-between gap-2 ${sortBy === key ? 'text-primary font-semibold' : 'text-foreground'}`}
                  >
                    {label}
                    {sortBy === key && <CheckCircle2 size={14} className="text-primary flex-shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Filters toggle */}
          <button
            onClick={() => { setFiltersOpen(!filtersOpen); setSortOpen(false); }}
            className={`relative flex items-center gap-2 border rounded-lg px-3 py-2.5 text-sm font-arabic transition-colors whitespace-nowrap ${filtersOpen || activeFiltersCount > 0 ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-muted border-border text-foreground hover:bg-muted/80'}`}
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">فلاتر</span>
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">{activeFiltersCount}</span>
            )}
          </button>
        </div>

        {/* Expanded filters */}
        {filtersOpen && (
          <div className="border-t border-border pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Category */}
            <div>
              <label className="text-xs font-arabic text-muted-foreground mb-1.5 block">الفئة</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                {categories.map((c) => <option key={`cat-${c}`} value={c}>{c}</option>)}
              </select>
            </div>
            {/* Supplier */}
            <div>
              <label className="text-xs font-arabic text-muted-foreground mb-1.5 block">المورد</label>
              <select
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <option value="الكل">جميع الموردين</option>
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            {/* Price range */}
            <div>
              <label className="text-xs font-arabic text-muted-foreground mb-1.5 block">
                الحد الأقصى للسعر: <span className="text-foreground font-semibold tabular-nums">{priceRange.toLocaleString('ar-IQ')} د.ع</span>
              </label>
              <input
                type="range"
                min={0}
                max={maxPrice}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            {/* Reset */}
            {activeFiltersCount > 0 && (
              <div className="sm:col-span-3 flex justify-end">
                <button
                  onClick={() => { setCategoryFilter('الكل'); setSupplierFilter('الكل'); setPriceRange(maxPrice); }}
                  className="text-xs font-arabic text-muted-foreground hover:text-danger transition-colors flex items-center gap-1"
                >
                  <X size={12} />
                  إعادة ضبط الفلاتر
                </button>
              </div>
            )}
          </div>
        )}

        {/* Category chips */}
        {!filtersOpen && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {categories.map((c) => (
              <button
                key={`chip-${c}`}
                onClick={() => setCategoryFilter(c)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-arabic font-medium transition-all active:scale-95 ${categoryFilter === c ? 'bg-primary text-white shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border'}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && productGroups.length === 0 && (
        <div className="bg-card border border-border rounded-xl py-20 flex flex-col items-center gap-3">
          <Package size={40} className="text-muted-foreground/30" />
          <p className="font-arabic text-muted-foreground font-medium">لا توجد منتجات تطابق البحث</p>
          <button
            onClick={() => { setSearch(''); setCategoryFilter('الكل'); setSupplierFilter('الكل'); setPriceRange(maxPrice); }}
            className="text-sm font-arabic text-primary hover:underline"
          >
            مسح الفلاتر
          </button>
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {!loading && viewMode === 'grid' && productGroups.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {productGroups.map((group) => {
            const bestOffer = group.offers.reduce((best, o) => o.finalPrice < best.finalPrice ? o : best, group.offers[0]);
            const cartItem = getCartItem(bestOffer.id);
            const discount = bestOffer.originalPrice > bestOffer.finalPrice
              ? Math.round(((bestOffer.originalPrice - bestOffer.finalPrice) / bestOffer.originalPrice) * 100)
              : 0;
            const hasMultipleOffers = group.offers.length > 1;
            const priceSaving = group.highestPrice - group.bestPrice;

            return (
              <div
                key={`group-${group.name}`}
                className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 hover:shadow-md hover:border-primary/30 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedGroup(group)}
              >
                {/* Product info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-arabic font-semibold text-sm text-foreground leading-snug line-clamp-2 flex-1">{group.name}</h3>
                    {discount > 0 && (
                      <span className="bg-success/10 text-success text-xs font-bold rounded-lg px-1.5 py-0.5 whitespace-nowrap font-arabic flex-shrink-0">-{discount}%</span>
                    )}
                  </div>
                  <span className="inline-block text-xs bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 font-arabic mb-2">{group.category}</span>

                  {/* Best offer supplier */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <Truck size={11} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-muted-foreground font-arabic truncate">{bestOffer.supplierName}</span>
                    <div className="flex items-center gap-0.5 mr-auto flex-shrink-0">
                      <Star size={10} className="text-warning fill-warning" />
                      <span className="text-xs text-muted-foreground tabular-nums">{bestOffer.supplierRating}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-arabic text-xl font-bold text-primary tabular-nums">{group.bestPrice.toLocaleString('ar-IQ')}</span>
                    <span className="font-arabic text-xs text-muted-foreground">د.ع / {group.unit}</span>
                  </div>
                  {bestOffer.originalPrice > bestOffer.finalPrice && (
                    <span className="font-arabic text-xs text-muted-foreground line-through tabular-nums">{bestOffer.originalPrice.toLocaleString('ar-IQ')} د.ع</span>
                  )}

                  {/* Multi-supplier badge */}
                  {hasMultipleOffers && (
                    <div className="mt-2 flex items-center gap-1.5 bg-primary/5 border border-primary/15 rounded-lg px-2.5 py-1.5">
                      <TrendingDown size={12} className="text-primary flex-shrink-0" />
                      <span className="text-xs font-arabic text-primary font-medium">
                        {group.offers.length} موردين — وفر {priceSaving.toLocaleString('ar-IQ')} د.ع
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground font-arabic mt-1.5">الحد الأدنى: {bestOffer.minOrderQty} {group.unit}</p>
                </div>

                {/* Add to cart */}
                {cartItem ? (
                  <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-2 py-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => updateQty(bestOffer.id, -bestOffer.minOrderQty, bestOffer.minOrderQty)}
                      className="w-7 h-7 rounded-md bg-white border border-border flex items-center justify-center hover:bg-red-50 hover:border-red-200 active:scale-95 transition-all"
                    >
                      {cartItem.quantity <= bestOffer.minOrderQty ? <Trash2 size={12} className="text-red-500" /> : <Minus size={12} className="text-foreground" />}
                    </button>
                    <span className="font-arabic text-sm font-bold text-primary tabular-nums">{cartItem.quantity} {group.unit}</span>
                    <button
                      onClick={() => updateQty(bestOffer.id, bestOffer.minOrderQty, bestOffer.minOrderQty)}
                      className="w-7 h-7 rounded-md bg-primary flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all"
                    >
                      <Plus size={12} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(bestOffer); }}
                    className="w-full bg-primary text-white rounded-lg py-2 font-arabic font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={14} />
                    أضف للسلة
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── COMPARE VIEW ── */}
      {!loading && viewMode === 'compare' && productGroups.length > 0 && (
        <div className="space-y-4">
          {productGroups.map((group) => {
            const sortedOffers = [...group.offers].sort((a, b) => a.finalPrice - b.finalPrice);
            return (
              <div key={`cmp-${group.name}`} className="bg-card border border-border rounded-xl overflow-hidden">
                {/* Group header */}
                <button
                  className="w-full px-4 py-3 border-b border-border flex items-center justify-between gap-3 hover:bg-muted/20 active:bg-muted/30 transition-colors text-right"
                  onClick={() => setSelectedGroup(group)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Package size={16} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-arabic font-semibold text-sm text-foreground">{group.name}</h3>
                      <span className="text-xs text-muted-foreground font-arabic">{group.category} · {group.unit}</span>
                    </div>
                  </div>
                  {group.offers.length > 1 && (
                    <div className="flex items-center gap-1.5 bg-success/10 border border-success/20 rounded-lg px-2.5 py-1">
                      <TrendingDown size={12} className="text-success" />
                      <span className="text-xs font-arabic text-success font-semibold">
                        وفر حتى {(group.highestPrice - group.bestPrice).toLocaleString('ar-IQ')} د.ع
                      </span>
                    </div>
                  )}
                </button>

                {/* Supplier offers */}
                <div className="divide-y divide-border">
                  {sortedOffers.map((offer, idx) => {
                    const cartItem = getCartItem(offer.id);
                    const isBest = offer.finalPrice === group.bestPrice;
                    const discount = offer.originalPrice > offer.finalPrice
                      ? Math.round(((offer.originalPrice - offer.finalPrice) / offer.originalPrice) * 100)
                      : 0;

                    return (
                      <div
                        key={offer.id}
                        className={`flex items-center gap-3 px-4 py-3 transition-colors ${isBest ? 'bg-success/5' : 'hover:bg-muted/30'}`}
                      >
                        {/* Rank */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isBest ? 'bg-success text-white' : 'bg-muted text-muted-foreground'}`}>
                          {idx + 1}
                        </div>

                        {/* Supplier info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-arabic text-sm font-medium text-foreground truncate">{offer.supplierName}</span>
                            {isBest && (
                              <span className="bg-success/10 text-success text-xs font-arabic font-semibold rounded-full px-2 py-0.5 flex-shrink-0">الأفضل سعراً</span>
                            )}
                            {discount > 0 && (
                              <span className="bg-warning/10 text-warning text-xs font-bold rounded-full px-2 py-0.5 flex-shrink-0">-{discount}%</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <div className="flex items-center gap-0.5">
                              <Star size={10} className="text-warning fill-warning" />
                              <span className="text-xs text-muted-foreground tabular-nums">{offer.supplierRating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Truck size={10} className="text-muted-foreground" />
                              <span className="text-xs text-muted-foreground font-arabic">{offer.deliveryDays} يوم</span>
                            </div>
                            <span className="text-xs text-muted-foreground font-arabic">الحد الأدنى: {offer.minOrderQty} {offer.unit}</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                          <div className="font-arabic font-bold text-base tabular-nums text-foreground">{offer.finalPrice.toLocaleString('ar-IQ')}</div>
                          {offer.originalPrice > offer.finalPrice && (
                            <div className="font-arabic text-xs text-muted-foreground line-through tabular-nums">{offer.originalPrice.toLocaleString('ar-IQ')}</div>
                          )}
                          <div className="text-xs text-muted-foreground font-arabic">د.ع</div>
                        </div>

                        {/* Cart control */}
                        <div className="flex-shrink-0">
                          {cartItem ? (
                            <div className="flex items-center gap-1 bg-primary/5 border border-primary/20 rounded-lg px-1.5 py-1">
                              <button
                                onClick={() => updateQty(offer.id, -offer.minOrderQty, offer.minOrderQty)}
                                className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-50 active:scale-95 transition-all"
                              >
                                {cartItem.quantity <= offer.minOrderQty ? <Trash2 size={11} className="text-red-500" /> : <Minus size={11} className="text-foreground" />}
                              </button>
                              <span className="font-arabic text-xs font-bold text-primary tabular-nums px-1">{cartItem.quantity}</span>
                              <button
                                onClick={() => updateQty(offer.id, offer.minOrderQty, offer.minOrderQty)}
                                className="w-6 h-6 rounded bg-primary flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all"
                              >
                                <Plus size={11} className="text-white" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(offer)}
                              className="flex items-center gap-1.5 bg-primary text-white rounded-lg px-3 py-1.5 text-xs font-arabic font-semibold hover:bg-primary/90 active:scale-95 transition-all"
                            >
                              <Plus size={12} />
                              أضف
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Cart Drawer ── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex" dir="rtl">
          <div className="flex-1 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm bg-card shadow-2xl flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-arabic font-bold text-foreground text-lg">السلة ({cartCount})</h2>
              <button onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12">
                  <ShoppingCart size={40} className="text-muted-foreground/40" />
                  <p className="font-arabic text-muted-foreground text-sm">السلة فارغة</p>
                </div>
              ) : (
                Object.entries(cartBySupplier).map(([supplierName, items]) => (
                  <div key={supplierName}>
                    <p className="font-arabic text-xs font-semibold text-muted-foreground mb-2 px-1 flex items-center gap-1.5">
                      <Truck size={11} />
                      {supplierName}
                    </p>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="bg-muted/50 rounded-lg px-3 py-2.5 flex items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-arabic text-sm font-medium text-foreground truncate">{item.name}</p>
                            <p className="font-arabic text-xs text-muted-foreground tabular-nums">{item.finalPrice.toLocaleString('ar-IQ')} د.ع × {item.quantity} {item.unit}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={() => updateQty(item.id, -item.minOrderQty, item.minOrderQty)} className="w-6 h-6 rounded bg-white border border-border flex items-center justify-center hover:bg-red-50 active:scale-95 transition-colors">
                              {item.quantity <= item.minOrderQty ? <Trash2 size={10} className="text-red-500" /> : <Minus size={10} />}
                            </button>
                            <span className="text-xs font-bold tabular-nums w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQty(item.id, item.minOrderQty, item.minOrderQty)} className="w-6 h-6 rounded bg-primary flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-colors">
                              <Plus size={10} className="text-white" />
                            </button>
                          </div>
                          <span className="font-arabic text-sm font-bold text-primary tabular-nums flex-shrink-0">
                            {(item.finalPrice * item.quantity).toLocaleString('ar-IQ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-arabic text-sm text-muted-foreground">الإجمالي</span>
                  <span className="font-arabic text-lg font-bold text-foreground tabular-nums">{cartTotal.toLocaleString('ar-IQ')} د.ع</span>
                </div>
                <Link
                  href="/retailer-checkout"
                  onClick={handleCheckout}
                  className="block w-full bg-primary text-white text-center rounded-xl py-3 font-arabic font-bold text-sm hover:bg-primary/90 active:scale-95 transition-all"
                >
                  إتمام الطلب
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {selectedGroup && (
        <ProductDetailModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
          onAddToCart={addToCart}
          getCartItem={getCartItem}
          onUpdateQty={updateQty}
        />
      )}
      {showBarcodeModal && (
        <BarcodeScannerModal
          onClose={() => setShowBarcodeModal(false)}
          allProducts={allProducts}
          onFound={(group) => { setShowBarcodeModal(false); setSelectedGroup(group); }}
        />
      )}

      {/* Close dropdowns on outside click */}
      {(sortOpen || filtersOpen) && (
        <div className="fixed inset-0 z-10" onClick={() => { setSortOpen(false); }} />
      )}
    </div>
  );
}
