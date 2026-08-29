'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search, ShoppingCart, Package, Plus, Minus, Trash2,
  Star, Truck, SlidersHorizontal, Tag, TrendingDown, X,
  ChevronDown, CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { productService, type Product } from '@/lib/services/productService';

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

type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'discount';

const SORT_LABELS: Record<SortOption, string> = {
  'price-asc': 'الأقل سعراً',
  'price-desc': 'الأعلى سعراً',
  'rating': 'الأعلى تقييماً',
  'discount': 'أكبر خصم',
};

const fmt = (n: number) => n.toLocaleString('ar-IQ') + ' د.ع';

export default function RetailerCatalogContent() {
  const [allProducts, setAllProducts] = useState<SupplierProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('الكل');
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [showDealsOnly, setShowDealsOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

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

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const categories = useMemo(() => ['الكل', ...Array.from(new Set(allProducts.map((p) => p.category)))], [allProducts]);
  const dealsCount = useMemo(() => allProducts.filter((p) => p.originalPrice > p.finalPrice).length, [allProducts]);

  const filtered = useMemo(() => {
    let list = allProducts.filter((p) => {
      const matchSearch = !search || p.name.includes(search) || p.category.includes(search);
      const matchCat = activeCat === 'الكل' || p.category === activeCat;
      const matchDeals = !showDealsOnly || p.originalPrice > p.finalPrice;
      return matchSearch && matchCat && matchDeals;
    });

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.finalPrice - b.finalPrice;
        case 'price-desc': return b.finalPrice - a.finalPrice;
        case 'rating': return b.supplierRating - a.supplierRating;
        case 'discount': {
          const dA = a.originalPrice > 0 ? (a.originalPrice - a.finalPrice) / a.originalPrice : 0;
          const dB = b.originalPrice > 0 ? (b.originalPrice - b.finalPrice) / b.originalPrice : 0;
          return dB - dA;
        }
        default: return 0;
      }
    });
    return list;
  }, [allProducts, search, activeCat, sortBy, showDealsOnly]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.finalPrice * i.quantity, 0);
  const getCartItem = (id: string) => cart.find((c) => c.id === id);

  const addToCart = (product: SupplierProduct) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.id === product.id);
      if (ex) return prev.map((c) => c.id === product.id ? { ...c, quantity: c.quantity + product.minOrderQty } : c);
      return [...prev, {
        id: product.id, name: product.name, unit: product.unit,
        finalPrice: product.finalPrice, minOrderQty: product.minOrderQty,
        quantity: product.minOrderQty, supplierId: product.supplierId, supplierName: product.supplierName,
      }];
    });
  };

  const updateQty = (id: string, delta: number, minQty: number) => {
    setCart((prev) =>
      prev.map((c) => c.id === id ? { ...c, quantity: Math.max(minQty, c.quantity + delta) } : c)
    );
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.id !== id));

  const handleCheckout = () => {
    if (typeof window !== 'undefined') sessionStorage.setItem('jumlaati_cart', JSON.stringify(cart));
  };

  const discountPct = (p: SupplierProduct) =>
    p.originalPrice > p.finalPrice ? Math.round(((p.originalPrice - p.finalPrice) / p.originalPrice) * 100) : 0;

  const activeFilters = [activeCat !== 'الكل', showDealsOnly].filter(Boolean).length;

  return (
    <div className="space-y-4 pb-4" dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground font-arabic">الأقسام والمنتجات</h1>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">
            {loading ? 'جاري التحميل...' : `${filtered.length} منتج متاح`}
          </p>
        </div>
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-xl font-arabic font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all"
        >
          <ShoppingCart size={16} />
          {cartCount > 0 && (
            <span className="bg-white/20 text-white text-xs font-bold rounded-full px-1.5 tabular-nums">{cartCount}</span>
          )}
          {cartCount > 0 && <span className="tabular-nums text-xs">{fmt(cartTotal)}</span>}
          {cartCount === 0 && <span>السلة</span>}
        </button>
      </div>

      {/* ── Search + Filter Row ── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="w-full bg-card border border-border rounded-xl pr-9 pl-4 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
          />
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`relative flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-arabic font-medium transition-all ${filtersOpen || activeFilters > 0 ? 'bg-primary text-white border-primary' : 'bg-card border-border text-muted-foreground hover:text-foreground'}`}
        >
          <SlidersHorizontal size={15} />
          فلتر
          {activeFilters > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{activeFilters}</span>
          )}
        </button>
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border bg-card text-sm font-arabic font-medium text-muted-foreground hover:text-foreground transition-all"
          >
            <ChevronDown size={15} />
            ترتيب
          </button>
          {sortOpen && (
            <div className="absolute left-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-20 min-w-[160px] overflow-hidden">
              {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => { setSortBy(key); setSortOpen(false); }}
                  className={`w-full text-right px-4 py-2.5 text-sm font-arabic flex items-center gap-2 hover:bg-muted/50 transition-colors ${sortBy === key ? 'text-primary font-semibold' : 'text-foreground'}`}
                >
                  {sortBy === key && <CheckCircle2 size={14} className="text-primary flex-shrink-0" />}
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Filters Panel ── */}
      {filtersOpen && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          {/* Deals toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown size={15} className="text-red-500" />
              <span className="font-arabic text-sm font-semibold text-foreground">العروض والخصومات فقط</span>
              <span className="bg-red-100 text-red-600 text-xs font-arabic px-2 py-0.5 rounded-full">{dealsCount}</span>
            </div>
            <button
              onClick={() => setShowDealsOnly(!showDealsOnly)}
              className={`relative w-11 h-6 rounded-full transition-colors ${showDealsOnly ? 'bg-primary' : 'bg-muted'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${showDealsOnly ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          {/* Category filter */}
          <div>
            <p className="font-arabic text-xs font-semibold text-muted-foreground mb-2">الفئة</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-arabic font-medium transition-all ${activeCat === cat ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          {activeFilters > 0 && (
            <button
              onClick={() => { setActiveCat('الكل'); setShowDealsOnly(false); }}
              className="text-xs text-red-500 font-arabic flex items-center gap-1 hover:underline"
            >
              <X size={12} />
              مسح الفلاتر
            </button>
          )}
        </div>
      )}

      {/* ── Deals Promo Strip ── */}
      {showDealsOnly && (
        <div className="bg-gradient-to-l from-red-50 to-orange-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <Tag size={18} className="text-red-500 flex-shrink-0" />
          <div className="font-arabic">
            <p className="text-sm font-bold text-red-700">عرض المنتجات المخفضة</p>
            <p className="text-xs text-red-500">{filtered.length} منتج بخصومات حصرية</p>
          </div>
        </div>
      )}

      {/* ── Category Chips (horizontal scroll) ── */}
      {!filtersOpen && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-arabic font-semibold transition-all ${
                activeCat === cat ? 'bg-primary text-white shadow-sm' : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* ── Product Grid ── */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 h-44 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl py-14 flex flex-col items-center gap-3">
          <Package size={36} className="text-muted-foreground/40" />
          <p className="font-arabic text-muted-foreground">لا توجد منتجات تطابق الفلتر</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((product) => {
            const cartItem = getCartItem(product.id);
            const disc = discountPct(product);
            return (
              <div key={product.id} className="bg-card border border-border rounded-xl p-3 flex flex-col gap-2 hover:border-primary/30 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-1">
                  <h3 className="font-arabic font-semibold text-xs text-foreground leading-snug line-clamp-2 flex-1">{product.name}</h3>
                  {disc > 0 && (
                    <span className="bg-red-100 text-red-600 text-[10px] font-bold rounded-md px-1 py-0.5 flex-shrink-0 font-arabic">-{disc}%</span>
                  )}
                </div>
                <span className="inline-block text-[10px] bg-secondary text-secondary-foreground rounded-md px-1.5 py-0.5 font-arabic w-fit">{product.category}</span>
                <div className="flex items-center gap-1">
                  <Truck size={10} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-[10px] text-muted-foreground font-arabic truncate">{product.supplierName}</span>
                  <div className="flex items-center gap-0.5 mr-auto flex-shrink-0">
                    <Star size={9} className="text-warning fill-warning" />
                    <span className="text-[10px] text-muted-foreground tabular-nums">{product.supplierRating}</span>
                  </div>
                </div>
                <div>
                  <span className="font-arabic text-base font-bold text-primary tabular-nums">{product.finalPrice.toLocaleString('ar-IQ')}</span>
                  <span className="font-arabic text-[10px] text-muted-foreground"> د.ع/{product.unit}</span>
                  {disc > 0 && (
                    <span className="font-arabic text-[10px] text-muted-foreground line-through mr-1 tabular-nums">{product.originalPrice.toLocaleString('ar-IQ')}</span>
                  )}
                </div>
                {cartItem ? (
                  <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-2 py-1">
                    <button onClick={() => updateQty(product.id, -product.minOrderQty, product.minOrderQty)}
                      className="w-6 h-6 rounded-md bg-white border border-border flex items-center justify-center hover:bg-red-50 transition-colors">
                      {cartItem.quantity <= product.minOrderQty ? <Trash2 size={10} className="text-red-500" /> : <Minus size={10} />}
                    </button>
                    <span className="font-arabic text-xs font-bold text-primary tabular-nums">{cartItem.quantity} {product.unit}</span>
                    <button onClick={() => updateQty(product.id, product.minOrderQty, product.minOrderQty)}
                      className="w-6 h-6 rounded-md bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
                      <Plus size={10} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => addToCart(product)}
                    className="w-full bg-primary text-white rounded-lg py-1.5 font-arabic font-semibold text-xs hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-1.5">
                    <Plus size={12} />
                    أضف للسلة
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

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
                        className="w-6 h-6 rounded-md bg-white border border-border flex items-center justify-center hover:bg-red-50 transition-colors">
                        {item.quantity <= item.minOrderQty ? <Trash2 size={10} className="text-red-500" /> : <Minus size={10} />}
                      </button>
                      <span className="font-arabic text-xs font-bold tabular-nums w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.minOrderQty, item.minOrderQty)}
                        className="w-6 h-6 rounded-md bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
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
    </div>
  );
}
