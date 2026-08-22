'use client';
import React, { useState } from 'react';
import { LifeBuoy, MessageSquare, CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  from: string;
  role: 'مورد' | 'محل';
  priority: 'عالية' | 'متوسطة' | 'منخفضة';
  status: 'مفتوحة' | 'قيد المعالجة' | 'مغلقة';
  createdAt: string;
  message: string;
  reply?: string;
}

const initialTickets: Ticket[] = [
  { id: 'tkt-1', subject: 'مشكلة في رفع المنتجات', from: 'أحمد الجبوري', role: 'مورد', priority: 'عالية', status: 'مفتوحة', createdAt: '٢٠٢٦/٠٨/٠٤', message: 'لا أستطيع رفع صور المنتجات، تظهر رسالة خطأ عند المحاولة.' },
  { id: 'tkt-2', subject: 'خطأ في حساب العمولة', from: 'سامر الموسوي', role: 'مورد', priority: 'عالية', status: 'قيد المعالجة', createdAt: '٢٠٢٦/٠٨/٠٣', message: 'العمولة المحتسبة على طلب رقم ORD-2241 تبدو خاطئة.' },
  { id: 'tkt-3', subject: 'طلب تعديل بيانات المحل', from: 'حسن البقالي', role: 'محل', priority: 'متوسطة', status: 'مفتوحة', createdAt: '٢٠٢٦/٠٨/٠٢', message: 'أريد تغيير عنوان المحل وإضافة رقم هاتف احتياطي.' },
  { id: 'tkt-4', subject: 'استفسار عن طريقة الدفع الآجل', from: 'نور الدين', role: 'محل', priority: 'منخفضة', status: 'مغلقة', createdAt: '٢٠٢٦/٠٧/٣٠', message: 'كيف يمكنني زيادة حد الائتمان الخاص بي؟', reply: 'يمكنك التواصل مع فريق المبيعات لمراجعة حد الائتمان.' },
  { id: 'tkt-5', subject: 'عدم وصول الطلب في الوقت المحدد', from: 'طارق العبيدي', role: 'محل', priority: 'عالية', status: 'قيد المعالجة', createdAt: '٢٠٢٦/٠٧/٢٩', message: 'الطلب ORD-2198 لم يصل بعد مرور 3 أيام من الموعد المحدد.' },
];

const priorityStyles: Record<string, string> = {
  'عالية': 'bg-red-50 text-red-600 border-red-200',
  'متوسطة': 'bg-amber-50 text-amber-600 border-amber-200',
  'منخفضة': 'bg-slate-50 text-slate-500 border-slate-200',
};

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  'مفتوحة': { color: 'text-red-500', icon: AlertCircle },
  'قيد المعالجة': { color: 'text-amber-500', icon: Clock },
  'مغلقة': { color: 'text-emerald-500', icon: CheckCircle2 },
};

export default function SupportTickets() {
  const [tickets, setTickets] = useState(initialTickets);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<'الكل' | 'مفتوحة' | 'قيد المعالجة' | 'مغلقة'>('الكل');

  const filtered = filter === 'الكل' ? tickets : tickets.filter((t) => t.status === filter);

  const handleStatusChange = (id: string, status: Ticket['status']) => {
    setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
  };

  const handleReply = (id: string) => {
    const text = replyTexts[id];
    if (!text?.trim()) return;
    setTickets((prev) => prev.map((t) => t.id === id ? { ...t, reply: text, status: 'مغلقة' } : t));
    setReplyTexts((prev) => { const n = { ...prev }; delete n[id]; return n; });
    setExpandedId(null);
  };

  const openCount = tickets.filter((t) => t.status === 'مفتوحة').length;

  return (
    <div className="bg-card rounded-2xl border border-border flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
            <LifeBuoy size={15} className="text-red-600" />
          </div>
          <div>
            <h2 className="font-arabic font-bold text-sm text-foreground">تذاكر الدعم الفني</h2>
            <p className="text-xs text-muted-foreground font-arabic">
              {openCount > 0 ? <span className="text-red-500 font-semibold">{openCount} مفتوحة</span> : 'لا توجد تذاكر مفتوحة'}
              {' '}من أصل {tickets.length}
            </p>
          </div>
        </div>
        {/* Filter tabs */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {(['الكل', 'مفتوحة', 'قيد المعالجة', 'مغلقة'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-1 rounded-md text-xs font-arabic font-semibold transition-all ${
                filter === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets list */}
      <div className="flex-1 divide-y divide-border overflow-y-auto max-h-80">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <CheckCircle2 size={36} className="text-emerald-400 mx-auto mb-2" />
            <p className="font-arabic text-muted-foreground text-sm">لا توجد تذاكر في هذا التصنيف</p>
          </div>
        ) : (
          filtered.map((ticket) => {
            const StatusIcon = statusConfig[ticket.status].icon;
            const isExpanded = expandedId === ticket.id;
            return (
              <div key={ticket.id} className="px-5 py-3 hover:bg-muted/20 transition-colors">
                <div
                  className="flex items-start justify-between gap-2 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : ticket.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <StatusIcon size={13} className={statusConfig[ticket.status].color} />
                      <span className={`text-xs border rounded-full px-1.5 py-0.5 font-arabic font-semibold ${priorityStyles[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 rounded-full px-1.5 py-0.5 font-arabic font-semibold">
                        {ticket.role}
                      </span>
                      <span className="text-xs text-muted-foreground font-arabic">{ticket.createdAt}</span>
                    </div>
                    <p className="font-arabic font-semibold text-sm text-foreground">{ticket.subject}</p>
                    <p className="font-arabic text-xs text-muted-foreground mt-0.5">{ticket.from}</p>
                  </div>
                  <div className="flex-shrink-0 text-muted-foreground">
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="mt-3 space-y-3">
                    <div className="bg-muted/40 rounded-xl p-3">
                      <p className="text-xs text-muted-foreground font-arabic mb-1">رسالة المستخدم:</p>
                      <p className="font-arabic text-sm text-foreground">{ticket.message}</p>
                    </div>
                    {ticket.reply && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                        <p className="text-xs text-emerald-600 font-arabic font-semibold mb-1">رد الإدارة:</p>
                        <p className="font-arabic text-sm text-foreground">{ticket.reply}</p>
                      </div>
                    )}
                    {ticket.status !== 'مغلقة' && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusChange(ticket.id, 'قيد المعالجة')}
                            disabled={ticket.status === 'قيد المعالجة'}
                            className="text-xs font-arabic font-semibold px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors disabled:opacity-40"
                          >
                            تحويل لقيد المعالجة
                          </button>
                          <button
                            onClick={() => handleStatusChange(ticket.id, 'مغلقة')}
                            className="text-xs font-arabic font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                          >
                            إغلاق التذكرة
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <textarea
                            value={replyTexts[ticket.id] || ''}
                            onChange={(e) => setReplyTexts((prev) => ({ ...prev, [ticket.id]: e.target.value }))}
                            placeholder="اكتب ردك هنا..."
                            rows={2}
                            className="flex-1 border border-border rounded-xl px-3 py-2 text-xs font-arabic text-foreground bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                          <button
                            onClick={() => handleReply(ticket.id)}
                            className="px-3 py-2 rounded-xl bg-primary text-white text-xs font-arabic font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1"
                          >
                            <MessageSquare size={12} />
                            إرسال
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
