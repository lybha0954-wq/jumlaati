'use client';

import { useEffect, useRef } from 'react';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

export interface SubscriptionConfig<T extends Record<string, any> = Record<string, any>> {
  table: string;
    schema?: string;
      event?: RealtimeEvent;
        filter?: string;
          onData: (payload: RealtimePostgresChangesPayload<T>) => void;
          }

          let channelCounter = 0;

          /**
           * useRealtimeSubscription — للاشتراك في جدول واحد بشكل لحظي مع Supabase.
            * يتنظف تلقائياً عند إلغاء التركيب (Unmount).
             */
             export function useRealtimeSubscription<T extends Record<string, any> = Record<string, any>>(
               config: SubscriptionConfig<T>
               ) {
                 const { table, schema = 'public', event = '*', filter, onData } = config;
                   
                     // حفظ مرجع التمرير لتفادي إعادة الاشتراك عند تغيير الدالة
                       const onDataRef = useRef(onData);
                         onDataRef.current = onData;

                           // معرف فريد ومستقر لكل مجرى استماع
                             const channelIdRef = useRef<number | null>(null);
                               if (channelIdRef.current === null) {
                                   channelIdRef.current = ++channelCounter;
                                     }

                                       useEffect(() => {
                                           if (!isSupabaseConfigured) return;
                                               const supabase = createClient();
                                                   if (!supabase) return;

                                                       const channelName = `rt-${table}-${channelIdRef.current}`;

                                                           const channel = supabase.channel(channelName);
                                                               
                                                                   channel
                                                                         .on(
                                                                                 'postgres_changes' as any,
                                                                                         {
                                                                                                   event,
                                                                                                             schema,
                                                                                                                       table,
                                                                                                                                 ...(filter ? { filter } : {}),
                                                                                                                                         },
                                                                                                                                                 (payload: RealtimePostgresChangesPayload<T>) => {
                                                                                                                                                           onDataRef.current(payload);
                                                                                                                                                                   }
                                                                                                                                                                         )
                                                                                                                                                                               .subscribe();

                                                                                                                                                                                   return () => {
                                                                                                                                                                                         supabase.removeChannel(channel);
                                                                                                                                                                                             };
                                                                                                                                                                                               }, [table, schema, event, filter]);
                                                                                                                                                                                               }

                                                                                                                                                                                               /**
                                                                                                                                                                                                * useMultipleRealtimeSubscriptions — للاشتراك في عدة جداول دفعة واحدة عبر قناة واحدة موحدة.
                                                                                                                                                                                                 * تمنع تعدد القنوات وتمنع أخطاء تعارض الاشتراكات المتعددة.
                                                                                                                                                                                                  */
                                                                                                                                                                                                  export function useMultipleRealtimeSubscriptions(configs: SubscriptionConfig[]) {
                                                                                                                                                                                                    const onDataRefs = useRef<Array<(payload: any) => void>>([]);
                                                                                                                                                                                                      onDataRefs.current = configs.map((c) => c.onData);

                                                                                                                                                                                                        const instanceIdRef = useRef<number | null>(null);
                                                                                                                                                                                                          if (instanceIdRef.current === null) {
                                                                                                                                                                                                              instanceIdRef.current = ++channelCounter;
                                                                                                                                                                                                                }

                                                                                                                                                                                                                  // مفتاح مستقر للتحقق من تغير الجداول أو الفلاتر
                                                                                                                                                                                                                    const configKey = configs
                                                                                                                                                                                                                        .map((c) => `${c.table}:${c.schema ?? 'public'}:${c.event ?? '*'}:${c.filter ?? ''}`)
                                                                                                                                                                                                                            .join('|');

                                                                                                                                                                                                                              useEffect(() => {
                                                                                                                                                                                                                                  if (!isSupabaseConfigured || configs.length === 0) return;
                                                                                                                                                                                                                                      const supabase = createClient();
                                                                                                                                                                                                                                          if (!supabase) return;

                                                                                                                                                                                                                                              const channelName = `multi-rt-${instanceIdRef.current}`;
                                                                                                                                                                                                                                                  const channel = supabase.channel(channelName);

                                                                                                                                                                                                                                                      // ربط جميع الاستماعات بداخل نفس القناة قبل بدء الاشتراك
                                                                                                                                                                                                                                                          configs.forEach((cfg, idx) => {
                                                                                                                                                                                                                                                                const { table, schema = 'public', event = '*', filter } = cfg;

                                                                                                                                                                                                                                                                      channel.on(
                                                                                                                                                                                                                                                                              'postgres_changes' as any,
                                                                                                                                                                                                                                                                                      {
                                                                                                                                                                                                                                                                                                event,
                                                                                                                                                                                                                                                                                                          schema,
                                                                                                                                                                                                                                                                                                                    table,
                                                                                                                                                                                                                                                                                                                              ...(filter ? { filter } : {}),
                                                                                                                                                                                                                                                                                                                                      },
                                                                                                                                                                                                                                                                                                                                              (payload: any) => {
                                                                                                                                                                                                                                                                                                                                                        onDataRefs.current[idx]?.(payload);
                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                      );
                                                                                                                                                                                                                                                                                                                                                                          });

                                                                                                                                                                                                                                                                                                                                                                              // تفعيل الاشتراك للقناة الموحدة
                                                                                                                                                                                                                                                                                                                                                                                  channel.subscribe();

                                                                                                                                                                                                                                                                                                                                                                                      return () => {
                                                                                                                                                                                                                                                                                                                                                                                            supabase.removeChannel(channel);
                                                                                                                                                                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                                                                                                                                                                    // eslint-disable-next-line react-hooks/exhaustive-deps
                                                                                                                                                                                                                                                                                                                                                                                                      }, [configKey]);
                                                                                                                                                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                                                                                                                                      