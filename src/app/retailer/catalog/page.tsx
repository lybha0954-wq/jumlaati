'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { useCart } from '@/contexts/CartContext';
import { productService, Product } from '@/lib/services/productService';
import { Search, ShoppingBag, Plus, Minus, Check, Filter } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  'الكل',
  'أغذية عامة',
  'ألبان وأجبان',
  'زيوت وبقوليات',
  'مشروبات وعصائر',
  'منظفات وعناية',
  'حلويات وسكاكر',
  'معلبات',
];

export default function RetailerCatalogPage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadProducts() {
      try {
        const all = await productService.getAll();
        setProducts(all);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.supplierName && p.supplierName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleQtyChange = (productId: string, delta: number, minQty: number = 1) => {
    setQuantities((prev) => {
      const current = prev[productId] ?? minQty;
      const next = Math.max(minQty, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleAddToCart = (p: Product) => {
    const qty = quantities[p.id] ?? (p.minOrderQty || 1);
    addItem(p, qty);
    toast.success(`تمت إضافة ${qty} ${p.unit} من ${p.name} إلى السلة`);
  };

  return (
    <AppLayout activeRoute="/product-browse">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-foreground font-arabic">كتالوج منتجات الجملة</h1>
            <p className="text-sm text-muted-foreground font-arabic mt-1">
              تصفح آلاف المنتجات واطلب بأسعار الجملة المباشرة
            </p>
          </div>
          <div className="text-xs bg-card border border-border px-3.5 py-2 rounded-xl text-muted-foreground font-arabic flex items-center gap-2">
            <span>إجمالي المنتجات:</span>
            <span className="font-bold text-foreground">{filteredProducts.length}</span>
          </div>
        </div>

        {/* Search & Categories Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث باسم المنتج، الباركود، أو اسم المورد..."
              className="w-full bg-card border border-border rounded-xl pr-10 pl-4 py-3 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-arabic whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-56 bg-card border border-border rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <ShoppingBag size={42} className="mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="text-base font-bold text-foreground font-arabic">لا توجد منتجات مطابقة للبحث</h3>
            <p className="text-xs text-muted-foreground font-arabic mt-1">
              جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((p) => {
              const minQty = p.minOrderQty || 1;
              const currentQty = quantities[p.id] ?? minQty;

              return (
                <div
                  key={p.id}
                  className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground font-arabic">
                        {p.category}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded font-arabic ${
                          p.stock <= 0
                            ? 'bg-rose-500/10 text-rose-600'
                            : 'bg-emerald-500/10 text-emerald-600'
                        }`}
                      >
                        {p.stock <= 0 ? 'نفد المخزون' : `متوفر (${p.stock})`}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-foreground font-arabic mb-1 leading-snug">
                      {p.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-arabic mb-1">
                      المورد: <span className="text-foreground font-semibold">{p.supplierName}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground font-arabic mb-3">
                      الوحدة: {p.unit} • أدنى طلب: {minQty} {p.unit}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-border">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground font-arabic">سعر الجملة</span>
                      <span className="text-lg font-black text-primary font-arabic">
                        {p.finalPrice.toLocaleString()} <span className="text-xs font-normal">د.ع</span>
                      </span>
                    </div>

                    {/* Quantity Selector & Add Button */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden flex-1">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(p.id, -1, minQty)}
                          className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="flex-1 text-center text-xs font-bold font-arabic tabular-nums">
                          {currentQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(p.id, 1, minQty)}
                          className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(p)}
                        disabled={p.stock <= 0}
                        className="bg-primary text-white px-3.5 py-2 rounded-xl text-xs font-bold font-arabic hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <ShoppingBag size={14} />
                        إضافة
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
