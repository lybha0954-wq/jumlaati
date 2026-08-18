import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
    supabaseUrl !== 'your-supabase-url-here' &&
      Boolean(supabaseAnonKey) &&
        supabaseAnonKey !== 'your-supabase-anon-key-here';

        let _client: ReturnType<typeof createSupabaseClient<Database>> | null = null;

        /**
         * إنشاء أو استرجاع عميل Supabase القياسي المباشر
          */
          export function createClient() {
            if (!isSupabaseConfigured) {
                console.warn('Supabase configuration is missing or using placeholder values.');
                    return null;
                      }

                        if (!_client) {
                            _client = createSupabaseClient<Database>(supabaseUrl!, supabaseAnonKey!);
                              }

                                return _client;
                                }

                                // تصدير كائن جاهز للاستخدام المباشر
                                export const supabase = createClient();
                                