"use client";

import { MessageCircle, Mail, HelpCircle, ExternalLink } from "lucide-react";

const SUPPORT_PHONE = "9647700000000"; // 📌 ضع رقمك هنا
const SUPPORT_EMAIL = "support@jumlati.iq";

export function SupportSection() {
  const waLink = `https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent("مرحباً، أحتاج مساعدة في تطبيق جُمْلَتِي")}`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <h2 className="mb-4 text-sm font-black text-gray-900">الدعم الفني</h2>
        <p className="mb-4 text-xs text-gray-500">نحن هنا لمساعدتك</p>

        <a href={waLink} target="_blank" rel="noreferrer"
          className="mb-2 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 transition-colors hover:bg-emerald-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <MessageCircle size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">واتساب</p>
              <p className="text-xs text-gray-500">رد سريع خلال دقائق</p>
            </div>
          </div>
          <ExternalLink size={14} className="text-emerald-600" />
        </a>

        <a href={`mailto:${SUPPORT_EMAIL}`}
          className="flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 transition-colors hover:bg-blue-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">البريد الإلكتروني</p>
              <p className="text-xs text-gray-500">{SUPPORT_EMAIL}</p>
            </div>
          </div>
          <ExternalLink size={14} className="text-blue-600" />
        </a>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="flex items-center gap-2">
          <HelpCircle size={16} className="text-[#2e8b73]" />
          <h3 className="text-sm font-black text-gray-900">أسئلة شائعة</h3>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          الأسئلة الشائعة قيد الإعداد — ستظهر هنا قريباً
        </p>
      </div>
    </div>
  );
}
