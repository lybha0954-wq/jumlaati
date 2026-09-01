"use client";

import React, { useEffect } from 'react';
import { useCartStore } from "@/lib/stores/cartStore";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils/currency";

export function RequestCard({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0],
    });
    showToast("تمت الإضافة إلى السلة", "success");
  };

  return (
    <div className="group rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-all">
      <div className="aspect-square overflow-hidden rounded-md bg-gray-100 mb-4">
        {/* ضع صورة هنا باستخدام next/image */}
      </div>
      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
      <div className="flex justify-between items-center mb-4">
        <Badge variant="secondary">{product.isWholesale ? "جملة" : "تجزئة"}</Badge>
        <span className="font-bold text-primary text-lg">{formatCurrency(product.price)}</span>
      </div>
      <Button onClick={handleAddToCart} className="w-full">أضف إلى السلة</Button>
    </div>
  );
}

const ProductCard: React.FC = () => {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.warn('Placeholder: ProductCard is not implemented yet.');
  }, []);
  return (
    <div>
      {/* ProductCard placeholder */}
    </div>
  );
};

export default ProductCard;