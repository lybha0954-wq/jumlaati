"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, Heart, Check, Package, Store } from "lucide-react";
import { useCartStore } from "@/lib/stores/cartStore";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";

export function ProductCard({ product }: { product: any }) {
  const addItem = useCartStore((s) => s.addItem);
  const { showToast } = useToast();
  const [isAdded, setIsAdded] = useState(false);

  const price = Number(product.price ?? 0);
  const image = product.image_url || null;
  const stock = Number(product.stock_quantity ?? 0);
  const isOut = stock === 0;
  const isLow = stock > 0 && stock < 10;
  const supplierId = product.supplier_id || "";
  const url = `/products/${product.id}`;
  const supplierName = product.supplier_name || "تاجر جملة";

  const handleAdd = () => {
    if (isOut) {
      showToast("نفد المخزون", "error");
      return;
    }
    addItem({
      productId: String(product.id),
      wholesalerId: supplierId,
      name: product.name,
      price,
      quantity: 1,
      image: image || undefined,
    });
    setIsAdded(true);
    showToast("✅ أُضيف للسلة", "success");
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:-translate-y-1 hover:border-[#2e8b73]/30 hover:shadow-lg dark:bg-gray-900 dark:border-gray-800">
      {/* الرابط الممتد — يغطي البطاقة كاملة */}
      <Link
        href={url}
        aria-label={product.name}
        className="absolute inset-0 z-0"
      />

      {/* صورة */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
        {image ? (
          <Image src={image} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-12 w-12 text-gray-300" />
          </div>
        )}
        {/* شارات */}
        {isOut && (
          <span className="absolute top-2 right-2 z-10 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
            نفد
          </span>
        )}
        {isLow && !isOut && (
          <span className="absolute top-2 right-2 z-10 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
            آخر {stock}
          </span>
        )}
        <button
          type="button"
          className="absolute top-2 left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 opacity-0 shadow-sm transition-all hover:text-rose-500 group-hover:opacity-100 dark:bg-gray-800/90 dark:text-gray-300"
          aria-label="المفضلة"
        >
          <Heart size={14} />
        </button>
      </div>

      {/* محتوى */}
      <div className="relative z-0 flex flex-1 flex-col p-3">
        <h3 className="mb-1 line-clamp-2 min-h-[2.5rem] text-sm font-bold text-gray-900 dark:text-gray-100">
          {product.name}
        </h3>
        {product.category && (
          <p className="mb-2 line-clamp-1 text-[10px] text-gray-400">
            {product.category}
          </p>
        )}
        <p className="mb-3 line-clamp-1 text-[10px] text-gray-500 dark:text-gray-400">
          <Store size={10} className="inline" /> {supplierName}
        </p>

        <div className="mt-auto space-y-2">
          <p className="text-base font-black text-[#2e8b73] dark:text-[#6ecdb0]">
            {formatCurrency(price)}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            disabled={isOut}
            className={`relative z-10 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all active:scale-95 ${
              isOut
                ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                : isAdded
                ? "bg-emerald-500 text-white"
                : "bg-[#2e8b73] text-white hover:bg-[#1e6b57]"
            }`}
          >
            {isAdded ? <Check size={12} /> : <ShoppingCart size={12} />}
            {isOut ? "غير متوفر" : isAdded ? "تمت الإضافة" : "أضف للسلة"}
          </button>
        </div>
      </div>
    </div>
  );
}
