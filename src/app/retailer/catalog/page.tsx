'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Package, ChevronRight, ChevronLeft } from 'lucide-react';
import { productService, type Product } from '@/lib/services/productService';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/shared/ProductCard';
import Spinner from '@/components/ui/Spinner';

const CATEGORIES = ['الكل', 'مشروبات', 'وجبات خفيفة', 'قهوة وشاي', 'زيوت', 'بقالة أساسية', 'معلبات', 'حلويات', 'ألبان', 'منظفات'];

export default function RetailerCatalogPage() {
  const { itemCount, total } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('الكل');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const perPage = 20;

  const load = useCallback(async () => {
    setLoading(true);
    const result = await productService.getPaginated(page, perPage, {
      category,
      search,
    });
    setProducts(result.data);
    setTotalCount(result.total);
    setHasMore(result.hasMore);
    setLoading(false);
  }, [page, category, search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [category, search]);

  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <div className="space-y-4 pb-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground font-arabic">
            كتالوج المنتجات
          </h2>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">
            {totalCount} منتج متاح
          </p>
        </div>
        {itemCount > 0 && (
          <Link
            href="/retailer/cart"
            className="relative flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-xl font-arabic font-semibold text-sm"
          >
            <ShoppingCart size={16} />
            <span className="tabular-nums">{itemCount}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-md tabular-nums text-xs">
              {total.toLocaleString('ar-IQ')}
            </span>
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="w-full bg-card border border-border rounded-xl pr-10 pl-4 py-3 text-sm font-arabic focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-arabic font-semibold transition-all ${
              category === c
                ? 'bg-primary text-white'
                : 'bg-card border border-border text-muted-foreground'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="md" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl py-16 flex flex-col items-center gap-3">
          <Package size={40} className="text-muted-foreground/30" />
          <p className="font-arabic text-muted-foreground text-sm">لا توجد منتجات</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-border bg-card disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
              <span className="font-arabic text-sm text-foreground tabular-nums px-3">
                صفحة {page} من {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={!hasMore}
                className="p-2 rounded-lg border border-border bg-card disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
