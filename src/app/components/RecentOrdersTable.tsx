'use client';
import React, { useState, useEffect, useCallback } from 'react';
import StatusBadge from '../../components/ui/StatusBadge';
import { Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { orderService } from '@/lib/services/orderService';
import Link from 'next/link';

export default function RecentOrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 6;

  const statusMap: Record<string, string> = {
    reviewing: 'قيد المراجعة',
    delivering: 'خرج للتوصيل',
    completed: 'مُسلَّم',
    cancelled: 'ملغي',
  };

  const paymentMap: Record<string, string> = {
    paid: 'مدفوع',
    pending: 'آجل',
    overdue: 'متأخر',
  };

  const loadOrders = useCallback(async () => {
    try {
      const data = await orderService.getIncomingOrders();
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const handleAdvance = async (id: string, currentStatus: string) => {
    const flow = ['reviewing', 'delivering', 'completed'];
    const idx = flow.indexOf(currentStatus);
    if (idx < 0 || idx >= flow.length - 1) return;
    const nextStatus = flow[idx + 1] as any;
    const ok = await orderService.updateIncomingOrderStatus(id, nextStatus);
    if (ok) {
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: nextStatus } : o));
      toast.success('تم تحديث حالة الطلب');
    }
  };

  const handleCancel = async (id: string) => {
    const ok = await orderService.updateIncomingOrderStatus(id, 'cancelled');
    if (ok) {
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'cancelled' } : o));
      toast.error('تم إلغاء الطلب');
    }
  };

  const total = orders.length;
  const paged = orders.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-arabic font-semibold text-base text-foreground">آخر الطلبات</h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="w-7 h-7 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden card-hover">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="font-arabic font-semibold text-base text-foreground">آخر الطلبات</h3>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">اليوم — {total} طلب</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadOrders}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            title="تحديث"
          >
            <RefreshCw size={14} />
          </button>
          <Link href="/orders" className="text-xs text-accent font-arabic font-semibold hover:underline">
            عرض الكل
          </Link>
        </div>
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12">
          <p className="font-arabic text-muted-foreground text-sm">لا توجد طلبات حتى الآن</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground font-arabic">رقم الطلب</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground font-arabic">المحل</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground font-arabic hidden md:table-cell">المدينة</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground font-arabic hidden lg:table-cell">الأصناف</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground font-arabic">الإجمالي</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground font-arabic">الحالة</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground font-arabic hidden md:table-cell">الدفع</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground font-arabic">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((order: any, idx: number) => (
                <tr
                  key={`order-row-${order.id}`}
                  className={`border-b border-border/60 hover:bg-muted/40 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/20'}`}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-semibold text-primary tabular-nums">{order.orderNumber}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-arabic text-sm font-medium text-foreground">{order.buyer?.storeName || order.buyer?.name}</p>
                    <p className="font-arabic text-xs text-muted-foreground">{order.placedAt?.slice(11, 16)}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="font-arabic text-xs text-muted-foreground">{order.delivery?.city}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="font-arabic text-xs text-foreground tabular-nums">{order.items?.length ?? 0} صنف</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-arabic text-sm font-semibold text-foreground tabular-nums">
                      {(order.total ?? 0).toLocaleString('ar-IQ')}
                    </span>
                    <span className="text-xs text-muted-foreground mr-1">د.ع</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={statusMap[order.status] ?? order.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <StatusBadge status={paymentMap[order.paymentStatus] ?? order.paymentStatus} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href="/orders"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="عرض التفاصيل"
                      >
                        <Eye size={14} />
                      </Link>
                      {order.status !== 'completed' && order.status !== 'cancelled' && (
                        <button
                          onClick={() => handleAdvance(order.id, order.status)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-green-50 transition-colors"
                          title="تقديم للمرحلة التالية"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                      {order.status !== 'completed' && order.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-danger hover:bg-red-50 transition-colors"
                          title="إلغاء الطلب"
                        >
                          <XCircle size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground font-arabic tabular-nums">
            عرض {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} من {total} طلب
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={`page-btn-${i + 1}`}
                onClick={() => setPage(i + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold tabular-nums transition-colors ${page === i + 1 ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}