"use client";

import { useCallback, useEffect, useState } from "react";

type Status = "unsupported" | "default" | "granted" | "denied" | "loading";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i);
  return output;
}

export function usePushNotifications() {
  const [status, setStatus] = useState<Status>("loading");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // تحديد الحالة الأولية
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    const perm = Notification.permission;
    setStatus(perm === "granted" ? "granted" : perm === "denied" ? "denied" : "default");
  }, []);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (busy) return false;
    setBusy(true);
    setError(null);

    try {
      // 1) صلاحية
      if (Notification.permission !== "granted") {
        const perm = await Notification.requestPermission();
        if (perm !== "granted") {
          setStatus("denied");
          setBusy(false);
          return false;
        }
      }

      // 2) تسجيل SW + انتظار الجهوزية
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // 3) مفتاح VAPID من الخادم
      const keyRes = await fetch("/api/push/vapid");
      const keyData = await keyRes.json();
      if (!keyData.publicKey) throw new Error("VAPID public key missing");

      // 4) اشتراك (أو إعادة استخدام موجود)
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(keyData.publicKey) as any,
        });
      }

      // 5) حفظ في الخادم
      const saveRes = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok || !saveData.ok) {
        throw new Error(saveData.error || "save failed");
      }

      setStatus("granted");
      setBusy(false);
      return true;
    } catch (e: any) {
      setError(e?.message || "خطأ");
      setBusy(false);
      return false;
    }
  }, [busy]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (busy) return false;
    setBusy(true);
    setError(null);
    try {
      const reg = await navigator.serviceWorker.getRegistration("/");
      const sub = reg ? await reg.pushManager.getSubscription() : null;
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setStatus("default");
      setBusy(false);
      return true;
    } catch (e: any) {
      setError(e?.message || "خطأ");
      setBusy(false);
      return false;
    }
  }, [busy]);

  return { status, busy, error, subscribe, unsubscribe };
}
