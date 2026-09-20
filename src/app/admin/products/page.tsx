'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { productService, Product } from '@/lib/services/productService';
import { Package, Search, Trash2, Tag, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const loadProducts = async () => {
    try {
      const all = await productService.getAll();
      setProducts(all);
    } catch (e) {
      console.error('Failed to load products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('هل تريد بالتأكيد حذف هذا المنتج من المنصة؟')) return;
    const ok = await productService.delete(id);
    if (ok) {
      toast.success('تم حذف المنتج بنجاح');
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      toast.error('تعذر حذف المنتج');
    }
  };

  const filtered = products.filter((p) => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const s = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(s) ||
      p.barcode.toLowerCase().includes(s) ||
      (p.supplierName && p.supplierName.toLowerCase().includes(s));
    return matchesCat && matchesSearch;
  });

  return (
    <AppLayout activeRoute="/admin-hub">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-foreground font-arabic">إدارة المنتجات الشاملة</h1>
            <p className="text-xs text-muted-foreground font-arabic mt-1">
              مراقبة وتدقيق كافة بضائع الجملة المعروضة من الموردين عبر المنصة
            </p>
          </div>
          <div className="text-xs bg-card border border-border px-3.5 py-2 rounded-xl text-muted-foreground font-arabic">
            إجمالي المنتجات: <span className="font-bold text-foreground">{products.length}</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم، الباركود، أو اسم المورد..."
            className="w-full bg-card border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>

        {/* Products List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-card border border-border rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <Package size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <h3 className="text-base font-bold text-foreground font-arabic">لا توجد منتجات مسجلة</h3>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm divide-y divide-border">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground font-arabic">
                      {p.category}
                    </span>
                    <span className="text-xs font-semibold text-primary font-arabic">
                      المورد: {p.supplierName}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-foreground font-arabic">{p.name}</h3>
                  <p className="text-xs text-muted-foreground font-arabic mt-0.5">
                    سعر الجملة: <span className="font-bold text-foreground">{p.finalPrice.toLocaleString()} د.ع</span> • المخزون: {p.stock} {p.unit}
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-border">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold font-arabic ${
                      p.stock <= 0
                        ? 'bg-rose-500/10 text-rose-600'
                        : p.stock <= p.minOrderQty * 2
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-emerald-500/10 text-emerald-600'
                    }`}
                  >
                    {p.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="حذف المنتج من المنصة"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
