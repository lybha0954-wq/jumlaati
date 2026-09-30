"use client";

import { useEffect, useState } from "react";

/**
 * hook للتحقق من ميزة على العميل
 * يبدأ بـ null حتى نعرف الحالة، ثم true/false
 */
export function useFeatureFlag(key: string): boolean | null {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/feature-flags")
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => {
        if (cancelled) return;
        setEnabled(data?.flags?.[key] === true);
      })
      .catch(() => {
        if (!cancelled) setEnabled(false);
      });
    return () => { cancelled = true; };
  }, [key]);

  return enabled;
}
