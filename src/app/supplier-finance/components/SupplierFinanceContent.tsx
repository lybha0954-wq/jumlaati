'use client';
import React, { useState } from 'react';
import { TrendingUp, Bell, HelpCircle, Shield, User, ChevronRight, ChevronDown, ChevronUp, DollarSign, ArrowUpRight, ArrowDownRight, AlertTriangle, MessageSquare, Phone, Mail, Lock, LogOut, Package, ShoppingCart, CheckCircle, Send, Star, Edit3, Camera,  } from 'lucide-react';
import { CURRENCY } from '@/lib/commissionStore';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import UnifiedNotificationCenter from '@/components/UnifiedNotificationCenter';

function fmt(n: number) {
  return n.toLocaleString('ar-IQ') + ' ' + CURRENCY;
}

type Tab = 'finance' | 'notifications' | 'support' | 'account';

interface LedgerEntry {
  id: string;
  date: string;
  store: string;
  type: 'order' | 'payment' | 'debt';
  amount: number;
  direction: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'overdue';
  orderRef?: string;
}

const ledger: LedgerEntry[] = [
  { id: 'l1', date: '٢٠٢٦/٠٨/٠٥', store: 'سوبرماركت الأمل', type: 'order', amount: 1_870_000, direction: 'credit', status: 'completed', orderRef: 'ORD-0841' },
  { id: 'l2', date: '٢٠٢٦/٠٨/٠٤', store: 'متجر النور', type: 'payment', amount: 2_450_000, direction: 'credit', status: 'completed', orderRef: 'ORD-0840' },
  { id: 'l3', date: '٢٠٢٦/٠٨/٠٤', store: 'متجر الرافدين', type: 'debt', amount: 980_000, direction: 'debit', status: 'overdue', orderRef: 'ORD-0835' },
  { id: 'l4', date: '٢٠٢٦/٠٨/٠٣', store: 'متجر السلام', type: 'order', amount: 1_230_000, direction: 'credit', status: 'pending', orderRef: 'ORD-0838' },
  { id: 'l5', date: '٢٠٢٦/٠٨/٠٣', store: 'بقالة الرشيد', type: 'debt', amount: 650_000, direction: 'debit', status: 'overdue', orderRef: 'ORD-0830' },
  { id: 'l6', date: '٢٠٢٦/٠٨/٠٢', store: 'متجر الحضارة', type: 'payment', amount: 3_100_000, direction: 'credit', status: 'completed', orderRef: 'ORD-0825' },
  { id: 'l7', date: '٢٠٢٦/٠٨/٠١', store: 'سوبرماركت الفرات', type: 'order', amount: 4_200_000, direction: 'credit', status: 'completed', orderRef: 'ORD-0820' },
  { id: 'l8', date: '٢٠٢٦/٠٧/٣١', store: 'متجر الزيتون', type: 'debt', amount: 320_000, direction: 'debit', status: 'pending', orderRef: 'ORD-0815' },
];

const notifications = [
  { id: 'n1', type: 'order', text: 'طلب جديد #ORD-0841 من سوبرماركت الأمل — ١,٨٧٠,٠٠٠ د.ع', time: 'منذ ٣ دقائق', unread: true },
  { id: 'n2', type: 'stock', text: 'مخزون سكر أبيض منخفض — ١٨ كيس فقط (الحد الأدنى ٥٠)', time: 'منذ ٢٠ دقيقة', unread: true },
  { id: 'n3', type: 'payment', text: 'تم استلام دفعة من متجر النور — ٢,٤٥٠,٠٠٠ د.ع', time: 'منذ ساعة', unread: true },
  { id: 'n4', type: 'debt', text: 'دين متأخر من متجر الرافدين — ٩٨٠,٠٠٠ د.ع تجاوز ١٠ أيام', time: 'منذ ٣ ساعات', unread: false },
  { id: 'n5', type: 'order', text: 'طلب #ORD-0839 تم تسليمه بنجاح', time: 'منذ ٥ ساعات', unread: false },
  { id: 'n6', type: 'stock', text: 'معكرونة 500غ — ٨ كراتين فقط متبقية', time: 'منذ ٦ ساعات', unread: false },
];

const faqs = [
  { q: 'كيف أضيف منتجاً جديداً للكتالوج؟', a: 'انتقل إلى تبويب "الكتالوج" ثم اضغط على زر "منتج جديد" في أعلى الشاشة وأدخل تفاصيل المنتج.' },
  { q: 'كيف أقبل طلباً وارداً؟', a: 'في تبويب "الطلبات"، افتح الطلب المطلوب واضغط "قبول الطلب" لتحديث حالته إلى قيد التجهيز.' },
  { q: 'كيف أتتبع الديون المستحقة؟', a: 'في هذا التبويب (المالية)، يمكنك مراجعة سجل الحسابات وتصفية الديون المتأخرة باستخدام فلتر "ديون".' },
  { q: 'كيف أطبع فاتورة طلب؟', a: 'افتح الطلب في تبويب "الطلبات" ثم اضغط "طباعة الفاتورة" من الإجراءات السريعة أسفل تفاصيل الطلب.' },
  { q: 'كيف أضيف عرضاً ترويجياً؟', a: 'في لوحة المورد الرئيسية، انتقل إلى قسم "العروض والتخفيضات" واضغط "عرض جديد" لإنشاء عرض.' },
];

const typeConfig: Record<string, { icon: React.ElementType; bg: string; color: string; label: string }> = {
  order:   { icon: ShoppingCart,  bg: 'bg-blue-100',    color: 'text-blue-600',   label: 'طلب'    },
  payment: { icon: DollarSign,    bg: 'bg-emerald-100', color: 'text-emerald-600', label: 'دفعة'  },
  debt:    { icon: AlertTriangle, bg: 'bg-red-100',     color: 'text-red-500',    label: 'دين'    },
  stock:   { icon: Package,       bg: 'bg-amber-100',   color: 'text-amber-600',  label: 'مخزون' },
};

const statusStyle: Record<string, { bg: string; text: string; label: string }> = {
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'مكتمل' },
  pending:   { bg: 'bg-amber-100',   text: 'text-amber-700',   label: 'معلق'  },
  overdue:   { bg: 'bg-red-100',     text: 'text-red-700',     label: 'متأخر' },
};

const notifTypeConfig: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
  order:   { icon: ShoppingCart,  bg: 'bg-blue-100',    color: 'text-blue-600'   },
  payment: { icon: DollarSign,    bg: 'bg-emerald-100', color: 'text-emerald-600' },
  debt:    { icon: AlertTriangle, bg: 'bg-red-100',     color: 'text-red-500'    },
  stock:   { icon: Package,       bg: 'bg-amber-100',   color: 'text-amber-600'  },
};

export default function SupplierFinanceContent() {
  const [activeTab, setActiveTab] = useState<Tab>('finance');
  const [notifs, setNotifs] = useState(notifications);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [ledgerFilter, setLedgerFilter] = useState<'all' | 'credit' | 'debit' | 'overdue'>('all');
  const [supportMessage, setSupportMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    newOrders: true,
    lowStock: true,
    payments: true,
    debts: true,
  });
  const { signOut, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try { await signOut(); } catch {}
    router.push('/sign-up-login');
  };

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
  const unreadCount = notifs.filter((n) => n.unread).length;

  const filteredLedger = ledger.filter((e) => {
    if (ledgerFilter === 'all') return true;
    if (ledgerFilter === 'overdue') return e.status === 'overdue';
    return e.direction === ledgerFilter;
  });

  const totalCredit = ledger.filter((e) => e.direction === 'credit').reduce((s, e) => s + e.amount, 0);
  const totalDebt = ledger.filter((e) => e.direction === 'debit').reduce((s, e) => s + e.amount, 0);
  const overdueDebt = ledger.filter((e) => e.status === 'overdue').reduce((s, e) => s + e.amount, 0);
  const balance = totalCredit - totalDebt;

  const sendSupportMessage = () => {
    if (!supportMessage.trim()) return;
    setMessageSent(true);
    setSupportMessage('');
    setTimeout(() => setMessageSent(false), 3000);
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'finance',       label: 'الحسابات',  icon: TrendingUp },
    { id: 'notifications', label: 'الإشعارات', icon: Bell, badge: unreadCount },
    { id: 'support',       label: 'الدعم',      icon: HelpCircle },
    { id: 'account',       label: 'الحساب',     icon: User },
  ];

  return (
    <div className="space-y-4 pb-6" dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-foreground font-arabic">المالية والحساب</h1>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">مركز الحسابات والإعدادات</p>
        </div>
      </div>

      {/* ── Sub-Tabs ── */}
      <div className="flex gap-1 bg-muted/40 rounded-2xl p-1">
        {tabs.map((t) => {
          const TIcon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-[10px] font-arabic font-semibold transition-all relative active:scale-95 ${
                active ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <TIcon size={16} />
                {t.badge && t.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-danger text-white text-[8px] font-bold rounded-full flex items-center justify-center">{t.badge}</span>
                )}
              </div>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          ── Finance Tab ──
      ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'finance' && (
        <div className="space-y-4">

          {/* Balance Hero Card */}
          <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-2xl p-4 text-white relative overflow-hidden">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
            <div className="relative z-10">
              <p className="text-xs opacity-70 font-arabic mb-1">الرصيد الصافي</p>
              <p className="text-3xl font-bold tabular-nums font-arabic">{(balance / 1_000_000).toFixed(2)}م</p>
              <p className="text-xs opacity-50 font-arabic">{CURRENCY}</p>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="bg-white/10 rounded-xl p-2 text-center">
                  <div className="flex items-center justify-center gap-0.5 mb-0.5">
                    <ArrowUpRight size={10} className="text-emerald-400" />
                    <span className="text-[9px] opacity-70 font-arabic">مبيعات</span>
                  </div>
                  <p className="text-xs font-bold tabular-nums font-arabic">{(totalCredit / 1_000_000).toFixed(1)}م</p>
                </div>
                <div className="bg-white/10 rounded-xl p-2 text-center">
                  <div className="flex items-center justify-center gap-0.5 mb-0.5">
                    <ArrowDownRight size={10} className="text-red-400" />
                    <span className="text-[9px] opacity-70 font-arabic">ديون</span>
                  </div>
                  <p className="text-xs font-bold tabular-nums font-arabic">{(totalDebt / 1_000_000).toFixed(1)}م</p>
                </div>
                <div className="bg-red-500/20 rounded-xl p-2 text-center border border-red-500/30">
                  <div className="flex items-center justify-center gap-0.5 mb-0.5">
                    <AlertTriangle size={10} className="text-red-400" />
                    <span className="text-[9px] opacity-70 font-arabic">متأخر</span>
                  </div>
                  <p className="text-xs font-bold tabular-nums font-arabic text-red-300">{(overdueDebt / 1_000_000).toFixed(1)}م</p>
                </div>
              </div>
            </div>
          </div>

          {/* Overdue Alert */}
          {overdueDebt > 0 && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-3">
              <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={16} className="text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-red-700 font-arabic">ديون متأخرة تحتاج متابعة</p>
                <p className="text-[10px] text-red-500 font-arabic mt-0.5">إجمالي {fmt(overdueDebt)} — {ledger.filter((e) => e.status === 'overdue').length} محلات</p>
              </div>
              <button
                onClick={() => setLedgerFilter('overdue')}
                className="text-xs text-red-600 font-arabic font-semibold bg-red-100 px-2 py-1 rounded-lg active:scale-95 transition-all"
              >
                عرض
              </button>
            </div>
          )}

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {([
              { key: 'all',     label: 'الكل' },
              { key: 'credit',  label: 'مدفوعات' },
              { key: 'debit',   label: 'ديون' },
              { key: 'overdue', label: 'متأخرة' },
            ] as const).map((f) => (
              <button
                key={f.key}
                onClick={() => setLedgerFilter(f.key)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-arabic font-semibold transition-all active:scale-95 ${
                  ledgerFilter === f.key
                    ? f.key === 'overdue' ? 'bg-red-500 text-white' : 'bg-primary text-white' :'bg-muted text-muted-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Ledger */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground font-arabic">سجل الحسابات</h2>
              <span className="text-xs text-muted-foreground font-arabic">{filteredLedger.length} سجل</span>
            </div>
            <div className="divide-y divide-border">
              {filteredLedger.map((entry) => {
                const tc = typeConfig[entry.type] || typeConfig.order;
                const EntryIcon = tc.icon;
                const ss = statusStyle[entry.status];
                return (
                  <div key={entry.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${tc.bg}`}>
                      <EntryIcon size={16} className={tc.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground font-arabic truncate">{entry.store}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[10px] text-muted-foreground font-arabic">{entry.date}</span>
                        {entry.orderRef && <span className="text-[10px] text-muted-foreground font-arabic">· {entry.orderRef}</span>}
                        <span className={`text-[10px] font-arabic font-semibold px-1.5 py-0.5 rounded-full ${ss.bg} ${ss.text}`}>{ss.label}</span>
                      </div>
                    </div>
                    <p className={`text-sm font-bold tabular-nums font-arabic flex-shrink-0 ${entry.direction === 'credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {entry.direction === 'credit' ? '+' : '-'}{fmt(entry.amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          ── Notifications Tab ──
      ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'notifications' && (
        <UnifiedNotificationCenter role="supplier" embedded />
      )}

      {/* ══════════════════════════════════════════════════════════════
          ── Support Tab ──
      ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'support' && (
        <div className="space-y-4">
          {/* Contact Options */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: MessageSquare, label: 'المحادثة الفورية', sub: 'متاح ٢٤/٧', color: 'text-primary', bg: 'bg-primary/10' },
              { icon: Phone, label: 'الاتصال الهاتفي', sub: '٠٧٧٠٠٠٠٠٠٠', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: Mail, label: 'البريد الإلكتروني', sub: 'support@jumlaati.iq', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: HelpCircle, label: 'مركز المساعدة', sub: 'أدلة وشروحات', color: 'text-violet-600', bg: 'bg-violet-50' },
            ].map((c, i) => {
              const CIcon = c.icon;
              return (
                <button key={i} className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-2xl active:scale-95 transition-all hover:border-primary/30">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg}`}>
                    <CIcon size={20} className={c.color} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-foreground font-arabic">{c.label}</p>
                    <p className="text-[10px] text-muted-foreground font-arabic mt-0.5">{c.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Send Message */}
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <h2 className="text-sm font-bold text-foreground font-arabic">أرسل رسالة للدعم</h2>
            <textarea
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="اكتب مشكلتك أو استفسارك هنا..."
              rows={3}
              className="w-full border border-border rounded-xl px-3 py-2 text-sm font-arabic bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            {messageSent && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                <CheckCircle size={14} className="text-emerald-600" />
                <p className="text-xs text-emerald-700 font-arabic">تم إرسال رسالتك بنجاح! سنرد خلال ٢٤ ساعة.</p>
              </div>
            )}
            <button
              onClick={sendSupportMessage}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-arabic font-semibold py-2.5 rounded-xl active:scale-95 transition-all"
            >
              <Send size={14} />
              إرسال الرسالة
            </button>
          </div>

          {/* FAQs */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-sm font-bold text-foreground font-arabic">الأسئلة الشائعة</h2>
            </div>
            <div className="divide-y divide-border">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-right"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <p className="text-xs font-semibold text-foreground font-arabic flex-1 text-right">{faq.q}</p>
                    {openFaq === i
                      ? <ChevronUp size={14} className="text-muted-foreground flex-shrink-0 mr-2" />
                      : <ChevronDown size={14} className="text-muted-foreground flex-shrink-0 mr-2" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-3 bg-muted/20">
                      <p className="text-xs text-muted-foreground font-arabic leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3"
              onClick={() => setShowPrivacy(!showPrivacy)}
            >
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground font-arabic">سياسة الخصوصية والشروط</span>
              </div>
              {showPrivacy ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
            </button>
            {showPrivacy && (
              <div className="px-4 pb-4 bg-muted/20 space-y-2">
                <p className="text-xs text-muted-foreground font-arabic leading-relaxed">
                  منصة جملاتي تلتزم بحماية بيانات الموردين والتجار وفق أعلى معايير الأمان. لا تُشارك بياناتك مع أطراف ثالثة دون موافقتك الصريحة.
                </p>
                <p className="text-xs text-muted-foreground font-arabic leading-relaxed">
                  باستخدامك للمنصة، توافق على شروط الاستخدام وسياسة الخصوصية المعمول بها. للاستفسار: privacy@jumlaati.iq
                </p>
                <p className="text-xs text-muted-foreground font-arabic leading-relaxed">
                  آخر تحديث: أغسطس ٢٠٢٦ — الإصدار ٢.١
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          ── Account Tab ──
      ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'account' && (
        <div className="space-y-4">
          {/* Profile Card */}
          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] rounded-2xl p-4 text-white relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/5 rounded-full" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="relative">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <User size={28} className="text-white" />
                </div>
                <button className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Camera size={10} className="text-white" />
                </button>
              </div>
              <div className="flex-1">
                <p className="text-base font-bold font-arabic">{user?.user_metadata?.full_name || 'المورد'}</p>
                <p className="text-xs opacity-70 font-arabic">{user?.email || 'supplier@jumlaati.iq'}</p>
                <p className="text-xs text-blue-300 font-arabic font-semibold mt-0.5">{user?.user_metadata?.business_name || 'شركة التوزيع'}</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={10} className={s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-white/30'} />
                  ))}
                </div>
                <span className="text-[10px] opacity-70 font-arabic">تقييم المورد</span>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-sm font-bold text-foreground font-arabic">إعدادات الحساب</h2>
            </div>
            <div className="divide-y divide-border">
              {[
                { icon: Edit3, label: 'تعديل الملف الشخصي', sub: 'الاسم، الشركة، رقم الهاتف' },
                { icon: Lock, label: 'تغيير كلمة المرور', sub: 'آخر تغيير منذ ٣٠ يوماً' },
                { icon: Bell, label: 'إعدادات الإشعارات', sub: 'تخصيص التنبيهات' },
                { icon: Shield, label: 'الأمان والخصوصية', sub: 'المصادقة الثنائية' },
              ].map((item, i) => {
                const ItemIcon = item.icon;
                return (
                  <button key={i} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors active:scale-[0.99]">
                    <div className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                      <ItemIcon size={15} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-xs font-semibold text-foreground font-arabic">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground font-arabic">{item.sub}</p>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* App Info */}
          <div className="bg-muted/30 rounded-2xl p-4 text-center space-y-1">
            <p className="text-xs font-bold text-foreground font-arabic">منصة جملاتي للموردين</p>
            <p className="text-[10px] text-muted-foreground font-arabic">الإصدار ٢.١.٠ — بغداد، العراق</p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 font-arabic font-semibold text-sm active:scale-95 transition-all"
          >
            <LogOut size={16} />
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}
