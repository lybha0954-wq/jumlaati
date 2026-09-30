"use client";

import { useState, useEffect } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { User, KeyRound, Bell, Ticket, RotateCcw, Wifi, WifiOff, Trash2, Database } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

type Tab = "account" | "password" | "notifications" | "offline" | "coupons" | "refunds";

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: "account",       label: "الحساب",     icon: User },
  { key: "password",      label: "كلمة السر",  icon: KeyRound },
  { key: "notifications", label: "الإشعارات",  icon: Bell },
  { key: "offline",       label: "بدون إنترنت", icon: WifiOff },
  { key: "coupons",       label: "كوبونات",    icon: Ticket },
  { key: "refunds",       label: "مرتجعات",    icon: RotateCcw },
];

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<Tab>("account");

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 text-2xl font-black text-gray-900">الإعدادات</h1>
          <p className="text-sm text-gray-500">إدارة النظام والإعدادات الشخصية</p>
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex flex-shrink-0 items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                  active ? "bg-[#2e8b73] text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"
                }`}>
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === "account" && (
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="mb-4 text-sm font-black text-gray-900">معلومات الحساب</h2>
            <ProfileForm />
          </div>
        )}
        {tab === "password"      && <PasswordSection />}
        {tab === "notifications" && <NotificationsSection />}
        {tab === "offline"       && <OfflineSection />}
        {tab === "coupons"       && <ComingSoon icon={<Ticket size={28} className="text-amber-500" />} title="الكوبونات" desc="نظام أكواد الخصم قيد التطوير" />}
        {tab === "refunds"       && <ComingSoon icon={<RotateCcw size={28} className="text-blue-500" />} title="المرتجعات" desc="نظام طلبات الاسترجاع قيد التطوير" />}
      </div>
    </div>
  );
}

function PasswordSection() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(true);

  const submit = async () => {
    setMsg("");
    if (!current || !next || !confirm) { setMsg("أكمل جميع الحقول"); setOk(false); return; }
    if (next.length < 6) { setMsg("كلمة السر 6 أحرف على الأقل"); setOk(false); return; }
    if (next !== confirm) { setMsg("كلمتا السر غير متطابقتين"); setOk(false); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: next, current_password: current }),
      });
      if (res.ok) {
        setMsg("✅ تم تغيير كلمة السر"); setOk(true);
        setCurrent(""); setNext(""); setConfirm("");
      } else {
        const d = await res.json().catch(() => ({}));
        setMsg(d.error || "فشل التغيير"); setOk(false);
      }
    } catch {
      setMsg("خطأ في الاتصال"); setOk(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="mb-4 text-sm font-black text-gray-900">تغيير كلمة السر</h2>
      <div className="space-y-3">
        <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)}
          placeholder="كلمة السر الحالية"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2e8b73]" />
        <input type="password" value={next} onChange={(e) => setNext(e.target.value)}
          placeholder="كلمة السر الجديدة"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2e8b73]" />
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
          placeholder="تأكيد كلمة السر"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2e8b73]" />
        {msg && <p className={`text-xs ${ok ? "text-[#2e8b73]" : "text-red-600"}`}>{msg}</p>}
        <button onClick={submit} disabled={busy}
          className="w-full rounded-xl bg-[#2e8b73] px-4 py-3 text-sm font-bold text-white hover:bg-[#1e6b57] disabled:opacity-50">
          {busy ? "جاري الحفظ..." : "حفظ كلمة السر"}
        </button>
      </div>
    </div>
  );
}

function NotificationsSection() {
  const push = usePushNotifications();
  const install = useInstallPrompt();
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <h2 className="mb-4 text-sm font-black text-gray-900">إشعارات المتصفح</h2>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f0] text-[#2e8b73]">
              <Bell size={16} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                {push.status === "granted" ? "مفعّلة" :
                 push.status === "denied" ? "محظورة" :
                 push.status === "unsupported" ? "غير مدعومة" : "معطّلة"}
              </p>
              <p className="text-xs text-gray-500">استلم تنبيهات فورية</p>
            </div>
          </div>
          {push.status !== "unsupported" && push.status !== "denied" && (
            <button onClick={push.status === "granted" ? push.unsubscribe : push.subscribe}
              disabled={push.busy}
              className={`rounded-xl px-4 py-2 text-xs font-bold ${
                push.status === "granted"
                  ? "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  : "bg-[#2e8b73] text-white hover:bg-[#1e6b57]"
              } disabled:opacity-50`}>
              {push.busy ? "..." : push.status === "granted" ? "إيقاف" : "تفعيل"}
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <p className="text-sm font-bold text-gray-900">تثبيت التطبيق</p>
        <p className="mt-1 text-xs text-gray-500">
          {install.isInstalled ? "✅ مثبّت" : install.canShow ? "متاح للتثبيت" : "افتح من المتصفح"}
        </p>
      </div>
    </div>
  );
}


function OfflineSection() {
  const [cacheInfo, setCacheInfo] = useState<{ files: number; keys: string[]; supported: boolean }>({
    files: 0, keys: [], supported: false,
  });
  const [clearing, setClearing] = useState(false);
  const { showToast } = useToast();

  const checkCache = async () => {
    if (typeof window === "undefined" || !("caches" in window)) {
      return;
    }
    try {
      const keys = await caches.keys();
      let totalFiles = 0;
      for (const k of keys) {
        const cache = await caches.open(k);
        const requests = await cache.keys();
        totalFiles += requests.length;
      }
      setCacheInfo({ files: totalFiles, keys, supported: true });
    } catch {
      setCacheInfo({ files: 0, keys: [], supported: false });
    }
  };

  useEffect(() => {
    checkCache();
  }, []);

  const clearCache = async () => {
    if (!confirm("سيتم مسح كل الملفات المُخزَّنة. هل أنت متأكد؟")) return;
    setClearing(true);
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      showToast("✅ تم مسح الكاش", "success");
      checkCache();
    } catch {
      showToast("فشل المسح", "error");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#2e8b73]/30 bg-[#e8f4f0] p-5">
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#2e8b73]">
          <WifiOff size={18} />
        </div>
        <p className="text-sm font-black text-[#1e6b57]">وضع عدم الاتصال مُفعَّل</p>
        <p className="mt-1 text-xs text-[#1e6b57]/80">
          يمكن للمستخدمين فتح التطبيق بدون إنترنت بعد أول زيارة
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Database size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">الملفات المُخزَّنة</p>
            <p className="text-xs text-gray-500">
              {cacheInfo.supported
                ? `${cacheInfo.files} ملف في ${cacheInfo.keys.length} مخزن`
                : "غير مدعوم في هذا المتصفح"}
            </p>
          </div>
        </div>

        {cacheInfo.keys.length > 0 && (
          <div className="mb-3 space-y-1">
            {cacheInfo.keys.map((k) => (
              <div key={k} className="rounded-lg bg-gray-50 px-3 py-1.5 text-[11px] font-mono text-gray-600">
                📦 {k}
              </div>
            ))}
          </div>
        )}

        <button onClick={clearCache} disabled={clearing || !cacheInfo.supported}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-600 hover:bg-red-100 disabled:opacity-50">
          <Trash2 size={14} />
          {clearing ? "جاري المسح..." : "مسح الكاش"}
        </button>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="flex items-center gap-2">
          <Wifi size={14} className="text-[#2e8b73]" />
          <h3 className="text-sm font-black text-gray-900">حالة الاتصال الحالية</h3>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {typeof navigator !== "undefined" && navigator.onLine
            ? "🟢 متصل بالإنترنت"
            : "🔴 غير متصل — يعمل من الكاش"}
        </p>
      </div>
    </div>
  );
}

function ComingSoon({ icon, title, desc }: any) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
        {icon}
      </div>
      <p className="text-base font-bold text-gray-800">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{desc}</p>
    </div>
  );
}

