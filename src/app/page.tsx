import Link from 'next/link';
import { ShoppingBag, Truck, Store, ArrowLeft } from 'lucide-react';

export default function HomePage() {
  const roles = [
    {
      icon: Store,
      label: 'سوبرماركت ومحل',
      desc: 'اطلب بضاعتك اليومية من محلات الجملة مباشرة وبأفضل الأسعار بدون تعب',
      color: 'from-emerald-500 to-teal-500',
      href: '/sign-up-login',
    },
    {
      icon: Truck,
      label: 'محل جملة',
      desc: 'اعرض بضاعتك وأدر مبيعاتك وطلبات أصحاب المحلات بكفاءة وسرعة',
      color: 'from-blue-500 to-indigo-500',
      href: '/sign-up-login',
    },
    {
      icon: ShoppingBag,
      label: 'مندوب توصيل',
      desc: 'استلم طلبيات البضاعة ووصلها للمحلات وزوّد أرباحك اليومية',
      color: 'from-amber-500 to-orange-500',
      href: '/sign-up-login',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/80 shadow-lg mb-4">
            <span className="text-white text-4xl font-black font-arabic">ج</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground font-arabic mb-3">
            جُمْلَتِي
          </h1>
          <p className="text-lg text-muted-foreground font-arabic max-w-2xl mx-auto">
            تطبيق جملتي الأول في العراق — خدمة تجارية متكاملة تجمع أصحاب السوبرماركت ومحلات الجملة ومندوبي التوصيل في منصة واحدة سهلة وسريعة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {roles.map((r) => {
            const RIcon = r.icon;
            return (
              <Link
                key={r.label}
                href={r.href}
                className="group bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center mb-4 shadow-md`}>
                    <RIcon size={26} className="text-white" />
                  </div>
                  <h3 className="font-arabic font-bold text-lg text-foreground mb-1">{r.label}</h3>
                  <p className="font-arabic text-sm text-muted-foreground leading-relaxed mb-4">{r.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-primary font-arabic font-semibold text-sm">
                  ابدأ الآن
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/sign-up-login"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-arabic font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg"
          >
            تسجيل الدخول / إنشاء حساب
            <ArrowLeft size={18} />
          </Link>
        </div>

        <div className="mt-16 text-center">
          <p className="font-arabic text-sm text-muted-foreground">
            © 2026 جُمْلَتِي — المنظومة التجارية المتكاملة في العراق
          </p>
        </div>
      </div>
    </main>
  );
}

