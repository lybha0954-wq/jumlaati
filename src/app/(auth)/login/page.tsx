"use client";

import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
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
          مرحباً بعودتك 👋
        </h1>
        <p className="text-sm text-gray-500">سجّل الدخول للمتابعة إلى حسابك</p>
      </div>

      <LoginForm onSwitchToSignup={() => (window.location.href = "/register")} />

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
