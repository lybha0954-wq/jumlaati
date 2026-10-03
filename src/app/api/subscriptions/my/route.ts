import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMySubscription } from "@/lib/subscriptions/helper";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const sub = await getMySubscription();
    return NextResponse.json({ subscription: sub });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "خطأ" }, { status: 500 });
  }
}
