'use client';

import { useState, useEffect, useCallback } from 'react';
import { Package, Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { productService, type Product } from '@/lib/services/productService';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function SupplierProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const result = await productService.getPaginated(page, 20, {
      supplierId: user.id,
      search,
    });
    setProducts(result.data);
    setTotal(result.total);
    setLoading(false);
  }, [user, page, search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="space-y-4 pb-4" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-arabic">المنتجات</h2>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">
            {total} منتج في متجرك
          </p>
        </div>
        <Button size="sm" leftIcon={<Plus size={14} />}>
          منتج جديد
        </Button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="w-full bg-card border border-border rounded-xl pr-10 pl-4 py-3 text-sm font-arabic focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : products.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl py-16 text-center">
          <Package size={40} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-arabic text-muted-foreground text-sm">لا توجد منتجات بعد</p>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <Package size={16} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-arabic font-semibold text-sm truncate">{p.name}</p>
                <p className="font-arabic text-xs text-muted-foreground">
                  {p.finalPrice.toLocaleString('ar-IQ')} د.ع · مخزون {p.stock} {p.unit}
                </p>
              </div>
              <button className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10">
                <Edit2 size={14} />
              </button>
              <button className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
