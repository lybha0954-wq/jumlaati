// ═══════════════════════════════════════════════════
// Subscription Helper
// ═══════════════════════════════════════════════════

import { createClient } from "@/lib/supabase/server";

export interface SubscriptionPlan {
  key: string;
  name: string;
  description: string | null;
  price_iqd: number;
  period_days: number;
  feature_keys: string[];
  enabled: boolean;
  is_recommended: boolean;
  sort_order: number;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_key: string;
  status: "pending" | "active" | "expired" | "cancelled";
  paid_amount: number;
  payment_method: string | null;
  payment_ref: string | null;
  started_at: string | null;
  expires_at: string | null;
  auto_renew: boolean;
  created_at: string;
}

/**
 * جلب كل خطط الاشتراك المتاحة
 */
export async function getPlans(): Promise<SubscriptionPlan[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("enabled", true)
    .order("sort_order");
  return (data || []) as SubscriptionPlan[];
}

/**
 * جلب اشتراك المستخدم الحالي (النشط)
 */
export async function getMySubscription(): Promise<UserSubscription | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .gte("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data as UserSubscription | null;
}

/**
 * فحص هل المستخدم لديه اشتراك نشط
 */
export async function hasActiveSubscription(userId?: string): Promise<boolean> {
  const supabase = await createClient();
  let uid = userId;
  if (!uid) {
    const { data: { user } } = await supabase.auth.getUser();
    uid = user?.id;
  }
  if (!uid) return false;

  const { data } = await supabase
    .from("user_subscriptions")
    .select("id")
    .eq("user_id", uid)
    .eq("status", "active")
    .gte("expires_at", new Date().toISOString())
    .limit(1)
    .maybeSingle();

  return !!data;
}

/**
 * فحص هل المستخدم لديه ميزة معينة (عبر اشتراكه)
 */
export async function userHasPlanFeature(
  userId: string,
  featureKey: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("user_subscriptions")
    .select("plan_key, expires_at")
    .eq("user_id", userId)
    .eq("status", "active")
    .gte("expires_at", new Date().toISOString());

  if (!data || data.length === 0) return false;

  const planKeys = data.map((s: any) => s.plan_key);
  const { data: plans } = await supabase
    .from("subscription_plans")
    .select("feature_keys")
    .in("key", planKeys);

  for (const plan of plans || []) {
    if ((plan.feature_keys || []).includes(featureKey)) {
      return true;
    }
  }
  return false;
}

/**
 * تفعيل اشتراك (بعد الدفع)
 */
export async function activateSubscription(
  userId: string,
  planKey: string,
  paymentRef: string,
  paymentMethod: string,
  paidAmount: number
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const supabase = await createClient();

  // 1) جلب الخطة
  const { data: plan } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("key", planKey)
    .maybeSingle();

  if (!plan) return { ok: false, error: "plan_not_found" };

  // 2) حساب تاريخ الانتهاء
  const now = new Date();
  const expires = new Date(now);
  expires.setDate(expires.getDate() + (plan.period_days || 30));

  // 3) إنشاء الاشتراك
  const { data: sub, error } = await supabase
    .from("user_subscriptions")
    .insert({
      user_id: userId,
      plan_key: planKey,
      status: "active",
      paid_amount: paidAmount,
      payment_method: paymentMethod,
      payment_ref: paymentRef,
      started_at: now.toISOString(),
      expires_at: expires.toISOString(),
    })
    .select()
    .single();

  if (error || !sub) return { ok: false, error: error?.message };

  // 4) تسجيل المعاملة
  await supabase.from("payment_transactions").insert({
    user_id: userId,
    amount: paidAmount,
    method: paymentMethod,
    gateway_ref: paymentRef,
    status: "success",
    related_subscription_id: sub.id,
  });

  return { ok: true, id: sub.id };
}

/**
 * إلغاء اشتراك
 */
export async function cancelSubscription(subId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("user_subscriptions")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", subId);
  return { ok: !error, error: error?.message };
}
