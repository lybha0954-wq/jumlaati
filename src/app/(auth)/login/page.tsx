"use client";

import { useState } from "react";
import Link from "next/link";
import LoginForm from "../components/LoginForm";
import RoleSelector, { type UserRole } from "../components/RoleSelector";

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>("retailer");

  return (
    <div className="w-full flex items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold mb-1">جُمْلَتِي</h1>
          <p className="text-sm text-gray-500">منصة الجملة العراقية</p>
        </div>
        <RoleSelector role={role} onRoleChange={setRole} showAdmin={false} />
        <LoginForm onSwitchToSignup={() => (window.location.href = "/register")} />
        <div className="text-center mt-6 text-xs text-gray-400">
          <Link href="/" className="hover:underline">العودة للرئيسية</Link>
        </div>
      </div>
    </div>
  );
}
