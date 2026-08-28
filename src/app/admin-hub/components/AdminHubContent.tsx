'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, ShoppingBag, Users, Percent, Gift, Activity, CheckCircle, AlertTriangle, X, LogOut, ExternalLink, BarChart2 } from 'lucide-react';
import { CURRENCY } from '@/lib/commissionStore';
import { financialService } from '@/lib/services/financialService';
import { storeService } from '@/lib/services/storeService';
import { supplierService } from '@/lib/services/supplierService';
import { orderService } from '@/lib/services/orderService';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';

function fmt(n: number) {
  return n.toLocaleString('ar-IQ') + ' ' + CURRENCY;
}

interface Promo {
  id: string;
  title: string;
  discount: number;
  product: string;
  supplier: string;
  expiry: string;
  active: boolean;
  usageCount: number;
  description?: string;
}

const activePromos: Promo[] = [
  { id: 'pr1', title: 'عرض رمضان الكبير', discount: 20, product: 'زيت نباتي 5 لتر', supplier: 'شركة الفرات', expiry: '٢٠٢٦/٠٨/٣٠', active: true, usageCount: 142, description: 'خصم ٢٠٪ على جميع عبوات الزيت النباتي ٥ لتر من شركة الفرات. صالح للطلبات التي تتجاوز ١٠ كراتين.' },
  { id: 'pr2', title: 'خصم الجملة الأسبوعي', discount: 15, product: 'سكر أبيض 50 كغ', supplier: 'مستودع النخيل', expiry: '٢٠٢٦/٠٩/١٥', active: true, usageCount: 87, description: 'خصم ١٥٪ على أكياس السكر الأبيض ٥٠ كغ عند الطلب بكميات تزيد عن ٥ أكياس.' },
  { id: 'pr3', title: 'تصفية نهاية الموسم', discount: 25, product: 'أرز بسمتي 25 كغ', supplier: 'مجمع الرافدين', expiry: '٢٠٢٦/٠٨/٢٠', active: true, usageCount: 63, description: 'تصفية موسمية بخصم ٢٥٪ على الأرز البسمتي. الكميات محدودة — أسرع قبل النفاد!' },
  { id: 'pr4', title: 'عرض المشروبات', discount: 10, product: 'مياه معدنية 24 حبة', supplier: 'شركة بابل', expiry: '٢٠٢٦/٠٩/٠١', active: true, usageCount: 211, description: 'خصم ١٠٪ على كراتين المياه المعدنية ٢٤ حبة. مناسب لجميع أحجام المحلات.' },
];

const recentActivity = [
  { id: 'a1', type: 'order', text: 'طلب جديد من سوبرماركت الأمل', time: 'منذ ٢ د', color: 'bg-blue-100 text-blue-600' },
  { id: 'a2', type: 'user', text: 'مورد جديد طلب الانضمام: شركة الفرات', time: 'منذ ٨ د', color: 'bg-violet-100 text-violet-600' },
  { id: 'a3', type: 'alert', text: 'مخزون منخفض: أرز بسمتي عند المورد ٣', time: 'منذ ١٥ د', color: 'bg-amber-100 text-amber-600' },
  { id: 'a4', type: 'payment', text: 'تم تسوية فاتورة ORD-0841 بنجاح', time: 'منذ ٣٠ د', color: 'bg-emerald-100 text-emerald-600' },
  { id: 'a5', type: 'user', text: 'محل جديد سجّل: بقالة الزهراء', time: 'منذ ١ س', color: 'bg-violet-100 text-violet-600' },
];

// ── Promo Detail Modal ────────────────────────────────────────────────────────
function PromoDetailModal({ promo, onClose }: { promo: Promo; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} dir="rtl">
      <div className="bg-card w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-l from-rose-500 to-orange-500 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-base font-arabic">-{promo.discount}٪</span>
            </div>
            <div>
              <h2 className="font-arabic font-bold text-white text-base">{promo.title}</h2>
              <p className="text-white/70 text-xs font-arabic">{promo.supplier}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-muted/50 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="font-arabic text-sm text-muted-foreground">المنتج</span>
              <span className="font-arabic text-sm font-semibold text-foreground">{promo.product}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-arabic text-sm text-muted-foreground">نسبة الخصم</span>
              <span className="font-arabic text-sm font-bold text-rose-600">-{promo.discount}٪</span>
            </div>
            <div className="flex justify-between">
              <span className="font-arabic text-sm text-muted-foreground">تاريخ الانتهاء</span>
              <span className="font-arabic text-sm font-semibold text-foreground">{promo.expiry}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-arabic text-sm text-muted-foreground">عدد الاستخدامات</span>
              <span className="font-arabic text-sm font-bold text-primary tabular-nums">{promo.usageCount} مرة</span>
            </div>
          </div>
          {promo.description && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p className="font-arabic text-sm text-blue-800 leading-relaxed">{promo.description}</p>
            </div>
          )}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-400 to-orange-400 rounded-full transition-all duration-700" style={{ width: `${Math.min((promo.usageCount / 250) * 100, 100)}%` }} />
          </div>
          <p className="text-xs text-muted-foreground font-arabic text-center">معدل الاستخدام: {Math.round((promo.usageCount / 250) * 100)}٪</p>
        </div>
      </div>
    </div>
  );
}

// ── KPI Detail Modal ──────────────────────────────────────────────────────────
function KpiDetailModal({ kpi, onClose }: { kpi: { label: string; value: string; trend: string; up: boolean; details?: string[] }; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} dir="rtl">
      <div className="bg-card w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-arabic font-bold text-lg text-foreground">{kpi.label}</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="text-center py-4">
            <p className="font-arabic text-4xl font-bold text-foreground tabular-nums">{kpi.value}</p>
            <p className={`font-arabic text-sm mt-2 font-semibold ${kpi.up ? 'text-emerald-600' : 'text-amber-600'}`}>
              {kpi.up ? '↑' : '⚠'} {kpi.trend}
            </p>
          </div>
          {kpi.details && (
            <div className="space-y-2">
              {kpi.details.map((d, i) => (
                <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2.5">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                  <p className="font-arabic text-sm text-foreground">{d}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sign-Out Confirmation Modal ───────────────────────────────────────────────
function SignOutModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} dir="rtl">
      <div className="bg-card w-full max-w-xs rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
            <LogOut size={28} className="text-red-500" />
          </div>
          <div>
            <h2 className="font-arabic font-bold text-xl text-foreground">تأكيد تسجيل الخروج</h2>
            <p className="font-arabic text-sm text-muted-foreground mt-1">هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة التحكم؟</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 bg-muted text-foreground rounded-xl py-3 font-arabic font-semibold text-sm hover:bg-muted/80 active:scale-95 transition-all">إلغاء</button>
            <button onClick={onConfirm} className="flex-1 bg-red-500 text-white rounded-xl py-3 font-arabic font-semibold text-sm hover:bg-red-600 active:scale-95 transition-all">تسجيل الخروج</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminHubContent() {
  const { showToast } = useToast();
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [storeCount, setStoreCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [realtimePulse, setRealtimePulse] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);
  const [selectedKpi, setSelectedKpi] = useState<{ label: string; value: string; trend: string; up: boolean; details?: string[] } | null>(null);
  const [showSignOut, setShowSignOut] = useState(false);

  const loadKPIs = useCallback(async () => {
    financialService?.getTotals()?.then(({ totalCommission: tc, totalSales: ts, totalOrders: to }) => {
      setTotalCommission(tc); setTotalSales(ts); setTotalOrders(to);
    })?.catch(() => {});
    storeService?.getAll()?.then((s) => setStoreCount(s?.length || 0))?.catch(() => {});
    supplierService?.getAll()?.then((s) => setSupplierCount(s?.filter((x) => x?.isActive)?.length || 0))?.catch(() => {});
    orderService?.getIncomingOrders()?.then((orders) => {
      setPendingOrders(orders?.filter((o) => o?.status === 'reviewing')?.length || 0);
    })?.catch(() => {});
  }, []);

  useEffect(() => { loadKPIs(); }, [loadKPIs]);

  useRealtimeSubscription({ table: 'orders', event: '*', onData: () => { setRealtimePulse(true); setTimeout(() => setRealtimePulse(false), 1500); loadKPIs(); } });
  useRealtimeSubscription({ table: 'user_profiles', event: 'INSERT', onData: () => { loadKPIs(); } });
  useRealtimeSubscription({ table: 'stores', event: '*', onData: () => { loadKPIs(); } });
  useRealtimeSubscription({ table: 'invoices', event: '*', onData: () => { loadKPIs(); } });

  const kpis = [
    {
      id: 'k1', label: 'إجمالي المبيعات', value: fmt(totalSales || 48_750_000), trend: '+١٢٪', up: true, icon: ShoppingBag, bg: 'from-blue-500 to-blue-600', span: 'col-span-2',
      details: ['مبيعات اليوم: ٦.٥م د.ع', 'مبيعات الأسبوع: ٤٢.٣م د.ع', 'مبيعات الشهر: ١٨٧م د.ع', 'نمو مقارنة بالشهر الماضي: +١٢٪'],
    },
    {
      id: 'k2', label: 'عمولات المنصة', value: fmt(totalCommission || 4_875_000), trend: '+٨٪', up: true, icon: Percent, bg: 'from-violet-500 to-violet-600', span: 'col-span-1',
      details: ['نسبة العمولة: ١٠٪', 'عمولات اليوم: ٦٥٠,٠٠٠ د.ع', 'عمولات الشهر: ١٨.٧م د.ع'],
    },
    {
      id: 'k3', label: 'الطلبات النشطة', value: (pendingOrders || 23).toString(), trend: 'تحتاج مراجعة', up: false, icon: Activity, bg: 'from-amber-500 to-orange-500', span: 'col-span-1',
      details: ['قيد المراجعة: ٧ طلبات', 'قيد التجهيز: ١٢ طلب', 'في الشحن: ٤ طلبات'],
    },
    {
      id: 'k4', label: 'مستخدمون جدد', value: '٣٤', trend: '+١٧ هذا الشهر', up: true, icon: Users, bg: 'from-emerald-500 to-teal-500', span: 'col-span-1',
      details: ['موردون جدد: ٨', 'محلات جديدة: ٢٦', 'معدل التحقق: ٩٢٪'],
    },
    {
      id: 'k5', label: 'نمو التطبيق', value: '٢٣٪', trend: 'مقارنة بالشهر الماضي', up: true, icon: TrendingUp, bg: 'from-rose-500 to-pink-500', span: 'col-span-1',
      details: ['زيارات يومية: ١,٢٤٠', 'معدل الاحتفاظ: ٧٨٪', 'متوسط الجلسة: ٨ دقائق'],
    },
  ];

  const handleSignOut = () => {
    setShowSignOut(false);
    showToast('info', 'جاري تسجيل الخروج...', undefined, 2000);
    setTimeout(() => {
      if (typeof window !== 'undefined') window.location.href = '/sign-up-login';
    }, 1500);
  };

  return (
    <div className="space-y-5 pb-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-foreground font-arabic">مركز التحكم</h1>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">الثلاثاء ٥ أغسطس ٢٠٢٦ — رؤية شاملة للمنصة</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-arabic font-semibold px-2.5 py-1 rounded-lg border transition-all duration-300 ${realtimePulse ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${realtimePulse ? 'bg-blue-500' : 'bg-emerald-500'}`} />
            {realtimePulse ? 'تحديث...' : 'مباشر'}
          </span>
          <button
            onClick={() => setShowSignOut(true)}
            className="w-9 h-9 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-100 active:scale-95 transition-all"
            title="تسجيل الخروج"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* KPI Bento Grid — clickable */}
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((kpi) => {
          const KpiIcon = kpi.icon;
          return (
            <button
              key={kpi.id}
              onClick={() => setSelectedKpi({ label: kpi.label, value: kpi.value, trend: kpi.trend, up: kpi.up, details: kpi.details })}
              className={`${kpi.span} bg-gradient-to-br ${kpi.bg} rounded-2xl p-4 text-white relative overflow-hidden text-right hover:opacity-95 active:scale-[0.98] transition-all`}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-arabic font-medium text-white/80">{kpi.label}</p>
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <KpiIcon size={16} className="text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold font-arabic tabular-nums leading-none">{kpi.value}</p>
                <p className={`text-xs mt-1.5 font-arabic font-medium ${kpi.up ? 'text-white/90' : 'text-yellow-200'}`}>
                  {kpi.up ? '↑' : '⚠'} {kpi.trend}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Platform Growth Bar */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-arabic font-bold text-sm text-foreground">نمو المنصة الأسبوعي</h2>
          <span className="text-xs text-muted-foreground font-arabic">آخر ٧ أيام</span>
        </div>
        <div className="space-y-2.5">
          {[
            { label: 'الموردون النشطون', value: supplierCount || 28, max: 50, color: 'bg-violet-500', href: '/admin-users' },
            { label: 'المحلات المسجلة', value: storeCount || 156, max: 200, color: 'bg-blue-500', href: '/stores-customers' },
            { label: 'الطلبات المكتملة', value: totalOrders || 89, max: 150, color: 'bg-emerald-500', href: '/orders' },
          ].map((bar) => (
            <Link key={bar.label} href={bar.href} className="block group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-arabic text-muted-foreground group-hover:text-foreground transition-colors">{bar.label}</span>
                <span className="text-xs font-bold font-arabic text-foreground tabular-nums">{bar.value}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${bar.color} rounded-full transition-all duration-700`} style={{ width: `${Math.min((bar.value / bar.max) * 100, 100)}%` }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Active Promotions — clickable */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-rose-100 rounded-lg flex items-center justify-center">
              <Gift size={14} className="text-rose-600" />
            </div>
            <div>
              <h2 className="font-arabic font-bold text-sm text-foreground">العروض النشطة</h2>
              <p className="text-xs text-muted-foreground font-arabic">{activePromos.length} عرض فعّال الآن</p>
            </div>
          </div>
          <span className="text-xs bg-rose-50 text-rose-600 border border-rose-200 font-arabic font-semibold px-2 py-0.5 rounded-full">{activePromos.length} نشط</span>
        </div>
        <div className="divide-y divide-border">
          {activePromos.map((promo) => (
            <button
              key={promo.id}
              onClick={() => setSelectedPromo(promo)}
              className="w-full px-4 py-3 flex items-center gap-3 text-right hover:bg-muted/20 active:bg-muted/30 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm font-arabic">-{promo.discount}٪</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-arabic font-semibold text-sm text-foreground truncate">{promo.title}</p>
                <p className="text-xs text-muted-foreground font-arabic truncate">{promo.product} — {promo.supplier}</p>
              </div>
              <div className="text-left flex-shrink-0">
                <p className="text-xs font-arabic text-muted-foreground">ينتهي</p>
                <p className="text-xs font-arabic font-semibold text-foreground">{promo.expiry}</p>
              </div>
              <ExternalLink size={13} className="text-muted-foreground flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
            <Activity size={14} className="text-blue-600" />
          </div>
          <h2 className="font-arabic font-bold text-sm text-foreground">آخر النشاطات</h2>
        </div>
        <div className="divide-y divide-border">
          {recentActivity.map((item) => (
            <div key={item.id} className="px-4 py-3 flex items-center gap-3 hover:bg-muted/10 transition-colors">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                {item.type === 'order' && <ShoppingBag size={14} />}
                {item.type === 'user' && <Users size={14} />}
                {item.type === 'alert' && <AlertTriangle size={14} />}
                {item.type === 'payment' && <CheckCircle size={14} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-arabic text-sm text-foreground leading-tight">{item.text}</p>
              </div>
              <span className="text-xs text-muted-foreground font-arabic flex-shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'إدارة المستخدمين', href: '/admin-users', icon: Users, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200' },
          { label: 'المعاملات المالية', href: '/admin-transactions', icon: BarChart2, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
        ].map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link key={link.href} href={link.href} className={`flex items-center gap-3 p-4 rounded-2xl border ${link.bg} hover:opacity-90 active:scale-[0.97] transition-all`}>
              <div className={`w-9 h-9 bg-white rounded-xl flex items-center justify-center flex-shrink-0`}>
                <LinkIcon size={17} className={link.color} />
              </div>
              <span className={`font-arabic font-semibold text-sm ${link.color}`}>{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* ── Modals ── */}
      {selectedPromo && <PromoDetailModal promo={selectedPromo} onClose={() => setSelectedPromo(null)} />}
      {selectedKpi && <KpiDetailModal kpi={selectedKpi} onClose={() => setSelectedKpi(null)} />}
      {showSignOut && <SignOutModal onClose={() => setShowSignOut(false)} onConfirm={handleSignOut} />}
    </div>
  );
}
