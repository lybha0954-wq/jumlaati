import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireFeature } from "@/lib/feature-flags";

export async function GET() {
  try {
    const guard = await requireFeature("requests");
    if (guard) return guard;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).maybeSingle();
    const isAdmin = profile?.role === "admin";

    let q = supabase.from("requests").select("*").order("created_at", { ascending: false });
    if (!isAdmin) q = q.eq("user_id", user.id);

    const { data, error } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // إرفاق أسماء المستخدمين
    const ids = [...new Set((data || []).map((r: any) => r.user_id).filter(Boolean))];
    let nameMap: Record<string, string> = {};
    if (ids.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles").select("id, full_name").in("id", ids);
      (profiles || []).forEach((p: any) => { nameMap[p.id] = p.full_name || ""; });
    }

    const enriched = (data || []).map((r: any) => ({
      ...r,
      requester_name: nameMap[r.user_id] || "مستخدم",
    }));

    return NextResponse.json(enriched);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const guard = await requireFeature("requests");
    if (guard) return guard;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subject, body, priority } = await req.json();
    if (!subject) return NextResponse.json({ error: "الموضوع مطلوب" }, { status: 400 });

    const { data, error } = await supabase
      .from("requests")
      .insert({
        user_id: user.id,
        subject,
        body: body || null,
        priority: priority || "normal",
        status: "open",
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
