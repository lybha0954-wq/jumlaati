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

  // ─── توافق مع Supabase + Legacy ───
  // السعر: final_price (Supabase) أو price (Legacy)
  const price = Number(product.final_price ?? product.price ?? 0);

  // الصورة: images[] (Legacy) أو image (مفرد) أو لا شيء
  const image =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : typeof product.image === "string" && product.image.length > 0
      ? product.image
      : typeof product.images === "string" && product.images.length > 0
      ? product.images
      : null;

  // المورد: supplier_id (Supabase) أو owner_id (Legacy)
  const supplierId = product.supplier_id || product.owner_id || product.ownerId || "default";

  // الرابط: slug (Legacy) أو id (Supabase)
  const productUrl = `/products/${product.slug || product.id}`;

  // الحالة: هل هو جملة؟ (من stock, min_order_qty)
  const isWholesale = product.is_wholesale ?? product.isWholesale ?? true;

  // حالة المخزون من product_status enum العربي
  const status = product.status || "متوفر";
  const isLowStock = status === "منخفض";
  const isOutOfStock = status === "نفد";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      showToast("هذا المنتج غير متوفر حالياً", "error");
      return;
    }
    addItem({
      productId: product.id,
      wholesalerId: supplierId,
      name: product.name,
      price: price,
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
      <p className="text-sm text-gray-500 mb-3">{product.category || "منتج"}</p>

      <div className="mt-auto">
        <div className="flex items-center justify-between mb-3">
          <span className="block font-extrabold text-primary text-xl">
            {formatCurrency(price)}
          </span>
          {isLowStock && (
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              كمية محدودة
            </span>
          )}
          {isOutOfStock && (
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
              نفد
            </span>
          )}
        </div>
        <Button
          onClick={handleAddToCart}
          size="sm"
          className="w-full"
          disabled={isOutOfStock}
        >
          {isAdded ? (
            <Check size={16} className="ml-1" />
          ) : (
            <ShoppingCart size={16} className="ml-1" />
          )}
          {isOutOfStock ? "غير متوفر" : isAdded ? "تمت الإضافة" : "أضف للسلة"}
        </Button>
      </div>
    </div>
  );
}
