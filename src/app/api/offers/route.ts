import { NextResponse } from "next/server";
import { requireFeature } from "@/lib/feature-flags";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const guard = await requireFeature("offers");
    if (guard) return guard;

    const supabase = await createClient();

    const { data: offers, error } = await supabase
      .from("offers")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json([]);

    // إثراء بأسماء التجار والمنتجات
    const supplierIds = [...new Set((offers || []).map((o: any) => o.supplier_id).filter(Boolean))];
    const productIds = [...new Set((offers || []).map((o: any) => o.product_id).filter(Boolean))];

    const [suppliersRes, productsRes] = await Promise.all([
      supplierIds.length
        ? supabase.from("profiles").select("id, full_name, business_name").in("id", supplierIds)
        : Promise.resolve({ data: [] }),
      productIds.length
        ? supabase.from("products").select("id, name, price, image_url").in("id", productIds)
        : Promise.resolve({ data: [] }),
    ]);

    const supplierMap = new Map((suppliersRes.data || []).map((s: any) => [s.id, s]));
    const productMap = new Map((productsRes.data || []).map((p: any) => [p.id, p]));

    const enriched = (offers || []).map((o: any) => ({
      ...o,
      supplier_name: (supplierMap.get(o.supplier_id) as any)?.business_name
        || (supplierMap.get(o.supplier_id) as any)?.full_name
        || null,
      product_name: (productMap.get(o.product_id) as any)?.name || null,
      product_price: (productMap.get(o.product_id) as any)?.price || null,
      product_image: (productMap.get(o.product_id) as any)?.image_url || null,
    }));

    return NextResponse.json(enriched);
  } catch (e: any) {
    return NextResponse.json([]);
  }
}
