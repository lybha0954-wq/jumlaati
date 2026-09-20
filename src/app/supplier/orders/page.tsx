'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { orderService, IncomingOrder } from '@/lib/services/orderService';
import { generateOrderInvoicePDF } from '@/lib/utils/pdfInvoiceGenerator';
import {
  Truck,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileDown,
  FileText,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function SupplierOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<IncomingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      const all = await orderService.getAll();
      setOrders(all);
    } catch (e) {
      console.error('Failed to load supplier orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    const ok = await orderService.updateStatus(orderId, status);
    if (ok) {
      toast.success('تم تحديث حالة الطلب');
      loadOrders();
    } else {
      toast.error('فشل تحديث حالة الطلب');
    }
  };

  const handleDownloadInvoice = async (ord: IncomingOrder) => {
    try {
      setDownloadingOrderId(ord.id);
      toast.info(`جاري تجهيز وتوليد ملف PDF لفاتورة الطلب ${ord.orderNumber}...`);
      await generateOrderInvoicePDF(ord, user?.displayName || user?.email || 'مورد جملتي');
      toast.success(`تم تحميل فاتورة الطلب ${ord.orderNumber} بنجاح بصيغة PDF`);
    } catch (err) {
      console.error('Failed to generate invoice PDF:', err);
      toast.error('حدث خطأ أثناء إنشاء ملف PDF');
    } finally {
      setDownloadingOrderId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  return (
    <AppLayout activeRoute="/supplier-orders">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-foreground font-arabic">الطلبات الواردة من المحلات</h1>
          <p className="text-xs text-muted-foreground font-arabic mt-1">
            متابعة الطلبات الجديدة، تجهيز الشحنات، وتحديث الحالات فورياً
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'جميع الطلبات' },
            { id: 'pending', label: 'جديدة بانتظار الموافقة' },
            { id: 'delivering', label: 'قيد الشحن والتوصيل' },
            { id: 'completed', label: 'المكتملة' },
            { id: 'cancelled', label: 'الملغاة' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-arabic transition-colors ${
                statusFilter === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-card border border-border rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <Truck size={42} className="mx-auto text-muted-foreground/30 mb-3" />
            <h3 className="text-base font-bold text-foreground font-arabic">لا توجد طلبات واردة</h3>
            <p className="text-xs text-muted-foreground font-arabic mt-1">
              الطلبيات الجديدة التي يجريها أصحاب المحلات ستظهر هنا لحظياً
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((ord) => {
              const isExpanded = expandedOrders[ord.id];
              return (
                <div
                  key={ord.id}
                  className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-foreground">{ord.orderNumber}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary font-arabic">
                          {ord.buyer.storeName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground font-arabic mt-1">
                        <span>العميل: {ord.buyer.name}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1" dir="ltr">
                          <Phone size={11} />
                          {ord.buyer.phone || '—'}
                        </span>
                        <span>•</span>
                        <span>{ord.delivery.city}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground font-arabic">إجمالي الطلب</p>
                        <p className="text-base font-black text-foreground font-arabic">
                          {ord.total.toLocaleString()} د.ع
                        </p>
                      </div>

                      {/* Status Action Buttons */}
                      {ord.status === 'pending' || ord.status === 'reviewing' ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(ord.id, 'delivering')}
                            className="bg-primary text-white text-xs px-3.5 py-2 rounded-xl font-bold font-arabic hover:bg-primary/90 transition-colors shadow-sm"
                          >
                            شحن وتوصيل
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(ord.id, 'cancelled')}
                            className="bg-rose-500/10 text-rose-600 text-xs px-3 py-2 rounded-xl font-bold font-arabic hover:bg-rose-500/20 transition-colors"
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : ord.status === 'delivering' ? (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(ord.id, 'completed')}
                          className="bg-emerald-600 text-white text-xs px-3.5 py-2 rounded-xl font-bold font-arabic hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                          تأكيد التسليم
                        </button>
                      ) : (
                        <span
                          className={`text-xs px-3 py-1.5 rounded-full font-bold font-arabic ${
                            ord.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-rose-500/10 text-rose-600'
                          }`}
                        >
                          {ord.status === 'completed' ? 'تم التسليم' : 'ملغي'}
                        </span>
                      )}

                      {/* Download Invoice PDF Button */}
                      <button
                        type="button"
                        id={`btn-download-invoice-${ord.id}`}
                        disabled={downloadingOrderId === ord.id}
                        onClick={() => handleDownloadInvoice(ord)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold font-arabic bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border transition-all disabled:opacity-50 shadow-sm"
                        title="تحميل الفاتورة ملخصة بصيغة PDF"
                      >
                        {downloadingOrderId === ord.id ? (
                          <>
                            <Loader2 size={14} className="animate-spin text-primary" />
                            <span>جاري التوليد...</span>
                          </>
                        ) : (
                          <>
                            <FileDown size={14} className="text-primary" />
                            <span>تحميل الفاتورة</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleExpand(ord.id)}
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Items & Address */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-foreground font-arabic">أصناف الشحنة:</h4>
                        <button
                          type="button"
                          id={`btn-download-invoice-expanded-${ord.id}`}
                          disabled={downloadingOrderId === ord.id}
                          onClick={() => handleDownloadInvoice(ord)}
                          className="flex items-center gap-1.5 text-xs font-bold font-arabic text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                        >
                          {downloadingOrderId === ord.id ? (
                            <>
                              <Loader2 size={13} className="animate-spin" />
                              <span>جاري إعداد الملف...</span>
                            </>
                          ) : (
                            <>
                              <FileText size={13} />
                              <span>تصدير نسخة PDF كاملة</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="bg-background rounded-xl border border-border divide-y divide-border overflow-hidden">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="p-3 flex items-center justify-between text-xs font-arabic">
                            <div>
                              <span className="font-bold text-foreground">{it.name}</span>
                              <span className="text-muted-foreground mr-2">
                                ({it.qty} {it.unit} × {it.unitPrice.toLocaleString()} د.ع)
                              </span>
                            </div>
                            <span className="font-semibold text-foreground">
                              {(it.qty * it.unitPrice).toLocaleString()} د.ع
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-arabic bg-muted/40 p-3 rounded-xl">
                        <MapPin size={14} className="text-primary flex-shrink-0" />
                        <span>العنوان المسجل: {ord.delivery.address}، {ord.delivery.city} {ord.delivery.notes && `(${ord.delivery.notes})`}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
