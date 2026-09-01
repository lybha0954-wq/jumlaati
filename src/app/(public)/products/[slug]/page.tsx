import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/currency";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: product } = await supabase.from("products").select("*").eq("slug", params.slug).single();

  if (!product) notFound();

  return (
    <div className="container mx-auto py-12 px-4 flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/2 aspect-square bg-gray-200 rounded-lg" />
      <div className="w-full md:w-1/2 space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-2xl font-bold text-blue-600">{formatCurrency(product.price)}</p>
        <Button className="w-full md:w-auto">أضف إلى السلة</Button>
      </div>
    </div>
  );
}
