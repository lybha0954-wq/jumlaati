"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { User, KeyRound, Bell, Smartphone } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

type Tab = "account" | "password" | "notifications";

export default function DeliverySettingsPage() {
  const [tab, setTab] = useState<Tab>("account");

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 text-2xl font-black text-gray-900">الإعدادات</h1>
          <p className="text-sm text-gray-500">إدارة حسابك وتفضيلاتك</p>
        </div>

        <div className="mb-5 flex gap-2">
          <TabBtn active={tab === "account"} onClick={() => setTab("account")} icon={<User size={14} />} label="الحساب" />
          <TabBtn active={tab === "password"} onClick={() => setTab("password")} icon={<KeyRound size={14} />} label="كلمة السر" />
          <TabBtn active={tab === "notifications"} onClick={() => setTab("notifications")} icon={<Bell size={14} />} label="الإشعارات" />
        </div>

        {tab === "account" && (
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="mb-4 text-sm font-black text-gray-900">معلومات الحساب</h2>
            <ProfileForm />
          </div>
        )}

        {tab === "password" && <PasswordSection />}
        {tab === "notifications" && <NotificationsSection />}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
        active ? "bg-[#2e8b73] text-white shadow-sm"
        : "border border-gray-200 bg-white text-gray-600 hover:border-[#2e8b73]/40"
      }`}>
      {icon} {label}
    </button>
  );
}

function PasswordSection() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"ok" | "err">("ok");

  const submit = async () => {
    setMsg("");
    if (!current || !next || !confirm) {
      setMsg("أكمل جميع الحقول"); setMsgType("err"); return;
    }
    if (next.length < 6) {
      setMsg("كلمة السر يجب أن تكون 6 أحرف على الأقل"); setMsgType("err"); return;
    }
    if (next !== confirm) {
      setMsg("كلمتا السر غير متطابقتين"); setMsgType("err"); return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: next, current_password: current }),
      });
      if (res.ok) {
        setMsg("✅ تم تغيير كلمة السر"); setMsgType("ok");
        setCurrent(""); setNext(""); setConfirm("");
      } else {
        const d = await res.json().catch(() => ({}));
        setMsg(d.error || "فشل التغيير"); setMsgType("err");
      }
    } catch {
      setMsg("خطأ في الاتصال"); setMsgType("err");
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
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2e8b73]" />
        <input type="password" value={next} onChange={(e) => setNext(e.target.value)}
          placeholder="كلمة السر الجديدة"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2e8b73]" />
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
          placeholder="تأكيد كلمة السر"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2e8b73]" />
        {msg && (
          <p className={`text-xs ${msgType === "ok" ? "text-[#2e8b73]" : "text-red-600"}`}>{msg}</p>
        )}
        <button onClick={submit} disabled={busy}
          className="w-full rounded-xl bg-[#2e8b73] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1e6b57] disabled:opacity-50">
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
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
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
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Smartphone size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">تثبيت التطبيق</p>
            <p className="text-xs text-gray-500">
              {install.isInstalled ? "✅ مثبّت على جهازك" :
               install.canShow ? "متاح للتثبيت" : "افتح من المتصفح"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
