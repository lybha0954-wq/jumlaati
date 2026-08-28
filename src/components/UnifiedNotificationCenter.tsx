'use client';
import React, { useState, useMemo } from 'react';
import { Bell, CheckCheck, ShoppingCart, DollarSign, Eye, X, Star, UserPlus, MessageCircle, TrendingDown, FileText, BadgeCheck } from 'lucide-react';

export type NotifRole = 'retailer' | 'supplier' | 'admin';
export type NotifCategory = 'order' | 'financial' | 'stock' | 'promo' | 'complaint' | 'registration' | 'activity';

export interface AppNotification {
  id: string;
  role: NotifRole;
  category: NotifCategory;
  title: string;
  body: string;
  time: string;
  dateGroup: 'today' | 'yesterday' | 'earlier';
  unread: boolean;
  actionLabel?: string;
  actionHref?: string;
  secondaryActionLabel?: string;
}

// ─── Role-based mock data ─────────────────────────────────────────────────────

const retailerNotifications: AppNotification[] = [
  {
    id: 'r1', role: 'retailer', category: 'order',
    title: 'تم قبول طلبك', body: 'طلب #ORD-2847 تم قبوله من شركة الفرات للتوزيع وجاري التجهيز.',
    time: 'منذ ٥ دقائق', dateGroup: 'today', unread: true,
    actionLabel: 'عرض الطلب', actionHref: '/retailer-orders',
  },
  {
    id: 'r2', role: 'retailer', category: 'order',
    title: 'طلبك قيد الشحن', body: 'طلب #ORD-2840 خرج للتوصيل — السائق في الطريق إليك.',
    time: 'منذ ٤٥ دقيقة', dateGroup: 'today', unread: true,
    actionLabel: 'تتبع الشحنة', actionHref: '/retailer-orders',
  },
  {
    id: 'r3', role: 'retailer', category: 'order',
    title: 'تم تسليم طلبك', body: 'طلب #ORD-2835 تم تسليمه بنجاح. يرجى تأكيد الاستلام.',
    time: 'منذ ٢ ساعة', dateGroup: 'today', unread: true,
    actionLabel: 'تأكيد الاستلام', actionHref: '/retailer-orders',
    secondaryActionLabel: 'عرض الفاتورة',
  },
  {
    id: 'r4', role: 'retailer', category: 'promo',
    title: 'عرض حصري اليوم فقط!', body: 'خصم ٢٥٪ على جميع منتجات نستله — ينتهي الليلة منتصف الليل.',
    time: 'منذ ٣ ساعات', dateGroup: 'today', unread: false,
    actionLabel: 'تسوق الآن', actionHref: '/retailer-catalog',
  },
  {
    id: 'r5', role: 'retailer', category: 'promo',
    title: 'عروض نهاية الأسبوع', body: 'تخفيضات تصل إلى ٣٠٪ على المواد الغذائية الأساسية من ٥ موردين.',
    time: 'منذ ٥ ساعات', dateGroup: 'today', unread: false,
    actionLabel: 'استعراض العروض', actionHref: '/retailer-catalog',
  },
  {
    id: 'r6', role: 'retailer', category: 'financial',
    title: 'تذكير بالسداد', body: 'رصيد مستحق ٨٥٠,٠٠٠ د.ع لشركة الأمانة — موعد السداد بعد ٣ أيام.',
    time: 'أمس ١٠:٣٠ ص', dateGroup: 'yesterday', unread: false,
    actionLabel: 'النقاط المالية', actionHref: '/retailer-orders',
  },
  {
    id: 'r7', role: 'retailer', category: 'order',
    title: 'طلب مرفوض', body: 'طلب #ORD-2830 رُفض من المورد — السبب: نفاذ المخزون. يمكنك إعادة الطلب.',
    time: 'أمس ٨:١٥ ص', dateGroup: 'yesterday', unread: false,
    actionLabel: 'إعادة الطلب', actionHref: '/retailer-catalog',
  },
  {
    id: 'r8', role: 'retailer', category: 'order',
    title: 'طلب مكتمل', body: 'طلب #ORD-2820 اكتمل بنجاح — ٤,٢٠٠,٠٠٠ د.ع.',
    time: 'منذ ٣ أيام', dateGroup: 'earlier', unread: false,
    actionLabel: 'عرض الطلب', actionHref: '/retailer-orders',
  },
];

const supplierNotifications: AppNotification[] = [
  {
    id: 's1', role: 'supplier', category: 'order',
    title: 'طلب جديد وارد!', body: 'طلب #ORD-0841 من سوبرماركت الأمل — ١,٨٧٠,٠٠٠ د.ع — ينتظر موافقتك.',
    time: 'منذ ٣ دقائق', dateGroup: 'today', unread: true,
    actionLabel: 'عرض الطلب', actionHref: '/supplier-incoming-orders',
    secondaryActionLabel: 'قبول',
  },
  {
    id: 's2', role: 'supplier', category: 'stock',
    title: 'تحذير نفاذ مخزون', body: 'سكر أبيض ١كغ — ١٨ كيس فقط متبقية (الحد الأدنى ٥٠). يجب التجديد.',
    time: 'منذ ٢٠ دقيقة', dateGroup: 'today', unread: true,
    actionLabel: 'تحديث المخزون', actionHref: '/supplier-catalog',
  },
  {
    id: 's3', role: 'supplier', category: 'financial',
    title: 'دفعة مالية مستلمة', body: 'تم استلام دفعة ٢,٤٥٠,٠٠٠ د.ع من متجر النور — طريقة التحويل البنكي.',
    time: 'منذ ساعة', dateGroup: 'today', unread: true,
    actionLabel: 'النقاط المالية', actionHref: '/supplier-finance',
  },
  {
    id: 's4', role: 'supplier', category: 'financial',
    title: 'دين متأخر', body: 'دين ٩٨٠,٠٠٠ د.ع من متجر الرافدين تجاوز ١٠ أيام — يجب المتابعة.',
    time: 'منذ ٣ ساعات', dateGroup: 'today', unread: false,
    actionLabel: 'النقاط المالية', actionHref: '/supplier-finance',
  },
  {
    id: 's5', role: 'supplier', category: 'order',
    title: 'طلب تم تسليمه', body: 'طلب #ORD-0839 تم تسليمه بنجاح لسوبرماركت النخيل.',
    time: 'منذ ٥ ساعات', dateGroup: 'today', unread: false,
    actionLabel: 'عرض الطلب', actionHref: '/supplier-incoming-orders',
  },
  {
    id: 's6', role: 'supplier', category: 'stock',
    title: 'مخزون حرج', body: 'معكرونة 500غ — ٨ كراتين فقط. نستله كيت كات — ٦ كراتين فقط.',
    time: 'منذ ٦ ساعات', dateGroup: 'today', unread: false,
    actionLabel: 'تحديث المخزون', actionHref: '/supplier-catalog',
  },
  {
    id: 's7', role: 'supplier', category: 'order',
    title: 'طلب جديد وارد', body: 'طلب #ORD-0838 من متجر السلام — ١,٢٣٠,٠٠٠ د.ع.',
    time: 'أمس ٩:٠٠ ص', dateGroup: 'yesterday', unread: false,
    actionLabel: 'عرض الطلب', actionHref: '/supplier-incoming-orders',
    secondaryActionLabel: 'قبول',
  },
  {
    id: 's8', role: 'supplier', category: 'financial',
    title: 'دفعة معلقة', body: 'دفعة ١٩٨,٠٠٠ د.ع من بقالة الرشيد معلقة منذ ٧ أيام.',
    time: 'منذ ٣ أيام', dateGroup: 'earlier', unread: false,
    actionLabel: 'النقاط المالية', actionHref: '/supplier-finance',
  },
];

const adminNotifications: AppNotification[] = [
  {
    id: 'a1', role: 'admin', category: 'registration',
    title: 'تسجيل مورد جديد', body: 'شركة الزيتون للتوزيع — بغداد/الكرادة — تنتظر الموافقة على الانضمام.',
    time: 'منذ ١٠ دقائق', dateGroup: 'today', unread: true,
    actionLabel: 'مراجعة الطلب', actionHref: '/admin-users',
    secondaryActionLabel: 'قبول',
  },
  {
    id: 'a2', role: 'admin', category: 'complaint',
    title: 'شكوى جديدة — أولوية عالية', body: 'سوبرماركت الأمل: "مشكلة في إتمام الطلب — تظهر رسالة خطأ عند الدفع."',
    time: 'منذ ٢٥ دقيقة', dateGroup: 'today', unread: true,
    actionLabel: 'عرض الشكوى', actionHref: '/admin-settings',
  },
  {
    id: 'a3', role: 'admin', category: 'registration',
    title: 'تسجيل محل جديد', body: 'متجر النجوم — بغداد/الكرادة — ينتظر الموافقة على الانضمام.',
    time: 'منذ ساعة', dateGroup: 'today', unread: true,
    actionLabel: 'مراجعة الطلب', actionHref: '/admin-users',
    secondaryActionLabel: 'قبول',
  },
  {
    id: 'a4', role: 'admin', category: 'activity',
    title: 'نشاط مرتفع في المنصة', body: 'تم تسجيل ٤٧ طلباً جديداً خلال الساعة الماضية — أعلى من المعدل بنسبة ٣٢٪.',
    time: 'منذ ٢ ساعة', dateGroup: 'today', unread: false,
    actionLabel: 'عرض التقرير', actionHref: '/admin-hub',
  },
  {
    id: 'a5', role: 'admin', category: 'complaint',
    title: 'شكوى مورد', body: 'شركة الفرات: "طلب تعديل بيانات الشركة ورقم الهاتف."',
    time: 'منذ ٤ ساعات', dateGroup: 'today', unread: false,
    actionLabel: 'عرض الشكوى', actionHref: '/admin-settings',
  },
  {
    id: 'a6', role: 'admin', category: 'financial',
    title: 'معاملة مالية متنازع عليها', body: 'طلب #ORD-0835 — نزاع بين متجر الرافدين وشركة الأمانة — ٩٨٠,٠٠٠ د.ع.',
    time: 'أمس ١١:٠٠ ص', dateGroup: 'yesterday', unread: false,
    actionLabel: 'عرض المعاملة', actionHref: '/admin-transactions',
  },
  {
    id: 'a7', role: 'admin', category: 'registration',
    title: 'تسجيل مورد جديد', body: 'مستودع النخيل — الموصل — تم قبوله وتفعيل حسابه.',
    time: 'أمس ٩:٣٠ ص', dateGroup: 'yesterday', unread: false,
    actionLabel: 'عرض الحساب', actionHref: '/admin-users',
  },
  {
    id: 'a8', role: 'admin', category: 'activity',
    title: 'تقرير أسبوعي جاهز', body: 'تقرير الأسبوع الماضي: ٣٢٤ طلب، ٤٧,٨٠٠,٠٠٠ د.ع إجمالي مبيعات، ١٢ مستخدم جديد.',
    time: 'منذ ٣ أيام', dateGroup: 'earlier', unread: false,
    actionLabel: 'عرض التقرير', actionHref: '/admin-hub',
  },
];

export const notificationsByRole: Record<NotifRole, AppNotification[]> = {
  retailer: retailerNotifications,
  supplier: supplierNotifications,
  admin: adminNotifications,
};

// ─── Category config ──────────────────────────────────────────────────────────

const categoryConfig: Record<NotifCategory, { icon: React.ElementType; bg: string; color: string; label: string }> = {
  order:        { icon: ShoppingCart,  bg: 'bg-blue-100',    color: 'text-blue-600',    label: 'الطلبات'    },
  financial:    { icon: DollarSign,    bg: 'bg-emerald-100', color: 'text-emerald-600', label: 'المالية'    },
  stock:        { icon: TrendingDown,  bg: 'bg-amber-100',   color: 'text-amber-600',   label: 'المخزون'    },
  promo:        { icon: Star,          bg: 'bg-violet-100',  color: 'text-violet-600',  label: 'العروض'     },
  complaint:    { icon: MessageCircle, bg: 'bg-red-100',     color: 'text-red-500',     label: 'الشكاوى'    },
  registration: { icon: UserPlus,      bg: 'bg-teal-100',    color: 'text-teal-600',    label: 'التسجيلات'  },
  activity:     { icon: FileText,      bg: 'bg-slate-100',   color: 'text-slate-600',   label: 'النشاطات'   },
};

// ─── Date group labels ────────────────────────────────────────────────────────

const dateGroupLabel: Record<string, string> = {
  today:     'اليوم',
  yesterday: 'أمس',
  earlier:   'السابق',
};

// ─── Filter tabs per role ─────────────────────────────────────────────────────

type FilterKey = 'all' | 'unread' | 'order' | 'financial';

const filterLabels: Record<FilterKey, string> = {
  all:       'الكل',
  unread:    'غير مقروء',
  order:     'الطلبات',
  financial: 'المالية',
};

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  role: NotifRole;
  embedded?: boolean; // when true, renders without outer padding/card
}

export default function UnifiedNotificationCenter({ role, embedded = false }: Props) {
  const [items, setItems] = useState<AppNotification[]>(notificationsByRole[role] || []);
  const [filter, setFilter] = useState<FilterKey>('all');

  const unreadCount = useMemo(() => items.filter((n) => n.unread).length, [items]);

  const filtered = useMemo(() => {
    let list = items;
    if (filter === 'unread')    list = list.filter((n) => n.unread);
    if (filter === 'order')     list = list.filter((n) => n.category === 'order');
    if (filter === 'financial') list = list.filter((n) => n.category === 'financial');
    return list;
  }, [items, filter]);

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, AppNotification[]> = {};
    filtered.forEach((n) => {
      if (!groups[n.dateGroup]) groups[n.dateGroup] = [];
      groups[n.dateGroup].push(n);
    });
    return groups;
  }, [filtered]);

  const groupOrder = ['today', 'yesterday', 'earlier'];

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  const markRead    = (id: string) => setItems((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n));
  const remove      = (id: string) => setItems((prev) => prev.filter((n) => n.id !== id));

  const wrapClass = embedded ? 'space-y-3' : 'space-y-4';

  return (
    <div className={wrapClass} dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell size={20} className="text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="font-arabic font-bold text-foreground text-base leading-tight">مركز الإشعارات</h2>
            <p className="font-arabic text-xs text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} إشعار غير مقروء` : 'جميع الإشعارات مقروءة'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-arabic font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            <CheckCheck size={13} />
            تمت القراءة على الكل
          </button>
        )}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
        {(Object.keys(filterLabels) as FilterKey[]).map((f) => {
          const count = f === 'all' ? items.length
            : f === 'unread' ? unreadCount
            : items.filter((n) => n.category === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-arabic font-semibold transition-all ${
                filter === f
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {filterLabels[f]}
              {count > 0 && (
                <span className={`mr-1 text-[10px] ${filter === f ? 'opacity-80' : 'opacity-60'}`}>
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Notification list grouped by date ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 bg-card border border-border rounded-xl">
          <Bell size={32} className="text-muted-foreground/30" />
          <p className="font-arabic text-sm text-muted-foreground">لا توجد إشعارات</p>
        </div>
      ) : (
        <div className="space-y-3">
          {groupOrder.map((group) => {
            const groupItems = grouped[group];
            if (!groupItems || groupItems.length === 0) return null;
            return (
              <div key={group}>
                {/* Date group label */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-arabic font-bold text-muted-foreground uppercase tracking-wide">
                    {dateGroupLabel[group]}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Cards */}
                <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
                  {groupItems.map((n) => {
                    const cfg = categoryConfig[n.category];
                    const CatIcon = cfg.icon;
                    return (
                      <div
                        key={n.id}
                        className={`p-3.5 transition-colors ${n.unread ? 'bg-primary/[0.03]' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                            <CatIcon size={16} className={cfg.color} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`font-arabic text-sm font-semibold leading-snug ${n.unread ? 'text-foreground' : 'text-foreground/80'}`}>
                                {n.title}
                              </p>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {n.unread && (
                                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                )}
                                <button
                                  onClick={() => remove(n.id)}
                                  className="p-1 rounded-md text-muted-foreground/50 hover:text-red-400 hover:bg-red-50 transition-colors"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </div>
                            <p className="font-arabic text-xs text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">
                              {n.body}
                            </p>
                            <p className="font-arabic text-[10px] text-muted-foreground/60 mt-1">{n.time}</p>

                            {/* Action buttons */}
                            {(n.actionLabel || n.secondaryActionLabel) && (
                              <div className="flex items-center gap-2 mt-2.5">
                                {n.actionLabel && (
                                  <a
                                    href={n.actionHref || '#'}
                                    onClick={() => markRead(n.id)}
                                    className="flex items-center gap-1 text-[11px] font-arabic font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-lg transition-colors"
                                  >
                                    <Eye size={11} />
                                    {n.actionLabel}
                                  </a>
                                )}
                                {n.secondaryActionLabel && (
                                  <button
                                    onClick={() => markRead(n.id)}
                                    className="flex items-center gap-1 text-[11px] font-arabic font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors"
                                  >
                                    <BadgeCheck size={11} />
                                    {n.secondaryActionLabel}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
