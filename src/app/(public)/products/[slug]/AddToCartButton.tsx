"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/stores/cartStore";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Minus, Plus, ShoppingCart } from "lucide-react";

export function AddToCartButton({
  productId,
  wholesalerId,
  name,
  price,
  image,
}: {
  productId: string;
  wholesalerId: string;
  name: string;
  price: number;
  image: string | null;
}) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { showToast } = useToast();

  const handleAdd = () => {
    addItem({
      productId,
      wholesalerId,
      name,
      price,
      quantity,
      image: image || undefined,
    });
    showToast("تمت الإضافة إلى السلة!", "success");
  };

  return (
    <div className="flex items-center gap-6 mb-8">
      <div className="flex items-center border-2 border-gray-200 rounded-full">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="p-3"
        >
          <Minus size={16} />
        </button>
        <span className="w-12 text-center font-bold">{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)} className="p-3">
          <Plus size={16} />
        </button>
      </div>
      <Button onClick={handleAdd} size="lg" className="gap-2 flex-1">
        <ShoppingCart size={20} />
        أضف للسلة
      </Button>
    </div>
  );
}
