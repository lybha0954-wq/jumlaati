"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import SignupForm from "../components/SignupForm";
import RoleSelector, { type UserRole } from "../components/RoleSelector";

export default function RegisterPage() {
  const [role, setRole] = useState<UserRole>("retailer");

  return (
    <div>
      <div className="mb-8 lg:hidden">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2e8b73]">
            <Package className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black text-gray-900">جُمْلَتِي</span>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-black text-gray-900 sm:text-3xl">
          انضم إلى جُمْلَتِي
        </h1>
        <p className="text-sm text-gray-500">أنشئ حسابك في أقل من دقيقة</p>
      </div>

      <RoleSelector role={role} onRoleChange={setRole} showAdmin={false} />

      <SignupForm role={role} onSwitchToLogin={() => (window.location.href = "/login")} />

      <div className="mt-8 text-center lg:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 transition-colors hover:text-gray-600"
        >
          <ArrowRight size={12} />
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
