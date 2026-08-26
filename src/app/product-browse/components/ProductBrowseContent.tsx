'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search, ShoppingCart, Package, Plus, Minus, Trash2,
  Star, Truck, ChevronDown, ArrowUpDown, SlidersHorizontal,
  TrendingDown, CheckCircle2, X, BarChart3, Barcode, Camera, MapPin, Store
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

export interface NearbySupplier {
  id: string;
  name: string;
  distance: string;
  rating: number;
  activeProductsCount: number;
}

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
  const bestOffer = group.offers.reduce((best, o) => (o.finalPrice ?? 0) < (best.finalPrice ?? 0) ? o : best, group.offers[0]);
  const [selectedOffer, setSelectedOffer] = useState(bestOffer);
  const cartItem = getCartItem(selectedOffer.id);
  const disc = (selectedOffer.originalPrice ?? 0) > (selectedOffer.finalPrice ?? 0)
    ? Math.round((((selectedOffer.originalPrice ?? 0) - (selectedOffer.finalPrice ?? 0)) / (selectedOffer.originalPrice ?? 1)) * 100) : 0;

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
              <span className="font-arabic text-3xl font-bold text-primary tabular-nums">{(selectedOffer.finalPrice ?? 0).toLocaleString('ar-IQ')}</span>
              <span className="font-arabic text-sm text-muted-foreground">د.ع / {group.unit}</span>
            </div>
            {(selectedOffer.originalPrice ?? 0) > (selectedOffer.finalPrice ?? 0) && (
              <span className="font-arabic text-sm text-muted-foreground line-through tabular-nums">{(selectedOffer.originalPrice ?? 0).toLocaleString('ar-IQ')} د.ع</span>
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
              <p className="text-xs font-arabic font-semibold text-muted-foreground mb-2">{group.offers.length} موردين نشطين — اختر الأفضل:</p>
              <div className="space-y-2">
                {group.offers.sort((a, b) => (a.finalPrice ?? 0) - (b.finalPrice ?? 0)).map((offer, idx) => (
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
                      <p className="font-arabic font-bold text-base text-foreground tabular-nums">{(offer.finalPrice ?? 0).toLocaleString('ar-IQ')}</p>
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
              <button onClick={() => onUpdateQty(selectedOffer.id, -(selectedOffer.minOrderQty ?? 1), selectedOffer.minOrderQty ?? 1)}
                className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center hover:bg-red-50 active:scale-95 transition-all">
                {cartItem.quantity <= (selectedOffer.minOrderQty ?? 1) ? <Trash2 size={14} className="text-red-500" /> : <Minus size={14} />}
              </button>
              <div className="text-center">
                <span className="font-arabic text-xl font-bold text-primary tabular-nums">{cartItem.quantity}</span>
                <p className="font-arabic text-xs text-muted-foreground">{group.unit} في السلة</p>
              </div>
              <button onClick={() => onUpdateQty(selectedOffer.id, selectedOffer.minOrderQty ?? 1, selectedOffer.minOrderQty ?? 1)}
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

  const nearbySuppliers = useMemo((): NearbySupplier[] => {
    const map = new Map<string, { name: string; rating: number; count: number }>();
    allProducts.forEach((p) => {
      if (p.supplierId && p.stock > 0) {
        const current = map.get(p.supplierId) || { name: p.supplierName, rating: p.supplierRating, count: 0 };
        current.count += 1;
        map.set(p.supplierId, current);
      }
    });
    const distances = ['0.8 كم', '1.5 كم', '2.3 كم', '3.1 كم', '4.0 كم'];
    let distIdx = 0;
    return Array.from(map.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      rating: data.rating,
      activeProductsCount: data.count,
      distance: distances[distIdx++ % distances.length],
    }));
  }, [allProducts]);

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const matchSearch = !search || p.name.includes(search) || p.barcode.includes(search) || p.category.includes(search);
      const matchCat = categoryFilter === 'الكل' || p.category === categoryFilter;
      const matchSup = supplierFilter === 'الكل' || p.supplierId === supplierFilter;
      const matchPrice = p.finalPrice <= priceRange;
      return matchSearch && matchCat && matchSup && matchPrice;
    });
  }, [allProducts, search, categoryFilter, supplierFilter, priceRange]);

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
      if (existing) {
        showToast('تم تحديث الكمية في السلة', 'success');
        return prev.map((c) => c.id === product.id ? { ...c, quantity: c.quantity + product.minOrderQty } : c);
      }
      showToast(`تمت إضافة ${product.name} للسلة`, 'success');
      return [...prev, {
        id: product.id,
        name: product.name,
        unit: product.unit,
        finalPrice: product.finalPrice,
        minOrderQty: product.minOrderQty,
        quantity: product.minOrderQty,
        supplierId: product.supplierId,
        supplierName: product.supplierName,
      }];
    });
  };

  const updateQty = (productId: string, delta: number, min: number) => {
    setCart((prev) => {
      return prev.reduce<CartItem[]>((acc, item) => {
        if (item.id !== productId) { acc.push(item); return acc; }
        const newQty = item.quantity + delta;
        if (newQty < min) return acc;
        acc.push({ ...item, quantity: newQty });
        return acc;
      }, []);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.id !== productId));
  };

  const suppliers = useMemo(() => {
    const unique = new Map<string, string>();
    allProducts.forEach((p) => { if (p.supplierId) unique.set(p.supplierId, p.supplierName); });
    return Array.from(unique.entries());
  }, [allProducts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-arabic text-muted-foreground">جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن منتج أو باركود..."
              className="w-full bg-muted rounded-xl pr-9 pl-3 py-2.5 text-sm font-arabic focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button onClick={() => setShowBarcodeModal(true)} className="p-2.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
            <Barcode size={18} />
          </button>
          <button onClick={() => setCartOpen(true)} className="relative p-2.5 rounded-xl bg-primary text-white flex-shrink-0">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">{cartCount}</span>
            )}
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-arabic font-semibold transition-all ${categoryFilter === cat ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort & Filter bar */}
        <div className="flex items-center gap-2 px-4 pb-3">
          <button onClick={() => setSortOpen(!sortOpen)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-xs font-arabic font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <ArrowUpDown size={13} />
            {SORT_LABELS[sortBy]}
            <ChevronDown size={13} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
          </button>
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-xs font-arabic font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <SlidersHorizontal size={13} />
            فلترة
          </button>
          <div className="flex-1" />
          <button onClick={() => setViewMode(viewMode === 'grid' ? 'compare' : 'grid')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-arabic font-semibold transition-colors ${viewMode === 'compare' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
            <BarChart3 size={13} />
            مقارنة
          </button>
        </div>

        {/* Sort dropdown */}
        {sortOpen && (
          <div className="px-4 pb-3">
            <div className="bg-muted rounded-2xl p-2 grid grid-cols-2 gap-1.5">
              {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => { setSortBy(key); setSortOpen(false); }}
                  className={`px-3 py-2 rounded-xl text-xs font-arabic font-semibold transition-all ${sortBy === key ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground hover:bg-background'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters panel */}
        {filtersOpen && (
          <div className="px-4 pb-3 space-y-3">
            <div>
              <p className="text-xs font-arabic font-semibold text-muted-foreground mb-2">المورد</p>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                <button onClick={() => setSupplierFilter('الكل')} className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-arabic font-semibold transition-all ${supplierFilter === 'الكل' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>الكل</button>
                {suppliers.map(([id, name]) => (
                  <button key={id} onClick={() => setSupplierFilter(id)} className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-arabic font-semibold transition-all ${supplierFilter === id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>{name}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-arabic font-semibold text-muted-foreground">الحد الأقصى للسعر</p>
                <span className="text-xs font-arabic font-bold text-primary tabular-nums">{priceRange.toLocaleString('ar-IQ')} د.ع</span>
              </div>
              <input
                type="range"
                min={0}
                max={maxPrice}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* Nearby Suppliers Strip */}
      {nearbySuppliers.length > 0 && (
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={14} className="text-primary" />
            <p className="text-xs font-arabic font-semibold text-foreground">موردون قريبون منك</p>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {nearbySuppliers.slice(0, 5).map((sup) => (
              <button
                key={sup.id}
                onClick={() => { setSupplierFilter(sup.id); setFiltersOpen(false); }}
                className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all min-w-[80px] ${supplierFilter === sup.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/30'}`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Store size={18} className="text-primary" />
                </div>
                <p className="font-arabic text-[10px] font-semibold text-foreground text-center leading-tight line-clamp-2">{sup.name}</p>
                <div className="flex items-center gap-0.5">
                  <Star size={9} className="text-amber-400 fill-amber-400" />
                  <span className="text-[10px] text-muted-foreground tabular-nums">{sup.rating}</span>
                </div>
                <span className="text-[9px] text-primary font-arabic font-semibold">{sup.distance}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="px-4 py-2 flex items-center justify-between">
        <p className="text-xs font-arabic text-muted-foreground">
          {productGroups.length} منتج
          {categoryFilter !== 'الكل' && ` في ${categoryFilter}`}
        </p>
        {(search || categoryFilter !== 'الكل' || supplierFilter !== 'الكل') && (
          <button onClick={() => { setSearch(''); setCategoryFilter('الكل'); setSupplierFilter('الكل'); setPriceRange(maxPrice); }} className="text-xs font-arabic text-primary hover:underline">
            مسح الفلاتر
          </button>
        )}
      </div>

      {/* Product Grid */}
      <div className="px-4 pb-32">
        {productGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Package size={48} className="text-muted-foreground/30" />
            <p className="font-arabic text-muted-foreground text-center">لا توجد منتجات تطابق بحثك</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-3">
            {productGroups.map((group) => {
              const bestOffer = group.offers.reduce((best, o) => o.finalPrice < best.finalPrice ? o : best, group.offers[0]);
              const cartItem = getCartItem(bestOffer.id);
              const disc = bestOffer.originalPrice > bestOffer.finalPrice
                ? Math.round(((bestOffer.originalPrice - bestOffer.finalPrice) / bestOffer.originalPrice) * 100) : 0;

              return (
                <div key={group.name} className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col">
                  <button onClick={() => setSelectedGroup(group)} className="flex-1 p-3 text-right">
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Package size={18} className="text-primary" />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {disc > 0 && <span className="bg-red-100 text-red-600 text-[10px] font-bold rounded-lg px-1.5 py-0.5 font-arabic">-{disc}%</span>}
                        {group.offers.length > 1 && <span className="bg-blue-100 text-blue-600 text-[10px] font-bold rounded-lg px-1.5 py-0.5 font-arabic">{group.offers.length} موردين</span>}
                      </div>
                    </div>
                    <p className="font-arabic font-semibold text-sm text-foreground leading-tight mb-1 line-clamp-2">{group.name}</p>
                    <p className="font-arabic text-[10px] text-muted-foreground mb-2">{group.category}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-arabic font-bold text-base text-primary tabular-nums">{group.bestPrice.toLocaleString('ar-IQ')}</span>
                      <span className="font-arabic text-[10px] text-muted-foreground">د.ع/{group.unit}</span>
                    </div>
                    {group.offers.length > 1 && (
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingDown size={10} className="text-emerald-500" />
                        <span className="font-arabic text-[10px] text-emerald-600">وفّر {(group.highestPrice - group.bestPrice).toLocaleString('ar-IQ')} د.ع</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-1.5">
                      <Star size={10} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] text-muted-foreground tabular-nums">{bestOffer.supplierRating}</span>
                      <span className="text-muted-foreground">·</span>
                      <Truck size={10} className="text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground font-arabic">{bestOffer.deliveryDays} يوم</span>
                    </div>
                  </button>
                  <div className="px-3 pb-3">
                    {cartItem ? (
                      <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-2 py-1.5">
                        <button onClick={() => updateQty(bestOffer.id, -bestOffer.minOrderQty, bestOffer.minOrderQty)} className="w-7 h-7 rounded-lg bg-white border border-border flex items-center justify-center active:scale-95 transition-all">
                          {cartItem.quantity <= bestOffer.minOrderQty ? <Trash2 size={12} className="text-red-500" /> : <Minus size={12} />}
                        </button>
                        <span className="font-arabic text-sm font-bold text-primary tabular-nums">{cartItem.quantity}</span>
                        <button onClick={() => updateQty(bestOffer.id, bestOffer.minOrderQty, bestOffer.minOrderQty)} className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center active:scale-95 transition-all">
                          <Plus size={12} className="text-white" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(bestOffer)} className="w-full bg-primary text-white rounded-xl py-2 font-arabic text-xs font-bold hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-1.5">
                        <Plus size={13} />
                        أضف للسلة
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Compare View */
          <div className="space-y-3">
            {productGroups.filter((g) => g.offers.length > 1).map((group) => (
              <div key={group.name} className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <div>
                    <p className="font-arabic font-bold text-sm text-foreground">{group.name}</p>
                    <p className="font-arabic text-xs text-muted-foreground">{group.category} · {group.unit}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-600 text-xs font-bold rounded-xl px-2.5 py-1 font-arabic">{group.offers.length} موردين</span>
                </div>
                <div className="divide-y divide-border">
                  {group.offers.sort((a, b) => (a.finalPrice ?? 0) - (b.finalPrice ?? 0)).map((offer, idx) => {
                    const cartItem = getCartItem(offer.id);
                    return (
                      <div key={offer.id} className={`flex items-center gap-3 px-4 py-3 ${idx === 0 ? 'bg-emerald-50/50' : ''}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${idx === 0 ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>{idx + 1}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-arabic text-sm font-semibold text-foreground truncate">{offer.supplierName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center gap-0.5">
                              <Star size={9} className="text-amber-400 fill-amber-400" />
                              <span className="text-[10px] text-muted-foreground">{offer.supplierRating}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Truck size={9} className="text-muted-foreground" />
                              <span className="text-[10px] text-muted-foreground font-arabic">{offer.deliveryDays} يوم</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-left flex-shrink-0">
                          <p className="font-arabic font-bold text-sm text-foreground tabular-nums">{(offer.finalPrice ?? 0).toLocaleString('ar-IQ')}</p>
                          <p className="text-[10px] text-muted-foreground font-arabic">د.ع</p>
                        </div>
                        <div className="flex-shrink-0">
                          {cartItem ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => updateQty(offer.id, -offer.minOrderQty, offer.minOrderQty)} className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center active:scale-95 transition-all">
                                {cartItem.quantity <= offer.minOrderQty ? <Trash2 size={10} className="text-red-500" /> : <Minus size={10} />}
                              </button>
                              <span className="font-arabic text-xs font-bold text-primary tabular-nums w-5 text-center">{cartItem.quantity}</span>
                              <button onClick={() => updateQty(offer.id, offer.minOrderQty, offer.minOrderQty)} className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center active:scale-95 transition-all">
                                <Plus size={10} className="text-white" />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => addToCart(offer)} className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center active:scale-95 transition-all">
                              <Plus size={14} className="text-white" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {productGroups.filter((g) => g.offers.length === 1).length > 0 && (
              <p className="text-xs font-arabic text-muted-foreground text-center py-2">
                {productGroups.filter((g) => g.offers.length === 1).length} منتج بمورد واحد فقط (غير معروض في وضع المقارنة)
              </p>
            )}
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" dir="rtl">
          <div className="bg-card w-full max-w-lg rounded-t-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-primary" />
                <h2 className="font-arabic font-bold text-lg text-foreground">سلة المشتريات</h2>
                {cartCount > 0 && <span className="bg-primary text-white text-xs font-bold rounded-full px-2 py-0.5 tabular-nums">{cartCount}</span>}
              </div>
              <button onClick={() => setCartOpen(false)} className="p-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
                <ShoppingCart size={48} className="text-muted-foreground/30" />
                <p className="font-arabic text-muted-foreground">السلة فارغة</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-muted/30 rounded-2xl p-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Package size={18} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-arabic text-sm font-semibold text-foreground truncate">{item.name}</p>
                        <p className="font-arabic text-xs text-muted-foreground">{item.supplierName}</p>
                        <p className="font-arabic text-xs font-bold text-primary tabular-nums">{(item.finalPrice * item.quantity).toLocaleString('ar-IQ')} د.ع</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => updateQty(item.id, -item.minOrderQty, item.minOrderQty)} className="w-7 h-7 rounded-lg bg-white border border-border flex items-center justify-center active:scale-95 transition-all">
                          {item.quantity <= item.minOrderQty ? <Trash2 size={12} className="text-red-500" /> : <Minus size={12} />}
                        </button>
                        <span className="font-arabic text-sm font-bold text-foreground tabular-nums w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.minOrderQty, item.minOrderQty)} className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center active:scale-95 transition-all">
                          <Plus size={12} className="text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 pb-6 pt-3 border-t border-border flex-shrink-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-arabic text-sm text-muted-foreground">الإجمالي</span>
                    <span className="font-arabic text-xl font-bold text-primary tabular-nums">{cartTotal.toLocaleString('ar-IQ')} د.ع</span>
                  </div>
                  <Link href="/retailer-checkout" onClick={() => setCartOpen(false)} className="block w-full bg-primary text-white rounded-2xl py-3.5 font-arabic font-bold text-base text-center hover:bg-primary/90 active:scale-95 transition-all shadow-sm">
                    متابعة الطلب
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedGroup && (
        <ProductDetailModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
          onAddToCart={addToCart}
          getCartItem={getCartItem}
          onUpdateQty={updateQty}
        />
      )}

      {/* Barcode Scanner Modal */}
      {showBarcodeModal && (
        <BarcodeScannerModal
          onClose={() => setShowBarcodeModal(false)}
          onFound={(group) => { setSelectedGroup(group); setShowBarcodeModal(false); }}
          allProducts={allProducts}
        />
      )}
    </div>
  );
}