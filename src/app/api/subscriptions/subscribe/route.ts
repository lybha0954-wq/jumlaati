import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { activateSubscription } from "@/lib/subscriptions/helper";
import { rateLimit, buildKey, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const rl = rateLimit(buildKey(req), { windowMs: 60000, max: 5 });
    if (!rl.allowed) return rateLimitResponse(rl);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const { plan_key, payment_method, payment_ref } = await req.json();
    if (!plan_key) return NextResponse.json({ error: "plan_key required" }, { status: 400 });

    const { data: plan } = await supabase
      .from("subscription_plans")
      .select("price_iqd")
      .eq("key", plan_key)
      .maybeSingle();

    if (!plan) return NextResponse.json({ error: "plan_not_found" }, { status: 404 });

    const result = await activateSubscription(
      user.id,
      plan_key,
      payment_ref || `manual-${Date.now()}`,
      payment_method || "manual",
      Number(plan.price_iqd) || 0
    );

    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({ ok: true, id: result.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
