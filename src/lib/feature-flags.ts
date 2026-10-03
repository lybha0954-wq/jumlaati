const CACHE_TTL = 30 * 1000; // 30 ثانية
let cache: { data: Record<string, boolean>; ts: number } | null = null;

async function fetchFlags(): Promise<Record<string, boolean>> {
  if (cache && Date.now() - cache.ts < CACHE_TTL) return cache.data;
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const res = await fetch(`${url}/rest/v1/feature_flags?select=key,enabled`, {
      headers: { apikey: anon!, Authorization: `Bearer ${anon}` },
      cache: "no-store",
    });
    if (!res.ok) return cache?.data || {};
    const rows: any[] = await res.json();
    const data: Record<string, boolean> = {};
    rows.forEach((r) => { data[r.key] = r.enabled === true; });
    cache = { data, ts: Date.now() };
    return data;
  } catch (err) {
    console.error("[feature-flags] fetch failed:", err);
    return cache?.data || {};
  }
}

export async function isFeatureEnabled(key: string): Promise<boolean> {
  const flags = await fetchFlags();
  return flags[key] === true;
}

export async function requireFeature(key: string): Promise<Response | null> {
  const enabled = await isFeatureEnabled(key);
  if (!enabled) {
    return new Response(
      JSON.stringify({ error: `feature_disabled: ${key}` }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }
  return null;
}
