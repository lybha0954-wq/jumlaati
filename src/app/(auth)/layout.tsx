import Link from "next/link";
import { Package, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white" dir="rtl">
      {/* يسار — لوحة الهوية (سطح المكتب فقط) */}
      <aside className="relative hidden overflow-hidden lg:flex lg:w-2/5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2e8b73] to-[#1e6b57]" />
        <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 left-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black">جُمْلَتِي</span>
          </Link>

          <div>
            <h2 className="mb-5 text-4xl font-black leading-tight">
              منصة الجملة
              <br />
              والتوصيل
              <br />
              <span className="text-[#a7e0cf]">في العراق</span>
            </h2>
            <p className="mb-8 max-w-sm text-sm leading-relaxed text-white/80">
              اربط سوبرماركتك بتجار الجملة الأوائل، وتابع كل دينار — من هاتفك.
            </p>

            <ul className="space-y-3 text-sm">
              <Bullet text="دفتر ديون رقمي" />
              <Bullet text="واتساب مدمج" />
              <Bullet text="تتبع مباشر للطلبات" />
            </ul>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-white/70 transition-colors hover:text-white"
          >
            <ArrowRight size={14} />
            العودة للرئيسية
          </Link>
        </div>
      </aside>

      {/* يمين — النموذج */}
      <main className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2">
      <CheckCircle2 size={16} className="text-[#a7e0cf]" />
      {text}
    </li>
  );
}
