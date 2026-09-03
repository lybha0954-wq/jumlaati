import { createClient } from "@/lib/supabase/server";
import { RequestCard } from '@/components/shared/RequestCard';
import { Topbar } from "@/components/dashboard/Topbar";
import { notFound } from "next/navigation";

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient(); // تعديل مهم جداً
  const { data: store } = await supabase.from("stores").select("*").eq("slug", slug).single();

  if (!store) notFound();

  const { data: products } = await supabase.from("products").select("*").eq("store_id", store.id);

  return (
    <div className="container mx-auto py-12">
      <Topbar />
      <h1 className="text-3xl font-bold mb-8">{store.name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <RequestCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
