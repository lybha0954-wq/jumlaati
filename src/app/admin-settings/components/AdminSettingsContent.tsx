'use client';
import React, { useState } from 'react';
import { Bell, Shield, FileText, Settings, HelpCircle, MessageSquare, ChevronRight, Send, CheckCircle, AlertTriangle, ToggleLeft, ToggleRight, Trash2, Megaphone, BookOpen, LogOut } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import UnifiedNotificationCenter from '../../../components/UnifiedNotificationCenter';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface SupportTicket {
  id: string;
  user: string;
  role: 'supplier' | 'retailer';
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  date: string;
  priority: 'high' | 'medium' | 'low';
}

interface Notification {
  id: string;
  title: string;
  body: string;
  target: 'all' | 'suppliers' | 'retailers';
  sentAt: string;
}

const mockTickets: SupportTicket[] = [
  { id: 'TK-001', user: 'سوبرماركت الأمل', role: 'retailer', subject: 'مشكلة في إتمام الطلب', message: 'لا أستطيع إتمام الطلب بعد إضافة المنتجات للسلة، تظهر رسالة خطأ.', status: 'open', date: '٢٠٢٦/٠٨/٠٥', priority: 'high' },
  { id: 'TK-002', user: 'شركة الفرات', role: 'supplier', subject: 'طلب تعديل بيانات الشركة', message: 'أريد تغيير رقم الهاتف وعنوان الشركة في الملف التجاري.', status: 'in_progress', date: '٢٠٢٦/٠٨/٠٤', priority: 'medium' },
  { id: 'TK-003', user: 'بقالة الزهراء', role: 'retailer', subject: 'استفسار عن الفاتورة', message: 'لم أستلم فاتورة الطلب ORD-0835 رغم اكتمال الطلب.', status: 'open', date: '٢٠٢٦/٠٨/٠٤', priority: 'medium' },
  { id: 'TK-004', user: 'مستودع النخيل', role: 'supplier', subject: 'مشكلة في رفع المنتجات', message: 'لا تظهر المنتجات الجديدة التي أضفتها في الكتالوج.', status: 'resolved', date: '٢٠٢٦/٠٨/٠٣', priority: 'low' },
];

const sentNotifications: Notification[] = [
  { id: 'n1', title: 'تحديث سياسة الاستخدام', body: 'تم تحديث شروط الاستخدام وسياسة الخصوصية. يرجى المراجعة.', target: 'all', sentAt: '٢٠٢٦/٠٨/٠١' },
  { id: 'n2', title: 'عروض نهاية الأسبوع', body: 'خصومات حصرية تصل إلى ٣٠٪ على منتجات مختارة هذا الأسبوع!', target: 'retailers', sentAt: '٢٠٢٦/٠٧/٣١' },
  { id: 'n3', title: 'تذكير بتحديث المخزون', body: 'يرجى تحديث كميات المخزون لضمان دقة الطلبات.', target: 'suppliers', sentAt: '٢٠٢٦/٠٧/٢٩' },
];

const ticketStatusConfig = {
  open:        { label: 'مفتوح',       color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200' },
  in_progress: { label: 'قيد المعالجة', color: 'text-amber-700',  bg: 'bg-amber-50',   border: 'border-amber-200' },
  resolved:    { label: 'محلول',        color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
};

const priorityConfig = {
  high:   { label: 'عالية',   color: 'text-red-600' },
  medium: { label: 'متوسطة', color: 'text-amber-600' },
  low:    { label: 'منخفضة', color: 'text-slate-500' },
};

export default function AdminSettingsContent() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'support' | 'policies' | 'settings'>('notifications');
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try { await signOut(); } catch {}
    router.push('/sign-up-login');
  };
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showNotifForm, setShowNotifForm] = useState(false);
  const [newNotif, setNewNotif] = useState({ title: '', body: '', target: 'all' as 'all' | 'suppliers' | 'retailers' });
  const [notifications, setNotifications] = useState<Notification[]>(sentNotifications);
  const [sentSuccess, setSentSuccess] = useState(false);

  const [appSettings, setAppSettings] = useState({
    maintenanceMode: false,
    newRegistrations: true,
    emailNotifications: true,
    smsNotifications: false,
    autoApprove: false,
    commissionRate: '٥',
  });

  const resolveTicket = (id: string) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'resolved' } : t)));
    setSelectedTicket(null);
  };

  const sendNotification = () => {
    if (!newNotif.title || !newNotif.body) return;
    const n: Notification = {
      id: `n${Date.now()}`,
      title: newNotif.title,
      body: newNotif.body,
      target: newNotif.target,
      sentAt: 'الآن',
    };
    setNotifications((prev) => [n, ...prev]);
    setNewNotif({ title: '', body: '', target: 'all' });
    setShowNotifForm(false);
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  const openTickets = tickets.filter((t) => t.status !== 'resolved').length;

  const tabs = [
    { id: 'notifications', label: 'الإشعارات', icon: Bell, badge: 0 },
    { id: 'support', label: 'الدعم', icon: HelpCircle, badge: openTickets },
    { id: 'policies', label: 'السياسات', icon: FileText, badge: 0 },
    { id: 'settings', label: 'الإعدادات', icon: Settings, badge: 0 },
  ];

  return (
    <div className="space-y-4 pb-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-foreground font-arabic">الإعدادات والدعم</h1>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">إدارة النظام والدعم الفني</p>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="grid grid-cols-4 gap-1 bg-muted rounded-xl p-1">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`relative flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-arabic font-semibold transition-all ${
                activeTab === tab.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TabIcon size={15} />
              <span className="text-[10px]">{tab.label}</span>
              {tab.badge > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Notifications Tab ── */}
      {activeTab === 'notifications' && (
        <div className="space-y-3">
          {sentSuccess && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <CheckCircle size={16} className="text-emerald-600" />
              <p className="font-arabic text-sm text-emerald-700 font-semibold">تم إرسال الإشعار بنجاح!</p>
            </div>
          )}

          {/* ── Admin Notification Center ── */}
          <UnifiedNotificationCenter role="admin" embedded />

          {/* ── Send Broadcast Notification ── */}
          <div className="mt-4 pt-4 border-t border-border">
            <button
              onClick={() => setShowNotifForm(!showNotifForm)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-2xl font-arabic font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              <Megaphone size={16} />
              إرسال إشعار جماعي للمستخدمين
            </button>

            {showNotifForm && (
              <div className="bg-card border border-border rounded-2xl p-4 space-y-3 mt-3">
                <h3 className="font-arabic font-bold text-sm text-foreground">إشعار جديد</h3>
                <input
                  type="text"
                  value={newNotif.title}
                  onChange={(e) => setNewNotif((p) => ({ ...p, title: e.target.value }))}
                  placeholder="عنوان الإشعار..."
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <textarea
                  value={newNotif.body}
                  onChange={(e) => setNewNotif((p) => ({ ...p, body: e.target.value }))}
                  placeholder="نص الإشعار..."
                  rows={3}
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
                <div className="flex gap-2">
                  {(['all', 'suppliers', 'retailers'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setNewNotif((p) => ({ ...p, target: t }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-arabic font-semibold border transition-all ${
                        newNotif.target === t ? 'bg-primary text-white border-primary' : 'bg-card text-muted-foreground border-border'
                      }`}
                    >
                      {t === 'all' ? 'الكل' : t === 'suppliers' ? 'الموردون' : 'المحلات'}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={sendNotification}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-xl font-arabic font-semibold text-sm hover:bg-primary/90 transition-colors"
                  >
                    <Send size={14} /> إرسال
                  </button>
                  <button
                    onClick={() => setShowNotifForm(false)}
                    className="px-4 py-2.5 bg-muted text-muted-foreground rounded-xl font-arabic font-semibold text-sm hover:bg-muted/80 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            {/* Sent notifications history */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden mt-3">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="font-arabic font-bold text-sm text-foreground">الإشعارات المرسلة</h3>
              </div>
              <div className="divide-y divide-border">
                {notifications.map((n) => (
                  <div key={n.id} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-arabic font-semibold text-sm text-foreground">{n.title}</p>
                        <p className="text-xs text-muted-foreground font-arabic mt-0.5 line-clamp-2">{n.body}</p>
                      </div>
                      <div className="flex-shrink-0 text-left">
                        <span className={`text-xs font-arabic px-2 py-0.5 rounded-full ${
                          n.target === 'all' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          n.target === 'suppliers' ? 'bg-violet-50 text-violet-700 border border-violet-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {n.target === 'all' ? 'الكل' : n.target === 'suppliers' ? 'الموردون' : 'المحلات'}
                        </span>
                        <p className="text-xs text-muted-foreground font-arabic mt-1">{n.sentAt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Support Tab ── */}
      {activeTab === 'support' && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'مفتوحة', count: tickets.filter((t) => t.status === 'open').length, color: 'text-red-700', bg: 'bg-red-50 border border-red-200' },
              { label: 'قيد المعالجة', count: tickets.filter((t) => t.status === 'in_progress').length, color: 'text-amber-700', bg: 'bg-amber-50 border border-amber-200' },
              { label: 'محلولة', count: tickets.filter((t) => t.status === 'resolved').length, color: 'text-emerald-700', bg: 'bg-emerald-50 border border-emerald-200' },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-2.5 text-center`}>
                <p className={`text-xl font-bold font-arabic tabular-nums ${s.color}`}>{s.count}</p>
                <p className={`text-xs font-arabic ${s.color}`}>{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {tickets.map((ticket) => {
              const sc = ticketStatusConfig[ticket.status];
              const pc = priorityConfig[ticket.priority];
              return (
                <div key={ticket.id} className="bg-card rounded-2xl border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-arabic font-bold text-xs text-muted-foreground tabular-nums">{ticket.id}</span>
                        <span className={`text-xs font-arabic font-semibold px-2 py-0.5 rounded-full border ${sc.color} ${sc.bg} ${sc.border}`}>
                          {sc.label}
                        </span>
                        <span className={`text-xs font-arabic font-semibold ${pc.color}`}>● {pc.label}</span>
                      </div>
                      <p className="font-arabic font-semibold text-sm text-foreground">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground font-arabic mt-0.5">{ticket.user} — {ticket.date}</p>
                      <p className="text-xs text-muted-foreground font-arabic mt-1.5 line-clamp-2">{ticket.message}</p>
                    </div>
                  </div>
                  {ticket.status !== 'resolved' && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary text-white text-xs font-arabic font-semibold hover:bg-primary/90 transition-colors"
                      >
                        <MessageSquare size={13} /> رد
                      </button>
                      <button
                        onClick={() => resolveTicket(ticket.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-arabic font-semibold hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCircle size={13} /> حل
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Policies Tab ── */}
      {activeTab === 'policies' && (
        <div className="space-y-3">
          {[
            {
              id: 'terms',
              title: 'شروط الاستخدام',
              icon: BookOpen,
              color: 'bg-blue-100 text-blue-600',
              lastUpdated: '٢٠٢٦/٠٦/١٥',
              summary: 'تحدد هذه الشروط قواعد استخدام منصة جملاتي للموردين وأصحاب المحلات، بما يشمل الحقوق والالتزامات والمسؤوليات القانونية.',
            },
            {
              id: 'privacy',
              title: 'سياسة الخصوصية',
              icon: Shield,
              color: 'bg-violet-100 text-violet-600',
              lastUpdated: '٢٠٢٦/٠٦/١٥',
              summary: 'توضح هذه السياسة كيفية جمع بيانات المستخدمين وتخزينها واستخدامها وحمايتها وفق أحدث معايير الخصوصية الرقمية.',
            },
            {
              id: 'refund',
              title: 'سياسة الاسترجاع والإلغاء',
              icon: FileText,
              color: 'bg-amber-100 text-amber-600',
              lastUpdated: '٢٠٢٦/٠٥/٢٠',
              summary: 'تحدد شروط وإجراءات استرجاع الطلبات وإلغائها والحالات المقبولة والకناة من سياسة الاسترجاع.',
            },
          ].map((policy) => {
            const PolicyIcon = policy.icon;
            return (
              <div key={policy.id} className="bg-card rounded-2xl border border-border p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${policy.color}`}>
                    <PolicyIcon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-arabic font-bold text-sm text-foreground">{policy.title}</p>
                      <span className="text-xs text-muted-foreground font-arabic">آخر تحديث: {policy.lastUpdated}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-arabic mt-1.5 leading-relaxed">{policy.summary}</p>
                    <button className="mt-2.5 flex items-center gap-1 text-xs text-primary font-arabic font-semibold hover:underline">
                      تعديل السياسة <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Settings Tab ── */}
      {activeTab === 'settings' && (
        <div className="space-y-3">
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="font-arabic font-bold text-sm text-foreground">إعدادات التطبيق العامة</h3>
            </div>
            <div className="divide-y divide-border">
              {[
                { key: 'maintenanceMode', label: 'وضع الصيانة', desc: 'إيقاف التطبيق مؤقتاً للصيانة', danger: true },
                { key: 'newRegistrations', label: 'التسجيلات الجديدة', desc: 'السماح بتسجيل حسابات جديدة', danger: false },
                { key: 'emailNotifications', label: 'إشعارات البريد الإلكتروني', desc: 'إرسال إشعارات عبر البريد', danger: false },
                { key: 'smsNotifications', label: 'إشعارات الرسائل النصية', desc: 'إرسال إشعارات SMS', danger: false },
                { key: 'autoApprove', label: 'الموافقة التلقائية', desc: 'قبول الحسابات الجديدة تلقائياً', danger: false },
              ].map((setting) => {
                const isOn = appSettings[setting.key as keyof typeof appSettings] as boolean;
                return (
                  <div key={setting.key} className="flex items-center justify-between px-4 py-3.5">
                    <div className="flex-1 min-w-0">
                      <p className={`font-arabic font-semibold text-sm ${setting.danger && isOn ? 'text-danger' : 'text-foreground'}`}>
                        {setting.label}
                      </p>
                      <p className="text-xs text-muted-foreground font-arabic mt-0.5">{setting.desc}</p>
                    </div>
                    <button
                      onClick={() => setAppSettings((prev) => ({ ...prev, [setting.key]: !prev[setting.key as keyof typeof appSettings] }))}
                      className={`flex-shrink-0 transition-colors ${isOn ? (setting.danger ? 'text-danger' : 'text-primary') : 'text-muted-foreground'}`}
                    >
                      {isOn ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-4">
            <h3 className="font-arabic font-bold text-sm text-foreground mb-3">نسبة عمولة المنصة</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={appSettings.commissionRate}
                  onChange={(e) => setAppSettings((p) => ({ ...p, commissionRate: e.target.value }))}
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-arabic text-sm">٪</span>
              </div>
              <button className="px-4 py-2.5 bg-primary text-white rounded-xl font-arabic font-semibold text-sm hover:bg-primary/90 transition-colors">
                حفظ
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-amber-600" />
              <p className="font-arabic font-bold text-sm text-amber-700">منطقة الخطر</p>
            </div>
            <p className="text-xs text-amber-600 font-arabic mb-3">هذه الإجراءات لا يمكن التراجع عنها. تأكد قبل المتابعة.</p>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-danger text-white rounded-xl font-arabic font-semibold text-sm hover:bg-danger/90 transition-colors">
              <Trash2 size={14} /> مسح بيانات الاختبار
            </button>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-arabic font-bold text-sm transition-colors shadow-sm mt-2"
          >
            <LogOut size={16} />
            تسجيل الخروج من الحساب
          </button>
        </div>
      )}

      {/* Reply Modal */}
      <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title="الرد على التذكرة" size="md" footer={null}>
        {selectedTicket && (
          <div className="space-y-4" dir="rtl">
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="font-arabic font-bold text-sm text-foreground">{selectedTicket.subject}</p>
              <p className="text-xs text-muted-foreground font-arabic mt-1">{selectedTicket.user}</p>
              <p className="text-sm text-foreground font-arabic mt-2 leading-relaxed">{selectedTicket.message}</p>
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="اكتب ردك هنا..."
              rows={4}
              className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { resolveTicket(selectedTicket.id); setReplyText(''); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white font-arabic font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                <Send size={14} /> إرسال الرد
              </button>
              <button
                onClick={() => resolveTicket(selectedTicket.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 text-white font-arabic font-semibold text-sm hover:bg-emerald-600 transition-colors"
              >
                <CheckCircle size={14} /> حل التذكرة
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
