export const dynamic = "force-dynamic";

import { Topbar } from "@/components/dashboard/Topbar";
import { productService } from "@/lib/services/productService";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";
import { formatCurrency } from "@/lib/utils/currency";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: any = null;
  try {
    const all = await productService.getAllProducts();
    product =
      all.find(
        (p: any) => p.id === slug || p.slug === slug
      ) || null;
  } catch (e) {
    console.error("Product fetch error:", e);
  }

  if (!product) return notFound();

  const image =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : typeof product.images === "string" && product.images.length > 0
      ? product.images
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="max-w-4xl mx-auto pt-6 pb-20 px-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
        >
          <ArrowRight size={18} />
          <span>العودة للمنتجات</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-9xl overflow-hidden relative">
            {image ? (
              <Image
                src={image}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <span>📦</span>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-extrabold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6">
              {product.description || "لا يوجد وصف."}
            </p>
            <div className="text-4xl font-black text-primary mb-8">
              {formatCurrency(product.price)}
            </div>
            <AddToCartButton
              productId={product.id}
              wholesalerId={product.supplier_id || ""}
              name={product.name}
              price={product.price}
              image={image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
