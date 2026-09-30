import { NextResponse } from "next/server";
import { getMySubscription } from "@/lib/subscriptions/helper";

export async function GET() {
  try {
    const sub = await getMySubscription();
    return NextResponse.json({ subscription: sub });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
