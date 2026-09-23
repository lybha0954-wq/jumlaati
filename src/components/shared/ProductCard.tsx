'use client';

import { Plus, Minus, Trash2, Star, Truck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/lib/services/productService';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQty } = useCart();
  const cartItem = items.find((i) => i.id === product.id);

  const discount =
    product.originalPrice > product.finalPrice
      ? Math.round(
          ((product.originalPrice - product.finalPrice) / product.originalPrice) * 100
        )
      : 0;

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      unit: product.unit,
      finalPrice: product.finalPrice,
      minOrderQty: product.minOrderQty,
      supplierId: product.supplierId || '',
      supplierName: product.supplierName || 'مورد',
    });
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-3 flex flex-col gap-2 hover:border-primary/30 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-arabic font-semibold text-sm text-foreground leading-snug line-clamp-2 flex-1">
          {product.name}
        </h3>
        {discount > 0 && (
          <span className="bg-red-100 text-red-600 text-[10px] font-bold rounded-md px-1.5 py-0.5 flex-shrink-0 font-arabic">
            -{discount}%
          </span>
        )}
      </div>

      <span className="inline-block text-[10px] bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 font-arabic w-fit">
        {product.category}
      </span>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Truck size={11} className="flex-shrink-0" />
        <span className="font-arabic truncate">{product.supplierName || 'مورد'}</span>
        <div className="flex items-center gap-0.5 mr-auto flex-shrink-0">
          <Star size={10} className="text-amber-400 fill-amber-400" />
          <span className="tabular-nums">{product.supplierRating || 4.5}</span>
        </div>
      </div>

      <div>
        <span className="font-arabic text-lg font-bold text-primary tabular-nums">
          {product.finalPrice.toLocaleString('ar-IQ')}
        </span>
        <span className="font-arabic text-[10px] text-muted-foreground">
          {' '}د.ع/{product.unit}
        </span>
        {discount > 0 && (
          <span className="font-arabic text-[10px] text-muted-foreground line-through mr-1 tabular-nums block">
            {product.originalPrice.toLocaleString('ar-IQ')}
          </span>
        )}
      </div>

      {cartItem ? (
        <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-2 py-1">
          <button
            onClick={() =>
              cartItem.quantity <= product.minOrderQty
                ? updateQty(product.id, -product.minOrderQty)
                : updateQty(product.id, -product.minOrderQty)
            }
            className="w-7 h-7 rounded-md bg-white border border-border flex items-center justify-center hover:bg-red-50"
          >
            {cartItem.quantity <= product.minOrderQty ? (
              <Trash2 size={11} className="text-red-500" />
            ) : (
              <Minus size={11} />
            )}
          </button>
          <span className="font-arabic text-sm font-bold text-primary tabular-nums">
            {cartItem.quantity}
          </span>
          <button
            onClick={() => updateQty(product.id, product.minOrderQty)}
            className="w-7 h-7 rounded-md bg-primary flex items-center justify-center"
          >
            <Plus size={11} className="text-white" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAdd}
          className="w-full bg-primary text-white rounded-lg py-2 font-arabic font-semibold text-xs hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          <Plus size={13} />
          أضف للسلة
        </button>
      )}
    </div>
  );
}
