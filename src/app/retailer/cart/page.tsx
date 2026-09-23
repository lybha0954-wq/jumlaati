'use client';

import Link from 'next/link';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Truck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function RetailerCartPage() {
  const { items, updateQty, removeItem, total, clearCart } = useCart();

  const groups = items.reduce<Record<string, typeof items>>((acc, item) => {
    if (!acc[item.supplierName]) acc[item.supplierName] = [];
    acc[item.supplierName].push(item);
    return acc;
  }, {});

  const deliveryFee = Object.keys(groups).length * 3500;
  const grandTotal = total + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-5" dir="rtl">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
          <ShoppingCart size={40} className="text-muted-foreground" />
        </div>
        <p className="font-arabic text-muted-foreground">السلة فارغة</p>
        <Link
          href="/retailer/catalog"
          className="bg-primary text-white px-6 py-3 rounded-xl font-arabic font-semibold"
        >
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4" dir="rtl">
      <h2 className="text-xl font-bold text-foreground font-arabic">سلة التسوق</h2>

      {Object.entries(groups).map(([supplierName, supplierItems]) => {
        const subtotal = supplierItems.reduce((s, i) => s + i.finalPrice * i.quantity, 0);
        return (
          <div key={supplierName} className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-b border-border">
              <Truck size={14} className="text-primary" />
              <span className="font-arabic font-semibold text-sm">{supplierName}</span>
              <span className="mr-auto font-arabic font-bold text-primary tabular-nums">
                {subtotal.toLocaleString('ar-IQ')} د.ع
              </span>
            </div>
            <div className="divide-y divide-border">
              {supplierItems.map((item) => (
                <div key={item.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-arabic font-semibold text-sm">{item.name}</p>
                      <p className="font-arabic text-xs text-muted-foreground">
                        {item.finalPrice.toLocaleString('ar-IQ')} د.ع / {item.unit}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-red-500 p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                      <button
                        onClick={() => updateQty(item.id, -item.minOrderQty)}
                        className="w-7 h-7 rounded-md bg-white border border-border flex items-center justify-center"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center font-arabic font-bold text-sm tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.minOrderQty)}
                        className="w-7 h-7 rounded-md bg-primary flex items-center justify-center"
                      >
                        <Plus size={12} className="text-white" />
                      </button>
                    </div>
                    <span className="font-arabic font-bold text-primary tabular-nums">
                      {(item.finalPrice * item.quantity).toLocaleString('ar-IQ')} د.ع
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
        <div className="flex justify-between text-sm font-arabic">
          <span className="text-muted-foreground">المنتجات</span>
          <span className="tabular-nums">{total.toLocaleString('ar-IQ')} د.ع</span>
        </div>
        <div className="flex justify-between text-sm font-arabic">
          <span className="text-muted-foreground">التوصيل ({Object.keys(groups).length} مورد)</span>
          <span className="tabular-nums">{deliveryFee.toLocaleString('ar-IQ')} د.ع</span>
        </div>
        <div className="border-t border-border pt-2 flex justify-between font-arabic font-bold">
          <span>الإجمالي</span>
          <span className="text-primary text-lg tabular-nums">
            {grandTotal.toLocaleString('ar-IQ')} د.ع
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          href="/retailer/catalog"
          className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border font-arabic text-sm"
        >
          <ArrowLeft size={14} />
          متابعة
        </Link>
        <Link
          href="/retailer/checkout"
          className="flex-1 bg-primary text-white py-3 rounded-xl font-arabic font-bold text-center"
        >
          إتمام الطلب ←
        </Link>
      </div>
    </div>
  );
}
