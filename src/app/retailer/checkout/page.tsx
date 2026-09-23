'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Banknote, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';

const ZONES = [
  { id: 'z1', name: 'الكرادة', fee: 3000 },
  { id: 'z2', name: 'الرصافة', fee: 3500 },
  { id: 'z3', name: 'الجادرية', fee: 4000 },
  { id: 'z4', name: 'الكاظمية', fee: 3000 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [zone, setZone] = useState(ZONES[0]);
  const [loading, setLoading] = useState(false);

  const deliveryFee = Object.keys(
    items.reduce<Record<string, any>>((a, i) => ({ ...a, [i.supplierName]: true }), {})
  ).length * 3500;
  const grandTotal = total + deliveryFee;

  const handleSubmit = async () => {
    if (items.length === 0) return;
    setLoading(true);

    try {
      const supabase = createClient();
      if (!supabase || !user) throw new Error('Not authenticated');

      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          retailer_id: user.id,
          supplier_id: items[0].supplierId || null,
          buyer_name: user.user_metadata?.full_name || '',
          buyer_store_name: user.user_metadata?.business_name || '',
          buyer_phone: user.user_metadata?.phone || '',
          delivery_city: zone.name,
          delivery_address: zone.name,
          subtotal: total,
          delivery_fee: deliveryFee,
          total: grandTotal,
          commission: Math.round(grandTotal * 0.05),
          status: 'reviewing',
          payment_status: 'pending',
          payment_method: 'cod',
        })
        .select('id')
        .single();

      if (error) throw error;

      await supabase.from('order_items').insert(
        items.map((i) => ({
          order_id: order.id,
          product_id: i.id,
          name: i.name,
          qty: i.quantity,
          unit: i.unit,
          unit_price: i.finalPrice,
        }))
      );

      toast.success('تم تأكيد طلبك بنجاح');
      clearCart();
      router.push('/retailer/orders');
    } catch (e: any) {
      toast.error(e?.message || 'فشل تأكيد الطلب');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20 font-arabic text-muted-foreground" dir="rtl">
        السلة فارغة
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4" dir="rtl">
      <h2 className="text-xl font-bold text-foreground font-arabic">إتمام الطلب</h2>

      <div className="bg-card border border-border rounded-2xl p-4">
        <h3 className="font-arabic font-bold text-sm mb-3 flex items-center gap-2">
          <MapPin size={14} className="text-primary" />
          منطقة التوصيل
        </h3>
        <div className="space-y-2">
          {ZONES.map((z) => (
            <button
              key={z.id}
              onClick={() => setZone(z)}
              className={`w-full flex justify-between items-center p-3 rounded-xl border-2 transition-all ${
                zone.id === z.id ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <span className="font-arabic text-sm">{z.name}</span>
              <span className="font-arabic text-sm tabular-nums">{z.fee.toLocaleString('ar-IQ')} د.ع</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4">
        <h3 className="font-arabic font-bold text-sm mb-3 flex items-center gap-2">
          <Banknote size={14} className="text-emerald-600" />
          طريقة الدفع
        </h3>
        <div className="p-3 rounded-xl border-2 border-primary bg-primary/5 flex items-center gap-2">
          <CheckCircle size={16} className="text-primary" />
          <span className="font-arabic text-sm">الدفع عند الاستلام (كاش)</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
        <div className="flex justify-between text-sm font-arabic">
          <span className="text-muted-foreground">المنتجات</span>
          <span className="tabular-nums">{total.toLocaleString('ar-IQ')} د.ع</span>
        </div>
        <div className="flex justify-between text-sm font-arabic">
          <span className="text-muted-foreground">التوصيل</span>
          <span className="tabular-nums">{deliveryFee.toLocaleString('ar-IQ')} د.ع</span>
        </div>
        <div className="border-t border-border pt-2 flex justify-between font-arabic font-bold">
          <span>الإجمالي</span>
          <span className="text-primary text-lg tabular-nums">
            {grandTotal.toLocaleString('ar-IQ')} د.ع
          </span>
        </div>
      </div>

      <Button onClick={handleSubmit} loading={loading} fullWidth variant="accent">
        تأكيد الطلب
      </Button>
    </div>
  );
}
