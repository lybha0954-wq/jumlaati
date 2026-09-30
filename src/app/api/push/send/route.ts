import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";
import { requireFeature } from "@/lib/feature-flags";

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@jumlati.iq";

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
}

export async function POST(req: Request) {
  try {
    const guard = await requireFeature("push_manual");
    if (guard) return guard;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // فقط admin أو من خلال service role
    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, body, url, userId } = await req.json();
    if (!title) return NextResponse.json({ error: "No title" }, { status: 400 });

    let q = supabase.from("push_subscriptions").select("*");
    if (userId) q = q.eq("user_id", userId);

    const { data: subs, error } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (!subs || subs.length === 0) {
      return NextResponse.json({ ok: true, sent: 0 });
    }

    const payload = JSON.stringify({
      title, body: body || "", url: url || "/",
    });

    let sent = 0;
    const failures: string[] = [];

    for (const s of subs) {
      try {
        await webpush.sendNotification(
          {
            endpoint: s.endpoint,
            keys: { p256dh: s.p256dh, auth: s.auth },
          },
          payload
        );
        sent++;
      } catch (err: any) {
        failures.push(s.endpoint.slice(-20));
        // 410/404 = اشتراك منتهي → احذفه
        if (err?.statusCode === 410 || err?.statusCode === 404) {
          await supabase.from("push_subscriptions").delete().eq("id", s.id);
        }
      }
    }

    return NextResponse.json({ ok: true, sent, failures });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "خطأ" }, { status: 500 });
  }
}
