import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireFeature } from "@/lib/feature-flags";

// Matching = relationships (علاقات ثقة بين الأدوار)
export async function GET() {
  const guard = await requireFeature("matching");
  if (guard) return guard;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("relationships")
    .select(`
      id,
      status,
      created_at,
      retailer:retailer_id ( id, full_name, email, role ),
      supplier:supplier_id ( id, full_name, email, role )
    `)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}
