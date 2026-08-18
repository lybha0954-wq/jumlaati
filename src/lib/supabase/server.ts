import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required.');
  }

  if (!supabaseAnonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required.');
    }

    /**
     * عميل السيرفر القياسي — يحترم سياسات الأمان RLS بناءً على جلسة المستخدم المسجلة
      */
      export async function createServerSupabaseClient() {
        const cookieStore = await cookies();

          return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
              cookies: {
                    getAll() {
                            return cookieStore.getAll();
                                  },
                                        setAll(cookiesToSet) {
                                                try {
                                                          cookiesToSet.forEach(({ name, value, options }) =>
                                                                      cookieStore.set(name, value, options)
                                                                                );
                                                                                        } catch {
                                                                                                  // يتم تجاهل الخطأ إذا تم استدعاء الدالة داخل Server Component عادي
                                                                                                            // حيث لا يُسمح بتعديل الكوكيز إلا في Server Actions أو Route Handlers
                                                                                                                    }
                                                                                                                          },
                                                                                                                              },
                                                                                                                                });
                                                                                                                                }

                                                                                                                                /**
                                                                                                                                 * عميل الأدمن — يتخطى سياسات RLS (تُستخدم فقط في المهام الإدارية الحساسة بالسيرفر)
                                                                                                                                  */
                                                                                                                                  export function createAdminClient() {
                                                                                                                                    if (!supabaseServiceKey) {
                                                                                                                                        throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin client.');
                                                                                                                                          }

                                                                                                                                            return createServerClient<Database>(supabaseUrl, supabaseServiceKey, {
                                                                                                                                                cookies: {
                                                                                                                                                      getAll() {
                                                                                                                                                              return [];
                                                                                                                                                                    },
                                                                                                                                                                          setAll() {},
                                                                                                                                                                              },
                                                                                                                                                                                });
                                                                                                                                                                                }
                                                                                                                                                                                