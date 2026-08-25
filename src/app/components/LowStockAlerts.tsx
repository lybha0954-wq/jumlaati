'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Package, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface LowStockItem {
  id: string;
  name: string;
  stock: number;
  min: number;
  unit: string;
}

export default function LowStockAlerts() {
  const [items, setItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = createClient();
    try {
      const { data } = await supabase
        .from('products')
        .select('id, name, stock, min_stock_level, unit, status')
        .neq('status', 'موقوف')
        .gt('stock', 0)
        .order('stock', { ascending: true })
        .limit(8);

      const filtered = (data ?? []).filter(
        (p: any) => p.stock <= (p.min_stock_level ?? 20)
      ).map((p: any) => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
        min: p.min_stock_level ?? 20,
        unit: p.unit ?? 'وحدة',
      }));
      setItems(filtered);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="bg-card border border-red-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border-b border-red-200">
          <AlertTriangle size={16} className="text-danger flex-shrink-0" />
          <h3 className="font-arabic font-semibold text-sm text-danger">تنبيهات المخزون المنخفض</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-4 border-danger border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-red-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border-b border-red-200">
        <AlertTriangle size={16} className="text-danger flex-shrink-0" />
        <h3 className="font-arabic font-semibold text-sm text-danger">تنبيهات المخزون المنخفض</h3>
        {items.length > 0 && (
          <span className="mr-auto bg-danger text-white text-xs font-bold rounded-full px-1.5 py-0.5 tabular-nums">
            {items.length}
          </span>
        )}
        <button onClick={load} className="text-danger/60 hover:text-danger transition-colors" title="تحديث">
          <RefreshCw size={12} />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8">
          <Package size={24} className="text-muted-foreground/40" />
          <p className="font-arabic text-xs text-muted-foreground">المخزون في مستوى جيد</p>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {items.map((item) => {
            const pct = Math.round((item.stock / item.min) * 100);
            const critical = pct < 30;
            return (
              <div key={item.id} className={`px-4 py-3 hover:bg-muted/30 transition-colors ${critical ? 'bg-red-50/50' : ''}`}>
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <Package size={14} className={critical ? 'text-danger' : 'text-warning'} />
                    <p className="font-arabic text-xs font-semibold text-foreground truncate">{item.name}</p>
                  </div>
                  <span className={`text-xs font-bold tabular-nums font-arabic flex-shrink-0 mr-2 ${critical ? 'text-danger' : 'text-warning'}`}>
                    {item.stock} {item.unit}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${critical ? 'bg-danger' : 'bg-warning'}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground font-arabic mt-1 tabular-nums">
                  الحد الأدنى: {item.min} {item.unit}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <div className="px-4 py-2 border-t border-red-100 text-center">
          <Link href="/inventory-management" className="text-xs text-danger font-arabic font-medium hover:underline">
            إدارة المخزون
          </Link>
        </div>
      )}
    </div>
  );
}