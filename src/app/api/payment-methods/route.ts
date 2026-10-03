import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) return NextResponse.json([]);
    return NextResponse.json(data || [], {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch {
    return NextResponse.json([]);
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const { key, enabled } = await req.json();
    if (!key || typeof enabled !== "boolean") {
      return NextResponse.json({ error: "key + enabled required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("payment_methods")
      .update({ enabled })
      .eq("key", key);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, key, enabled });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
