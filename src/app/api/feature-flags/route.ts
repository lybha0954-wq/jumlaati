import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("feature_flags")
      .select("key, enabled");

    if (error) return NextResponse.json({ flags: {} });

    const flags: Record<string, boolean> = {};
    (data || []).forEach((f: any) => { flags[f.key] = f.enabled; });

    return NextResponse.json({ flags }, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    console.error("[api/feature-flags] error:", err);
    return NextResponse.json({ flags: {} });
  }
}
