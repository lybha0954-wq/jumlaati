'use client';
import React, { useState } from 'react';
import { Copy, CheckCheck, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import type { UserRole } from './AuthContent';

interface DemoCredentialsProps {
  role: UserRole;
}

const credentials: Record<UserRole, { email: string; password: string; label: string }> = {
  retailer: {
    email: 'hassan.albaqali@jumlaati.iq',
    password: 'Retailer@2026',
    label: 'حساب صاحب المحل التجريبي',
  },
  supplier: {
    email: 'ahmed.aljabouri@jumlaati.iq',
    password: 'Supplier@2026',
    label: 'حساب المورد التجريبي',
  },
  admin: {
    email: 'admin@jumlaati.iq',
    password: 'Admin@2026!',
    label: 'حساب المدير التجريبي',
  },
};

export default function DemoCredentials({ role }: DemoCredentialsProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const cred = credentials[role];

  const copyEmail = () => {
    navigator.clipboard.writeText(cred.email);
    setCopiedEmail(true);
    toast.success('تم نسخ البريد الإلكتروني');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const copyPass = () => {
    navigator.clipboard.writeText(cred.password);
    setCopiedPass(true);
    toast.success('تم نسخ كلمة المرور');
    setTimeout(() => setCopiedPass(false), 2000);
  };

  return (
    <div className="mt-6 border border-dashed border-border rounded-xl p-4 bg-secondary/40">
      <div className="flex items-center gap-2 mb-3">
        <KeyRound size={14} className="text-primary" />
        <p className="font-arabic text-xs font-semibold text-foreground">{cred.label}</p>
      </div>

      {/* Email row */}
      <div className="flex items-center justify-between gap-2 bg-card border border-border rounded-lg px-3 py-2 mb-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground font-arabic mb-0.5">البريد الإلكتروني</p>
          <p className="text-xs font-mono text-foreground truncate" dir="ltr">{cred.email}</p>
        </div>
        <button
          type="button"
          onClick={copyEmail}
          className="flex-shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          aria-label="نسخ البريد الإلكتروني"
        >
          {copiedEmail ? <CheckCheck size={14} className="text-accent" /> : <Copy size={14} />}
        </button>
      </div>

      {/* Password row */}
      <div className="flex items-center justify-between gap-2 bg-card border border-border rounded-lg px-3 py-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground font-arabic mb-0.5">كلمة المرور</p>
          <p className="text-xs font-mono text-foreground" dir="ltr">{cred.password}</p>
        </div>
        <button
          type="button"
          onClick={copyPass}
          className="flex-shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          aria-label="نسخ كلمة المرور"
        >
          {copiedPass ? <CheckCheck size={14} className="text-accent" /> : <Copy size={14} />}
        </button>
      </div>

      <p className="font-arabic text-xs text-muted-foreground mt-2 leading-relaxed">
        هذه بيانات تجريبية للعرض فقط — لا تستخدمها في بيئة الإنتاج
      </p>
    </div>
  );
}