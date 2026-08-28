'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ShoppingCart, Search, Package, Plus, Minus, Trash2, Star, Truck } from 'lucide-react';
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
  originalPrice: number;
  supplierId: string;
  supplierName: string;
  supplierRating: number;
  deliveryDays: number;
}

export default function RetailerShopContent() {
  const [allProducts, setAllProducts] = useState<SupplierProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('الكل');
  const [supplierFilter, setSupplierFilter] = useState('الكل');
  const [cartOpen, setCartOpen] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      const data = await productService.getAll();
      // Only show available/low stock products in shop
      const shopProducts = data
        .filter((p) => p.status !== 'موقوف' && p.stock > 0)
        .map((p) => ({
          ...p,
          supplierId: p.supplierId ?? '',
          supplierName: p.supplierName ?? '',
          supplierRating: p.supplierRating ?? 4.5,
          deliveryDays: p.deliveryDays ?? 1,
        })) as SupplierProduct[];
      setAllProducts(shopProducts);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const categories = useMemo(() => ['الكل', ...Array.from(new Set(allProducts.map((p) => p.category)))], [allProducts]);
  const suppliers = useMemo(() => {
    const map = new Map<string, string>();
    allProducts.forEach((p) => { if (p.supplierId) map.set(p.supplierId, p.supplierName); });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [allProducts]);

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const matchSearch = p.name.includes(search) || p.barcode.includes(search) || p.category.includes(search);
      const matchCat = categoryFilter === 'الكل' || p.category === categoryFilter;
      const matchSup = supplierFilter === 'الكل' || p.supplierId === supplierFilter;
      return matchSearch && matchCat && matchSup;
    });
  }, [allProducts, search, categoryFilter, supplierFilter]);

  const cartTotal = cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getCartItem = (productId: string) => cart.find((c) => c.id === productId);

  const addToCart = (product: SupplierProduct) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === product.id);
      if (existing) {
        return prev.map((c) => c.id === product.id ? { ...c, quantity: c.quantity + product.minOrderQty } : c);
      }
      return [...prev, {
        id: product.id, name: product.name, unit: product.unit,
        finalPrice: product.finalPrice, minOrderQty: product.minOrderQty,
        quantity: product.minOrderQty, supplierId: product.supplierId, supplierName: product.supplierName,
      }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((c) => c.id === id ? { ...c, quantity: Math.max(c.minOrderQty, c.quantity + delta) } : c)
        .filter((c) => c.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.id !== id));

  const cartBySupplier = cart.reduce<Record<string, CartItem[]>>((acc, item) => {
    if (!acc[item.supplierName]) acc[item.supplierName] = [];
    acc[item.supplierName].push(item);
    return acc;
  }, {});

  const handleCheckout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('jumlaati_cart', JSON.stringify(cart));
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">تسوق من الموردين</h1>
          <p className="text-sm text-muted-foreground font-arabic mt-0.5">
            {loading ? 'جاري التحميل...' : `${allProducts.length} منتج من ${suppliers.length} موردين — اختر وأضف للسلة`}
          </p>
        </div>
        <button onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2.5 bg-primary text-white px-5 py-2.5 rounded-xl font-arabic font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-sm">
          <ShoppingCart size={18} />
          <span>السلة</span>
          {cartCount > 0 && (
            <span className="bg-warning text-white text-xs font-bold rounded-full px-2 py-0.5 tabular-nums min-w-[22px] text-center">{cartCount}</span>
          )}
          {cartCount > 0 && (
            <span className="font-arabic text-sm font-bold tabular-nums border-r border-white/30 pr-2.5 mr-0.5">
              {cartTotal.toLocaleString('ar-IQ')} د.ع
            </span>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن منتج أو باركود..."
            className="w-full bg-muted border border-border rounded-lg pr-9 pl-4 py-2 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-muted border border-border rounded-lg px-3 py-2 text-sm font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 cursor-pointer">
          {categories.map((c) => <option key={`cat-${c}`} value={c}>{c}</option>)}
        </select>
        <select value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)}
          className="bg-muted border border-border rounded-lg px-3 py-2 text-sm font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 cursor-pointer">
          <option value="الكل">جميع الموردين</option>
          {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Product Grid */}
      {!loading && (
        filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-xl py-16 flex flex-col items-center gap-3">
            <Package size={36} className="text-muted-foreground/40" />
            <p className="font-arabic text-muted-foreground">لا توجد منتجات تطابق البحث</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product) => {
              const cartItem = getCartItem(product.id);
              const discount = Math.round(((product.originalPrice - product.finalPrice) / product.originalPrice) * 100);
              return (
                <div key={product.id}
                  className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 hover:shadow-md hover:border-primary/30 transition-all duration-200 group">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-arabic font-semibold text-sm text-foreground leading-snug line-clamp-2 flex-1">{product.name}</h3>
                      {discount > 0 && (
                        <span className="bg-success/10 text-success text-xs font-bold rounded-lg px-1.5 py-0.5 whitespace-nowrap font-arabic flex-shrink-0">-{discount}%</span>
                      )}
                    </div>
                    <span className="inline-block text-xs bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 font-arabic mb-2">{product.category}</span>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Truck size={12} className="text-muted-foreground flex-shrink-0" />
                      <span className="text-xs text-muted-foreground font-arabic truncate">{product.supplierName}</span>
                      <div className="flex items-center gap-0.5 mr-auto flex-shrink-0">
                        <Star size={10} className="text-warning fill-warning" />
                        <span className="text-xs text-muted-foreground tabular-nums">{product.supplierRating}</span>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-arabic text-lg font-bold text-primary tabular-nums">{product.finalPrice.toLocaleString('ar-IQ')}</span>
                      <span className="font-arabic text-xs text-muted-foreground">د.ع / {product.unit}</span>
                    </div>
                    {product.originalPrice > product.finalPrice && (
                      <span className="font-arabic text-xs text-muted-foreground line-through tabular-nums">{product.originalPrice.toLocaleString('ar-IQ')} د.ع</span>
                    )}
                    <p className="text-xs text-muted-foreground font-arabic mt-1">الحد الأدنى: {product.minOrderQty} {product.unit}</p>
                  </div>

                  {cartItem ? (
                    <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-2 py-1.5">
                      <button onClick={() => updateQty(product.id, -product.minOrderQty)}
                        className="w-7 h-7 rounded-md bg-white border border-border flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors">
                        {cartItem.quantity <= product.minOrderQty ? <Trash2 size={12} className="text-red-500" /> : <Minus size={12} className="text-foreground" />}
                      </button>
                      <span className="font-arabic text-sm font-bold text-primary tabular-nums">{cartItem.quantity} {product.unit}</span>
                      <button onClick={() => updateQty(product.id, product.minOrderQty)}
                        className="w-7 h-7 rounded-md bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
                        <Plus size={12} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(product)}
                      className="w-full bg-primary text-white rounded-lg py-2 font-arabic font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2">
                      <ShoppingCart size={14} />
                      أضف للسلة
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex" dir="rtl">
          <div className="flex-1 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm bg-card shadow-2xl flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-arabic font-bold text-foreground text-lg">السلة ({cartCount})</h2>
              <button onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors">✕</button>
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
                    <p className="font-arabic text-xs font-semibold text-muted-foreground mb-2 px-1">{supplierName}</p>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-arabic text-sm font-medium text-foreground truncate">{item.name}</p>
                            <p className="font-arabic text-xs text-muted-foreground tabular-nums">{item.finalPrice.toLocaleString('ar-IQ')} د.ع / {item.unit}</p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button onClick={() => updateQty(item.id, -item.minOrderQty)}
                              className="w-6 h-6 rounded-md bg-white border border-border flex items-center justify-center hover:bg-red-50 transition-colors">
                              {item.quantity <= item.minOrderQty ? <Trash2 size={10} className="text-red-500" /> : <Minus size={10} />}
                            </button>
                            <span className="font-arabic text-xs font-bold tabular-nums w-8 text-center">{item.quantity}</span>
                            <button onClick={() => updateQty(item.id, item.minOrderQty)}
                              className="w-6 h-6 rounded-md bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
                              <Plus size={10} className="text-white" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t border-border p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-arabic text-sm text-muted-foreground">الإجمالي</span>
                  <span className="font-arabic font-bold text-foreground tabular-nums">{cartTotal.toLocaleString('ar-IQ')} د.ع</span>
                </div>
                <Link href="/retailer-checkout" onClick={handleCheckout}
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
