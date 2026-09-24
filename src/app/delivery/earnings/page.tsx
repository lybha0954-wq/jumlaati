'use client';
import { Card } from '@/components/ui/Card';
export default function DeliveryEarnings() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-6 text-center"><p className="text-xs font-arabic mb-1">اليوم</p><p className="text-xl font-bold font-arabic">0 د.ع</p></Card>
      <Card className="p-6 text-center"><p className="text-xs font-arabic mb-1">هذا الشهر</p><p className="text-xl font-bold font-arabic">0 د.ع</p></Card>
    </div>
  );
}
