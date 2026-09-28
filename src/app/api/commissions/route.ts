import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// فحص auth + الدور
async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !["admin", "owner"].includes(profile.role)) {
    return { supabase: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { supabase, error: null };
}

export async function GET() {
  const { supabase, error } = await requireAdmin();
  if (error) return error;

  const { data, error: dbErr } = await supabase!
    .from("commissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json(data || []);
}
