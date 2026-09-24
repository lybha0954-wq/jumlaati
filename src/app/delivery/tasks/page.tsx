'use client';
import { Card } from '@/components/ui/Card';
import { MapPin } from 'lucide-react';
export default function DeliveryTasks() {
  return (
    <Card className="p-8 text-center text-muted-foreground font-arabic flex flex-col items-center gap-3">
      <MapPin size={40} className="text-primary" />
      <p>لا توجد مهام توصيل حالياً</p>
    </Card>
  );
}
