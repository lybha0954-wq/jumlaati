'use client';
import { Card } from '@/components/ui/Card';
export default function SupplierFinance() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6 text-center"><p className="text-sm font-arabic mb-1">الرصيد</p><p className="text-2xl font-bold font-arabic">0 د.ع</p></Card>
      <Card className="p-6 text-center"><p className="text-sm font-arabic mb-1">الأرباح</p><p className="text-2xl font-bold font-arabic">0 د.ع</p></Card>
      <Card className="p-6 text-center"><p className="text-sm font-arabic mb-1">المعلقة</p><p className="text-2xl font-bold text-amber-500 font-arabic">0 د.ع</p></Card>
    </div>
  );
}
