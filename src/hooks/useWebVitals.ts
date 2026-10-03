"use client";

import { useEffect } from "react";

/**
 * Web Vitals tracking
 * يقيس: LCP, FID, CLS, FCP, TTFB
 * يبعث النتائج لـ /api/analytics (إن وُجد) أو console (تطوير)
 */
export function useWebVitals() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // دعم PerformanceObserver الحديث
    if (!("PerformanceObserver" in window)) return;

    const sendMetric = (name: string, value: number) => {
      // في التطوير: console
      if (process.env.NODE_ENV === "development") {
        console.log(`[WebVitals] ${name}: ${value.toFixed(2)}`);
        return;
      }
      // في الإنتاج: نستخدم navigator.sendBeacon (لا يحجب الصفحة)
      try {
        const data = JSON.stringify({
          name,
          value: Math.round(value),
          url: window.location.pathname,
          ts: Date.now(),
        });
        if ("sendBeacon" in navigator) {
          navigator.sendBeacon("/api/analytics/vitals", data);
        }
      } catch {
        // silent
      }
    };

    // LCP — Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry: any = entries[entries.length - 1];
        if (lastEntry) {
          sendMetric("LCP", lastEntry.renderTime || lastEntry.loadTime || 0);
        }
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {}

    // CLS — Cumulative Layout Shift
    let clsValue = 0;
    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        sendMetric("CLS", clsValue);
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });
    } catch {}

    // FCP — First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp: any = entries.find((e: any) => e.name === "first-contentful-paint");
        if (fcp) sendMetric("FCP", fcp.startTime);
      });
      fcpObserver.observe({ type: "paint", buffered: true });
    } catch {}

    // TTFB — Time to First Byte
    try {
      const navEntry = performance.getEntriesByType("navigation")[0] as any;
      if (navEntry) {
        sendMetric("TTFB", navEntry.responseStart);
      }
    } catch {}
  }, []);
}
