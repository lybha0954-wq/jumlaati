import { createClient } from "@/lib/supabase/server";
import { RequestCard } from "@/components/shared/RequestCard";
import { Topbar } from "@/components/dashboard/Topbar";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // slug هنا هو owner_id (معرّف تاجر الجملة)
  const { data: wholesaler } = await supabase
    .from("user_profiles")
    .select("id, full_name, email, role")
    .eq("id", slug)
    .eq("role", "supplier")
    .single();

  if (!wholesaler) notFound();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("supplier_id", wholesaler.id)
    .eq("status", "متوفر")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background pb-20">
      <Topbar />
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{wholesaler.full_name}</h1>
          <p className="text-muted-foreground">{wholesaler.email}</p>
        </div>

        {(products || []).length === 0 ? (
          <div className="bg-card p-10 text-center text-muted-foreground rounded-2xl border border-dashed border-border">
            لا توجد منتجات في هذا المتجر بعد.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products!.map((p: any) => (
              <RequestCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
