'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Package, RefreshCw } from 'lucide-react';
import { productService, Product } from '@/lib/services/productService';
import Link from 'next/link';

export default function LowStockAlerts() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const all = await productService.getAll();
      const low = all.filter(
        (p) => p.status === 'منخفض' || p.status === 'نفد' || (p.stock > 0 && p.stock <= (p.minOrderQty * 3))
      ).slice(0, 8);
      setItems(low);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} className="text-amber-500" />
          <h3 className="font-arabic font-semibold text-sm text-foreground">تنبيهات المخزون المنخفض</h3>
        </div>
        <div className="h-20 bg-muted/40 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-rose-500" />
          <h3 className="font-arabic font-semibold text-sm text-foreground">تنبيهات المخزون المنخفض</h3>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-bold">
          {items.length} منتجات
        </span>
      </div>
      <div className="p-4">
        {items.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground text-xs font-arabic">
            لا توجد تنبيهات مخزون حالياً، جميع المنتجات متوفرة بكميات كافية.
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-background/60 hover:bg-muted/30 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground font-arabic truncate">{it.name}</p>
                  <p className="text-[11px] text-muted-foreground font-arabic">
                    الحد الأدنى: {it.minOrderQty} {it.unit}
                  </p>
                </div>
                <div className="text-left flex-shrink-0">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      it.stock <= 0
                        ? 'bg-rose-500/10 text-rose-600'
                        : 'bg-amber-500/10 text-amber-600'
                    }`}
                  >
                    {it.stock <= 0 ? 'نفد' : `${it.stock} ${it.unit}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
