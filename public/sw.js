// ══════════════════════════════════════════════
// جُمْلَتِي — Service Worker v2
// يدعم: Push + Offline + Cache
// ══════════════════════════════════════════════

const CACHE_NAME = "jumlati-v2";
const OFFLINE_URL = "/offline.html";

// ملفات نُخزّنها مسبقاً
const PRECACHE = [
  OFFLINE_URL,
  "/favicon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/manifest.webmanifest",
];

// ═══ INSTALL ═══
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE).catch((err) => {
        console.warn("[SW] precache partial:", err);
      });
    })
  );
});

// ═══ ACTIVATE ═══
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// ═══ FETCH — استراتيجية ذكية ═══
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // تجاهل: غير GET / نطاق مختلف
  if (req.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  // طلبات API + Auth: network-only
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) {
    return;
  }

  // التنقل (navigations): network-first مع offline fallback
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // خزّن نسخة طازجة
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => {
          return caches.match(req).then((cached) => {
            return cached || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // Next.js build assets (_next/static): cache-first
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        });
      })
    );
    return;
  }

  // ملفات ثابتة (صور، svg، icons): cache-first خفيف
  if (
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|gif|ico|woff2?|ttf)$/i)
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        }).catch(() => caches.match(OFFLINE_URL));
      })
    );
    return;
  }

  // الباقي: شبكة فقط
});

// ═══ PUSH ═══
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "جُمْلَتِي", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "جُمْلَتِي";
  const options = {
    body: data.body || "",
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    dir: "rtl",
    lang: "ar",
    tag: data.tag || "jumlati",
    data: { url: data.url || "/" },
    vibrate: [200, 100, 200],
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// ═══ ضغط على الإشعار ═══
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      for (const client of allClients) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })()
  );
});

// ═══ SKIP_WAITING (لتحديث فوري) ═══
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
