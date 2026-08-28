'use client';
import { useEffect, useRef } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface SubscriptionConfig {
  table: string;
  schema?: string;
  event?: RealtimeEvent;
  filter?: string;
  onData: (payload: any) => void;
}

let channelCounter = 0;

/**
 * useRealtimeSubscription — subscribes to one Supabase table channel.
 * Automatically cleans up on unmount. No-ops when Supabase is not configured.
 */
export function useRealtimeSubscription(config: SubscriptionConfig) {
  const { table, schema = 'public', event = '*', filter, onData } = config;
  const onDataRef = useRef(onData);
  onDataRef.current = onData;

  // Stable unique ID per hook instance — avoids Date.now() collisions in StrictMode
  const channelIdRef = useRef<number | null>(null);
  if (channelIdRef.current === null) {
    channelIdRef.current = ++channelCounter;
  }

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    if (!supabase) return;

    const channelName = `rt-${table}-${channelIdRef.current}`;

    // Build channel, attach listener, then subscribe — all before any async gap
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
        (payload: any) => {
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
 * useMultipleRealtimeSubscriptions — subscribes to multiple tables at once.
 * Uses a single useEffect to avoid Rules of Hooks violations and the
 * "cannot add postgres_changes callbacks after subscribe()" error.
 */
export function useMultipleRealtimeSubscriptions(configs: SubscriptionConfig[]) {
  const onDataRefs = useRef<Array<(payload: any) => void>>([]);
  onDataRefs.current = configs.map((c) => c.onData);

  // Stable unique ID per hook instance
  const instanceIdRef = useRef<number | null>(null);
  if (instanceIdRef.current === null) {
    instanceIdRef.current = ++channelCounter;
  }

  // Stable key derived from config identities (table/schema/event/filter)
  const configKey = configs
    .map((c) => `${c.table}:${c.schema ?? 'public'}:${c.event ?? '*'}:${c.filter ?? ''}`)
    .join('|');

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    if (!supabase) return;

    const channels = configs.map((cfg, idx) => {
      const { table, schema = 'public', event = '*', filter } = cfg;
      const channelName = `rt-${table}-${instanceIdRef.current}-${idx}`;

      // Build channel, attach listener, then subscribe atomically
      const ch = supabase.channel(channelName);
      ch.on(
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
      ).subscribe();

      return ch;
    });

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configKey]);
}
