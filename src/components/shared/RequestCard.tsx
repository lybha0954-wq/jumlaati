"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/stores/cartStore";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils/currency";
import { ShoppingCart, Heart, Check } from "lucide-react";
import { useState } from "react";

export function RequestCard({ product }: { product: any }) {
  const addItem = useCartStore((s) => s.addItem);
  const { showToast } = useToast();
  const [isFav, setIsFav] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const image =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : typeof product.images === "string" && product.images.length > 0
      ? product.images
      : null;

  const isWholesale =
    product.is_wholesale ?? product.isWholesale ?? false;

  const productUrl = `/products/${product.slug || product.id}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      wholesalerId: product.owner_id || product.ownerId || "default",
      name: product.name,
      price: product.price,
      quantity: 1,
      image: image || undefined,
    });
    setIsAdded(true);
    showToast("تمت الإضافة إلى السلة!", "success");
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <Link href={productUrl} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 mb-4">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              📦
            </div>
          )}
          <Badge
            className="absolute top-2 right-2"
            variant={isWholesale ? "default" : "secondary"}
          >
            {isWholesale ? "جملة" : "تجزئة"}
          </Badge>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          setIsFav(!isFav);
        }}
        className="absolute top-6 left-6 p-2 bg-white/80 rounded-full shadow hover:scale-110 transition-all z-10"
        aria-label="إضافة للمفضلة"
      >
        <Heart
          size={16}
          className={isFav ? "fill-red-500 text-red-500" : "text-gray-500"}
        />
      </button>

      <Link href={productUrl} className="block">
        <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1 hover:text-primary transition-colors">
          {product.name}
        </h3>
      </Link>
      <p className="text-sm text-gray-500 mb-3">{product.category}</p>

      <div className="mt-auto">
        <span className="block font-extrabold text-primary text-xl mb-3">
          {formatCurrency(product.price)}
        </span>
        <Button
          onClick={handleAddToCart}
          size="sm"
          className="w-full"
        >
          {isAdded ? (
            <Check size={16} className="ml-1" />
          ) : (
            <ShoppingCart size={16} className="ml-1" />
          )}
          {isAdded ? "تمت الإضافة" : "أضف للسلة"}
        </Button>
      </div>
    </div>
  );
}
