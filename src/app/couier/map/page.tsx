'use client';
import { MapPin } from 'lucide-react';

export default function CourierMapPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <MapPin size={80} className="text-cyan-500 mb-4" />
      <h1 className="text-2xl font-bold">الخريطة والتوجيه</h1>
      <p className="text-slate-400 mt-2 text-center max-w-md">
        عند اختيار مهمة من صفحة "المهام"، سيظهر هنا رابط لفتح خرائط جوجل مباشرة والوصول إلى موقع المحل (بناءً على إحداثيات `store_lat` و `store_lng`).
      </p>
    </div>
  );
}
