'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft,
  Package, Tag, Truck, ChevronLeft, ShoppingBag,
  AlertCircle,
} from 'lucide-react';

export interface CartItem {
  id: string;
  name: string;
  unit: string;
  finalPrice: number;
  minOrderQty: number;
  quantity: number;
  supplierId: string;
  supplierName: string;
  category: string;
}

const MOCK_CART: CartItem[] = [
  {
    id: 'p-1',
    name: 'زيت نباتي صافي 1.8 لتر',
    unit: 'كرتون (12 حبة)',
    finalPrice: 42000,
    minOrderQty: 2,
    quantity: 3,
    supplierId: 's-1',
    supplierName: 'مورد الخير للمواد الغذائية',
    category: 'زيوت',
  },
  {
    id: 'p-2',
    name: 'أرز عنبر عراقي 50 كغ',
    unit: 'كيس',
    finalPrice: 95000,
    minOrderQty: 1,
    quantity: 2,
    supplierId: 's-1',
    supplierName: 'مورد الخير للمواد الغذائية',
    category: 'حبوب',
  },
  {
    id: 'p-3',
    name: 'سكر أبيض 50 كغ',
    unit: 'كيس',
    finalPrice: 78000,
    minOrderQty: 1,
    quantity: 1,
    supplierId: 's-2',
    supplierName: 'شركة النهرين للتوزيع',
    category: 'مواد أساسية',
  },
  {
    id: 'p-4',
    name: 'شاي أحمر 500 غ',
    unit: 'علبة (24 حبة)',
    finalPrice: 36000,
    minOrderQty: 2,
    quantity: 4,
    supplierId: 's-2',
    supplierName: 'شركة النهرين للتوزيع',
    category: 'مشروبات',
  },
];

const DELIVERY_FEE = 3500;

export default function RetailerCartContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>(MOCK_CART);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const updateQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next = item.quantity + delta;
        if (next < item.minOrderQty) return item;
        return { ...item, quantity: next };
      })
    );
  };

  const removeItem = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      setRemovingId(null);
    }, 250);
  };

  /* ── Group by supplier ── */
  const supplierGroups = cartItems.reduce<Record<string, CartItem[]>>((acc, item) => {
    if (!acc[item.supplierId]) acc[item.supplierId] = [];
    acc[item.supplierId].push(item);
    return acc;
  }, {});

  const itemsSubtotal = cartItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
  const totalDelivery = Object.keys(supplierGroups).length * DELIVERY_FEE;
  const grandTotal = itemsSubtotal + totalDelivery;

  const fmt = (n: number) =>
    n.toLocaleString('ar-IQ') + ' د.ع';

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-8 text-center" dir="rtl">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
          <ShoppingCart size={40} className="text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground font-arabic mb-2">السلة فارغة</h2>
          <p className="text-muted-foreground font-arabic text-sm">لم تضف أي منتجات بعد. ابدأ التسوق الآن!</p>
        </div>
        <Link
          href="/product-browse"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-arabic font-semibold hover:bg-primary/90 transition-colors"
        >
          <ShoppingBag size={18} />
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* ── Header ── */}
      <div className="sticky top-0 z-30 bg-card border-b border-border px-4 py-3 flex items-center gap-3 shadow-sm">
        <Link
          href="/product-browse"
          className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground font-arabic leading-none">سلة التسوق</h1>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">
            {cartItems.length} منتج · {Object.keys(supplierGroups).length} مورد
          </p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg">
          <span className="text-sm font-bold font-arabic tabular-nums">{fmt(grandTotal)}</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 pb-36 space-y-5">

        {/* ── Items grouped by supplier ── */}
        {Object.entries(supplierGroups).map(([supplierId, items]) => {
          const supplierName = items[0].supplierName;
          const supplierSubtotal = items.reduce((s, i) => s + i.finalPrice * i.quantity, 0);

          return (
            <div key={supplierId} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
              {/* Supplier header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-muted/40 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Truck size={15} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground font-arabic truncate">{supplierName}</p>
                  <p className="text-xs text-muted-foreground font-arabic">
                    {items.length} منتج · توصيل {fmt(DELIVERY_FEE)}
                  </p>
                </div>
                <span className="text-sm font-bold text-primary font-arabic tabular-nums">{fmt(supplierSubtotal)}</span>
              </div>

              {/* Products */}
              <div className="divide-y divide-border">
                {items.map((item) => {
                  const lineTotal = item.finalPrice * item.quantity;
                  const isRemoving = removingId === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`px-4 py-4 transition-all duration-250 ${isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                          <Package size={20} className="text-muted-foreground" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground font-arabic leading-snug">{item.name}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-xs text-muted-foreground font-arabic">{item.unit}</span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                            <span className="text-xs text-muted-foreground font-arabic">{item.category}</span>
                          </div>
                          <p className="text-xs text-primary font-arabic mt-1 font-medium">
                            {fmt(item.finalPrice)} / وحدة
                          </p>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors flex-shrink-0"
                          aria-label="حذف المنتج"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Quantity + Subtotal row */}
                      <div className="flex items-center justify-between mt-3">
                        {/* Qty controls */}
                        <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            disabled={item.quantity <= item.minOrderQty}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm font-bold text-foreground font-arabic tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground hover:bg-card transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Min qty hint */}
                        {item.quantity === item.minOrderQty && (
                          <span className="text-[10px] text-warning font-arabic flex items-center gap-1">
                            <AlertCircle size={11} />
                            الحد الأدنى {item.minOrderQty}
                          </span>
                        )}

                        {/* Line subtotal */}
                        <div className="text-left">
                          <p className="text-xs text-muted-foreground font-arabic">المجموع الفرعي</p>
                          <p className="text-base font-bold text-foreground font-arabic tabular-nums">{fmt(lineTotal)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Supplier delivery row */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-muted/20 border-t border-border">
                <span className="text-xs text-muted-foreground font-arabic flex items-center gap-1.5">
                  <Truck size={12} />
                  رسوم التوصيل
                </span>
                <span className="text-xs font-semibold text-foreground font-arabic tabular-nums">{fmt(DELIVERY_FEE)}</span>
              </div>
            </div>
          );
        })}

        {/* ── Order Summary ── */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-bold text-foreground font-arabic flex items-center gap-2">
              <Tag size={15} className="text-primary" />
              ملخص الطلب
            </h3>
          </div>
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-arabic">
                المنتجات ({cartItems.length} صنف)
              </span>
              <span className="text-sm font-semibold text-foreground font-arabic tabular-nums">{fmt(itemsSubtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-arabic">
                رسوم التوصيل ({Object.keys(supplierGroups).length} مورد)
              </span>
              <span className="text-sm font-semibold text-foreground font-arabic tabular-nums">{fmt(totalDelivery)}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-foreground font-arabic">الإجمالي الكلي</span>
              <span className="text-xl font-bold text-primary font-arabic tabular-nums">{fmt(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* ── Continue shopping link ── */}
        <Link
          href="/product-browse"
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-arabic py-2"
        >
          <ArrowLeft size={15} />
          متابعة التسوق
        </Link>
      </div>

      {/* ── Sticky Checkout CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border px-4 py-3 safe-area-pb lg:max-w-2xl lg:mx-auto lg:left-auto lg:right-auto">
        <Link
          href="/retailer-checkout"
          className="flex items-center justify-between w-full bg-primary text-white px-5 py-4 rounded-2xl font-arabic font-bold text-base hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg"
        >
          <span className="flex items-center gap-2">
            <ShoppingCart size={20} />
            إتمام الطلب
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-lg tabular-nums text-sm">{fmt(grandTotal)}</span>
        </Link>
      </div>
    </div>
  );
}
