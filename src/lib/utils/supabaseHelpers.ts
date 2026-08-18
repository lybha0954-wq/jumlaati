import { createClient } from '@/lib/supabase/client';
import { isSchemaError } from './dbHelpers';

/**
 * تنفيذ استعلام Supabase بشكل آمن مع إعادة القيمة الافتراضية في حال الفشل
  * يدعم الاستعلامات المباشرة، المفردة (.single/.maybeSingle)، والاستدعاءات البرمجية (.rpc)
   */
   export async function safeSupabase<T>(
     queryFn: (supabase: ReturnType<typeof createClient>) => Promise<{ data?: any; error?: any }>,
       fallback: T,
       ): Promise<T> {
         try {
             const supabase = createClient();
                 if (!supabase) return fallback;

                     const { data, error } = await queryFn(supabase);
                         if (error) {
                               if (isSchemaError(error)) throw error;
                                     return fallback;
                                         }

                                             return (data ?? fallback) as T;
                                               } catch (error: any) {
                                                   if (isSchemaError(error)) throw error;
                                                       return fallback;
                                                         }
                                                         }

                                                         /**
                                                          * تنفيذ إجراءات التعديل أو الحذف أو الإضافة بشكل آمن وإرجاع نجاح العملية (boolean)
                                                           */
                                                           export async function runSupabaseAction(
                                                             actionFn: (supabase: ReturnType<typeof createClient>) => Promise<{ error?: any }>,
                                                               fallback = false,
                                                               ): Promise<boolean> {
                                                                 try {
                                                                     const supabase = createClient();
                                                                         if (!supabase) return fallback;

                                                                             const { error } = await actionFn(supabase);
                                                                                 if (error) {
                                                                                       if (isSchemaError(error)) throw error;
                                                                                             return fallback;
                                                                                                 }

                                                                                                     return true;
                                                                                                       } catch (error: any) {
                                                                                                           if (isSchemaError(error)) throw error;
                                                                                                               return fallback;
                                                                                                                 }
                                                                                                                 }
                                                                                                                 