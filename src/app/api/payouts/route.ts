import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireFeature } from "@/lib/feature-flags";

// فحص auth
async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase: null, user: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  return { supabase, user, error: null };
}

export async function GET() {
  const guard = await requireFeature("payouts");
  if (guard) return guard;
  const { supabase, user, error } = await requireUser();
  if (error) return error;

  // جلب سحوبات المستخدم الحالي
  const { data, error: dbErr } = await supabase!
    .from("payouts")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json(data || []);
}
