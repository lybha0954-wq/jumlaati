import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// التحقق من وجود المتغيرات البيئية
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * إنشاء أو استرجاع عميل Supabase الخاص بالمتصفح (Singleton)
  */
  export function createClient() {
    if (!isSupabaseConfigured) {
        throw new Error(
              'Supabase client is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file.'
                  );
                    }

                      if (!browserClient) {
                          browserClient = createBrowserClient<Database>(
                                supabaseUrl!,
                                      supabaseAnonKey!
                                          );
                                            }

                                              return browserClient;
                                              }

                                              // تصدير نسخة جاهزة للاستخدام المباشر في مكونات العميل Client Components
                                              export const supabase = isSupabaseConfigured ? createClient() : null;
                                              