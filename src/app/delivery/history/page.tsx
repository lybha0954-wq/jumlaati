'use client';

import { History } from 'lucide-react';

export default function DeliveryHistoryPage() {
  return (
    <div className="space-y-4 pb-4" dir="rtl">
      <h2 className="text-xl font-bold font-arabic">سجل التوصيلات</h2>
      <div className="bg-card border border-border rounded-2xl py-16 text-center">
        <History size={40} className="text-muted-foreground/30 mx-auto mb-3" />
        <p className="font-arabic text-muted-foreground text-sm">لا توجد توصيلات مكتملة بعد</p>
      </div>
    </div>
  );
}
