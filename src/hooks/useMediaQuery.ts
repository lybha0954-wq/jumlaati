"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

// أجهزة مريحة (تابلت): width ≥768 AND height ≥600
export function useIsComfortable(): boolean {
  return useMediaQuery("(min-width: 768px) and (min-height: 600px)");
}

// لابتوب/تابلت عرضي: width ≥900 AND height ≥500
// (أخف من السابق — يمنع فشل التابلت العرضي)
export function useIsLaptop(): boolean {
  return useMediaQuery("(min-width: 900px) and (min-height: 500px)");
}
