'use client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
export default function SupplierCatalog() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold font-arabic">الكتالوج</h2>
        <Button variant="accent" className="gap-2"><Plus size={18} /> منتج جديد</Button>
      </div>
      <Card className="p-8 text-center text-muted-foreground font-arabic">لا توجد منتجات بعد.</Card>
    </div>
  );
}
