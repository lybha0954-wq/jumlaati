import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin(supabase: any, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  return data?.role === "admin";
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (!(await requireAdmin(supabase, user.id))) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("feature_flags")
      .select("*")
      .order("category", { ascending: true })
      .order("key", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, flags: data || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "خطأ" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (!(await requireAdmin(supabase, user.id))) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { key, enabled } = body;
    if (!key || typeof enabled !== "boolean") {
      return NextResponse.json({ error: "key + enabled required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("feature_flags")
      .update({ enabled })
      .eq("key", key);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, key, enabled });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "خطأ" }, { status: 500 });
  }
}
