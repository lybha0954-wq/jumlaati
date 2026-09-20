'use client';

import { useEffect, useRef } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, onSnapshot, query } from 'firebase/firestore';

interface SubscriptionConfig {
  table: string; // mapped to collection
  schema?: string;
  event?: string;
  filter?: string;
  onData: (payload: any) => void;
}

export function useRealtimeSubscription(config: SubscriptionConfig) {
  const { table, onData } = config;
  const onDataRef = useRef(onData);
  onDataRef.current = onData;

  useEffect(() => {
    if (!db || !table) return;

    try {
      const colRef = collection(db, table);
      const unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            onDataRef.current({
              eventType: change.type.toUpperCase(),
              new: { id: change.doc.id, ...change.doc.data() },
              old: change.type === 'removed' ? { id: change.doc.id } : null,
            });
          });
        },
        (error) => {
          console.warn(`Firestore real-time subscription error for [${table}]:`, error);
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.warn('Realtime hook error:', e);
    }
  }, [table]);
}

export function useMultipleRealtimeSubscriptions(configs: SubscriptionConfig[]) {
  const onDataRefs = useRef<Array<(payload: any) => void>>([]);
  onDataRefs.current = configs.map((c) => c.onData);

  useEffect(() => {
    if (!db) return;

    const unsubs: Array<() => void> = [];

    configs.forEach((cfg, idx) => {
      try {
        const colRef = collection(db, cfg.table);
        const unsub = onSnapshot(
          colRef,
          (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              onDataRefs.current[idx]?.({
                eventType: change.type.toUpperCase(),
                new: { id: change.doc.id, ...change.doc.data() },
                old: change.type === 'removed' ? { id: change.doc.id } : null,
              });
            });
          },
          () => {}
        );
        unsubs.push(unsub);
      } catch (e) {
        console.warn('Error setting up multi-realtime:', e);
      }
    });

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [configs]);
}
