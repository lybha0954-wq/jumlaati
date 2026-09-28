import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // قراءة الدور من user_profiles (المصدر الصحيح)
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin" && profile?.role !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // جلب كل المستخدمين
    const { data, error } = await supabase
      .from("user_profiles")
      .select("id, email, full_name, role, phone, business_name, governorate, created_at")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // إرجاع بأسماء متوافقة مع الواجهة
    const users = (data || []).map((u: any) => ({
      id: u.id,
      name: u.full_name || u.email,
      email: u.email,
      role: u.role,
      phone: u.phone,
      business_name: u.business_name,
      governorate: u.governorate,
      created_at: u.created_at,
    }));

    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
