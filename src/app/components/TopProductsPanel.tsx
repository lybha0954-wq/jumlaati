import React from 'react';
import { Award } from 'lucide-react';

const topProducts = [
  { id: 'prod-001', name: 'مياه نستله 500 مل', sold: 142, revenue: 2130000 },
  { id: 'prod-002', name: 'شيبس ليز 40غ', sold: 98, revenue: 1470000 },
  { id: 'prod-003', name: 'كولا 330 مل', sold: 87, revenue: 1305000 },
  { id: 'prod-004', name: 'نسكافيه 3 في 1', sold: 74, revenue: 1110000 },
  { id: 'prod-005', name: 'زيت عباد الشمس 1.5ل', sold: 61, revenue: 915000 },
];

export default function TopProductsPanel() {
  const maxSold = topProducts?.[0]?.sold;
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Award size={16} className="text-warning" />
        <h3 className="font-arabic font-semibold text-sm text-foreground">أكثر المنتجات مبيعاً</h3>
        <span className="mr-auto text-xs text-muted-foreground font-arabic">هذا الأسبوع</span>
      </div>
      <div className="divide-y divide-border/60 p-2">
        {topProducts?.map((p, idx) => (
          <div key={p?.id} className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-muted/40 transition-colors">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              idx === 0 ? 'bg-warning text-white' : idx === 1 ? 'bg-slate-300 text-slate-700' : idx === 2 ? 'bg-orange-300 text-orange-800' : 'bg-muted text-muted-foreground'
            }`}>
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-arabic text-xs font-semibold text-foreground truncate">{p?.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-muted rounded-full h-1">
                  <div
                    className="h-1 rounded-full bg-primary"
                    style={{ width: `${(p?.sold / maxSold) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground tabular-nums font-arabic">{p?.sold}</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-accent tabular-nums font-arabic flex-shrink-0">
              {(p?.revenue / 1000000)?.toFixed(1)}م
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}