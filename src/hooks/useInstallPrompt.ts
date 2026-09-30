"use client";

import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "jumlati_install_dismissed";
const DISMISS_DAYS = 7;

export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(true); // مخفي افتراضياً

  useEffect(() => {
    if (typeof window === "undefined") return;

    // هل التطبيق مثبّت؟
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(standalone);

    // iOS؟
    const ua = window.navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream);

    // هل تم التجاهل سابقاً؟
    const raw = localStorage.getItem(DISMISS_KEY);
    if (raw) {
      const ts = parseInt(raw, 10);
      if (Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000) {
        setDismissed(true);
        return;
      }
    }
    setDismissed(false);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferred) return false;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
        setDeferred(null);
        return true;
      }
    } catch {}
    return false;
  }, [deferred]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  }, []);

  // يظهر إذا: غير مثبّت + لم يُتجاهل + (متصفح يدعم beforeinstallprompt أو iOS)
  const canShow = !isInstalled && !dismissed && (!!deferred || isIOS);

  return { canShow, isInstalled, isIOS, promptInstall, dismiss, deferred };
}
