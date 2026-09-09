"use client";
import { useCartStore } from "@/lib/stores/cartStore";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils/currency";
import { ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";

export function RequestCard({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();
  const [isFav, setIsFav] = useState(false);

  const handleAddToCart = () => {
    addItem({ productId: product.id, wholesalerId: product.owner_id || "default", name: product.name, price: product.price, quantity: 1 });
    showToast("تمت الإضافة إلى السلة بنجاح!", "success");
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* صورة وهمية (يتم استبدالها بـ Next/Image لاحقاً) */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 mb-4">
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center text-6xl">
          📦
        </div>
        <Badge className="absolute top-2 right-2" variant={product.is_wholesale ? "default" : "secondary"}>
          {product.is_wholesale ? "جملة" : "تجزئة"}
        </Badge>
        <button onClick={() => setIsFav(!isFav)} className="absolute top-2 left-2 p-2 bg-white/80 rounded-full shadow hover:scale-110 transition-all">
          <Heart size={16} className={isFav ? "fill-red-500 text-red-500" : "text-gray-500"} />
        </button>
      </div>
      
      <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
      <p className="text-sm text-gray-500 mb-3">{product.category}</p>
      
      <div className="mt-auto">
        <span className="block font-extrabold text-primary text-xl mb-3">{formatCurrency(product.price)}</span>
        <Button onClick={handleAddToCart} size="sm" className="w-full opacity-90 group-hover:opacity-100">
          <ShoppingCart size={16} className="ml-1" /> أضف للسلة
        </Button>
      </div>
    </div>
  );
}
