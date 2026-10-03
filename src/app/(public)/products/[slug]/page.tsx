export const dynamic = "force-dynamic";

import { Topbar } from "@/components/dashboard/Topbar";
import Image from "next/image";
import { productService } from "@/lib/services/productService";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, Package, Store, ShoppingCart, AlertTriangle,
  CheckCircle2, XCircle,
} from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";
import { ReviewsSection } from "./ReviewsSection";
import { formatCurrency } from "@/lib/utils/currency";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: any = null;
  let supplier: any = null;
  try {
    const all = await productService.getAllProducts();
    product = all.find((p: any) => String(p.id) === slug) || null;
  } catch (e) {
    console.error("Product fetch error:", e);
  }

  if (!product) return notFound();

  const image = product.image_url || null;
  const price = Number(product.price ?? 0);
  const stock = Number(product.stock_quantity ?? 0);
  const isOut = stock === 0;
  const isLow = stock > 0 && stock < 10;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Topbar />
      <div className="mx-auto max-w-5xl px-4 pt-5">
        {/* رجوع */}
        <Link href="/products"
          className="mb-5 inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm font-bold text-gray-600 hover:border-[#2e8b73]/30 hover:text-[#2e8b73]">
          <ArrowRight size={16} /> العودة للمنتجات
        </Link>

        {/* البطاقة الرئيسية */}
        <div className="grid grid-cols-1 gap-6 rounded-2xl border border-gray-100 bg-white p-5 md:grid-cols-2 md:p-7">
          {/* صورة */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
            {image ? (
              <Image src={image} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover" priority />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="h-16 w-16 text-gray-300" />
              </div>
            )}
            {/* شارات */}
            {isOut && (
              <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                <XCircle size={12} /> نفد المخزون
              </span>
            )}
            {isLow && !isOut && (
              <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                <AlertTriangle size={12} /> آخر {stock} قطع
              </span>
            )}
            {!isLow && !isOut && (
              <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-[#2e8b73] px-3 py-1 text-xs font-bold text-white">
                <CheckCircle2 size={12} /> متوفر
              </span>
            )}
          </div>

          {/* التفاصيل */}
          <div className="flex flex-col">
            <h1 className="mb-2 text-2xl font-black text-gray-900 md:text-3xl">
              {product.name}
            </h1>
            {product.category && (
              <Link href={`/products?cat=${encodeURIComponent(product.category)}`}
                className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 hover:bg-gray-200">
                {product.category}
              </Link>
            )}

            {product.description && (
              <p className="mb-4 text-sm leading-relaxed text-gray-600">
                {product.description}
              </p>
            )}

            {/* السعر */}
            <div className="mb-4 rounded-2xl bg-[#e8f4f0] p-4">
              <p className="text-xs text-[#1e6b57]">السعر</p>
              <p className="mt-1 text-3xl font-black text-[#1e6b57]">
                {formatCurrency(price)}
              </p>
              {product.unit && (
                <p className="mt-0.5 text-[11px] text-[#1e6b57]/70">
                  للوحدة ({product.unit})
                </p>
              )}
            </div>

            {/* معلومات */}
            <div className="mb-4 space-y-1.5 text-xs text-gray-500">
              {product.sku && (
                <p>رمز المنتج: <span className="font-mono font-bold text-gray-700">{product.sku}</span></p>
              )}
              {product.min_order_quantity > 0 && (
                <p>الحد الأدنى للطلب: <span className="font-bold text-gray-700">{product.min_order_quantity}</span></p>
              )}
              {!isOut && (
                <p>المتوفر: <span className="font-bold text-gray-700">{stock} قطعة</span></p>
              )}
            </div>

            {/* زر الإضافة */}
            <div className="mt-auto">
              <AddToCartButton
                productId={product.id}
                wholesalerId={product.supplier_id || ""}
                name={product.name}
                price={price}
                image={image}
                disabled={isOut}
              />
            </div>
          </div>
        </div>

        {/* Reviews */}
        <ReviewsSection productId={product.id} />
      </div>
    </div>
  );
}
