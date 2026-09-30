"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/stores/cartStore";
import { useToast } from "@/hooks/useToast";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";

export function AddToCartButton({
  productId,
  wholesalerId,
  name,
  price,
  image,
  disabled,
}: {
  productId: string;
  wholesalerId: string;
  name: string;
  price: number;
  image: string | null;
  disabled?: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { showToast } = useToast();

  const handleAdd = () => {
    if (disabled) return;
    addItem({
      productId,
      wholesalerId,
      name,
      price,
      quantity,
      image: image || undefined,
    });
    setAdded(true);
    showToast("✅ أُضيف للسلة", "success");
    setTimeout(() => setAdded(false), 1500);
  };

  if (disabled) {
    return (
      <button disabled
        className="w-full rounded-xl bg-gray-100 py-3.5 text-sm font-bold text-gray-400 cursor-not-allowed">
        غير متوفر حالياً
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-xl border-2 border-gray-200">
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="flex h-11 w-11 items-center justify-center text-gray-600 hover:text-[#2e8b73]"
          aria-label="تقليل">
          <Minus size={16} />
        </button>
        <span className="w-10 text-center text-base font-black text-gray-900">
          {quantity}
        </span>
        <button onClick={() => setQuantity(quantity + 1)}
          className="flex h-11 w-11 items-center justify-center text-gray-600 hover:text-[#2e8b73]"
          aria-label="زيادة">
          <Plus size={16} />
        </button>
      </div>

      <button onClick={handleAdd}
        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-sm transition-all active:scale-95 ${
          added ? "bg-emerald-500" : "bg-[#2e8b73] hover:bg-[#1e6b57]"
        }`}>
        {added ? <Check size={16} /> : <ShoppingCart size={16} />}
        {added ? "تمت الإضافة" : "أضف للسلة"}
      </button>
    </div>
  );
}
