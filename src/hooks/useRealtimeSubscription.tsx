'use client';
import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeSubscriptionOptions {
  table: string;
  event?: RealtimeEvent;
  schema?: string;
  filter?: string;
  onData: (payload?: any) => void;
}

export function useRealtimeSubscription({
  table,
  event = '*',
  schema = 'public',
  filter,
  onData,
}: UseRealtimeSubscriptionOptions): null {
  const onDataRef = useRef(onData);
  onDataRef.current = onData;

  useEffect(() => {
    const channelName = `realtime:${schema}:${table}:${event}:${filter ?? 'all'}:${Math.random()}`;

    const channelConfig: any = {
      event,
      schema,
      table,
    };
    if (filter) {
      channelConfig.filter = filter;
    }

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', channelConfig, (payload: any) => {
        onDataRef.current(payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, event, schema, filter]);

  return null;
}
