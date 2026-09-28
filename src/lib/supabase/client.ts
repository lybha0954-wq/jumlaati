import { createBrowserClient } from "@supabase/ssr";

export const isSupabaseConfigured =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Check .env.local");
  }
  if (client) return client;
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return client;
}
