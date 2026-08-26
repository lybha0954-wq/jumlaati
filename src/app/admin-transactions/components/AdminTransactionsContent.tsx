'use client';
import React, { useState, useMemo } from 'react';
import { Search, Download, Eye, AlertCircle, CheckCircle, Clock, Truck, XCircle, FileText, ShoppingBag, CreditCard, TrendingUp, RefreshCw } from 'lucide-react';
import { CURRENCY } from '@/lib/commissionStore';
import Modal from '@/components/ui/Modal';

function fmt(n: number) {
  return n.toLocaleString('ar-IQ') + ' ' + CURRENCY;
}

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'disputed' | 'cancelled';

interface Order {
  id: string;
  retailer: string;
  supplier: string;
  amount: number;
  items: number;
  status: OrderStatus;
  date: string;
  paymentMethod: string;
  hasDebt: boolean;
  debtAmount?: number;
}

const mockOrders: Order[] = [
  { id: 'ORD-0841', retailer: 'سوبرماركت الأمل', supplier: 'شركة الفرات', amount: 1_870_000, items: 12, status: 'pending', date: '٢٠٢٦/٠٨/٠٥', paymentMethod: 'آجل', hasDebt: true, debtAmount: 1_870_000 },
  { id: 'ORD-0840', retailer: 'متجر النور', supplier: 'مستودع النخيل', amount: 2_450_000, items: 18, status: 'processing', date: '٢٠٢٦/٠٨/٠٥', paymentMethod: 'نقدي', hasDebt: false },
  { id: 'ORD-0839', retailer: 'متجر الرافدين', supplier: 'مجمع الرافدين', amount: 980_000, items: 7, status: 'shipped', date: '٢٠٢٦/٠٨/٠٤', paymentMethod: 'بطاقة', hasDebt: false },
  { id: 'ORD-0838', retailer: 'متجر السلام', supplier: 'شركة بابل', amount: 1_230_000, items: 9, status: 'completed', date: '٢٠٢٦/٠٨/٠٤', paymentMethod: 'نقدي', hasDebt: false },
  { id: 'ORD-0837', retailer: 'بقالة الزهراء', supplier: 'شركة الفرات', amount: 560_000, items: 5, status: 'disputed', date: '٢٠٢٦/٠٨/٠٣', paymentMethod: 'آجل', hasDebt: true, debtAmount: 560_000 },
  { id: 'ORD-0836', retailer: 'مول الفردوس', supplier: 'مستودع النخيل', amount: 3_100_000, items: 24, status: 'completed', date: '٢٠٢٦/٠٨/٠٣', paymentMethod: 'بطاقة', hasDebt: false },
  { id: 'ORD-0835', retailer: 'دكان أبو علي', supplier: 'مجمع الرافدين', amount: 420_000, items: 4, status: 'cancelled', date: '٢٠٢٦/٠٨/٠٢', paymentMethod: 'نقدي', hasDebt: false },
  { id: 'ORD-0834', retailer: 'سوبرماركت الوفاء', supplier: 'شركة الفرات', amount: 1_650_000, items: 14, status: 'completed', date: '٢٠٢٦/٠٨/٠٢', paymentMethod: 'آجل', hasDebt: true, debtAmount: 825_000 },
];

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  pending:    { label: 'قيد الانتظار', color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   icon: Clock },
  processing: { label: 'قيد التجهيز',  color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',    icon: RefreshCw },
  shipped:    { label: 'تم الشحن',     color: 'text-violet-700',  bg: 'bg-violet-50',  border: 'border-violet-200',  icon: Truck },
  completed:  { label: 'مكتمل',        color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle },
  disputed:   { label: 'متنازع عليه',  color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200',     icon: AlertCircle },
  cancelled:  { label: 'ملغي',         color: 'text-slate-600',   bg: 'bg-slate-50',   border: 'border-slate-200',   icon: XCircle },
};

export default function AdminTransactionsContent() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'debts'>('orders');

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch = !search || o.id.includes(search) || o.retailer.includes(search) || o.supplier.includes(search);
      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const debts = useMemo(() => orders.filter((o) => o.hasDebt && o.debtAmount), [orders]);
  const totalDebt = useMemo(() => debts.reduce((sum, o) => sum + (o.debtAmount || 0), 0), [debts]);
  const totalRevenue = useMemo(() => orders.filter((o) => o.status === 'completed').reduce((sum, o) => sum + o.amount, 0), [orders]);

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelectedOrder(null);
  };

  const summaryStats = [
    { label: 'إجمالي الإيرادات', value: fmt(totalRevenue || 8_200_000), icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
    { label: 'الديون المستحقة', value: fmt(totalDebt || 3_255_000), icon: CreditCard, color: 'from-red-500 to-rose-500' },
    { label: 'طلبات نشطة', value: orders.filter((o) => ['pending', 'processing', 'shipped'].includes(o.status)).length.toString(), icon: ShoppingBag, color: 'from-blue-500 to-indigo-500' },
    { label: 'متنازع عليها', value: orders.filter((o) => o.status === 'disputed').length.toString(), icon: AlertCircle, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="space-y-4 pb-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-foreground font-arabic">المعاملات والرقابة</h1>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">مراقبة الطلبات والمعاملات المالية</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-xl text-xs font-arabic font-semibold hover:bg-primary/90 transition-colors">
          <Download size={13} /> تصدير
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {summaryStats.map((s) => {
          const SIcon = s.icon;
          return (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-3.5 text-white`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-arabic text-white/80">{s.label}</p>
                <SIcon size={15} className="text-white/80" />
              </div>
              <p className="text-base font-bold font-arabic tabular-nums leading-tight">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1">
        {[
          { id: 'orders', label: 'الطلبات والفواتير' },
          { id: 'debts', label: 'الديون المالية' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'orders' | 'debts')}
            className={`flex-1 py-2 rounded-lg text-xs font-arabic font-semibold transition-all ${
              activeTab === tab.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'orders' ? (
        <>
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث برقم الطلب، المحل، أو المورد..."
              className="w-full bg-card border border-border rounded-xl pr-9 pl-4 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Status Filters */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {(['all', 'pending', 'processing', 'shipped', 'completed', 'disputed', 'cancelled'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-arabic font-semibold border transition-all ${
                  statusFilter === s
                    ? 'bg-primary text-white border-primary' :'bg-card text-muted-foreground border-border hover:border-primary/40'
                }`}
              >
                {s === 'all' ? 'الكل' : statusConfig[s].label}
              </button>
            ))}
          </div>

          {/* Orders List */}
          <div className="space-y-2">
            {filtered.map((order) => {
              const sc = statusConfig[order.status];
              const StatusIcon = sc.icon;
              return (
                <div key={order.id} className="bg-card rounded-2xl border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-arabic font-bold text-sm text-foreground tabular-nums">{order.id}</span>
                        <span className={`text-xs font-arabic font-semibold px-2 py-0.5 rounded-full border ${sc.color} ${sc.bg} ${sc.border} flex items-center gap-1`}>
                          <StatusIcon size={10} />
                          {sc.label}
                        </span>
                        {order.hasDebt && (
                          <span className="text-xs bg-red-50 text-red-600 border border-red-200 font-arabic font-semibold px-1.5 py-0.5 rounded-full">دين</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-arabic">{order.retailer} ← {order.supplier}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs font-arabic text-muted-foreground">{order.date}</span>
                        <span className="text-xs font-arabic text-muted-foreground">{order.items} منتج</span>
                        <span className="text-xs font-arabic bg-muted px-1.5 py-0.5 rounded">{order.paymentMethod}</span>
                      </div>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <p className="font-arabic font-bold text-sm text-foreground tabular-nums">{fmt(order.amount)}</p>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="mt-1.5 flex items-center gap-1 text-xs text-primary font-arabic hover:underline"
                      >
                        <Eye size={12} /> تفاصيل
                      </button>
                    </div>
                  </div>

                  {/* Disputed Quick Actions */}
                  {order.status === 'disputed' && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500 text-white text-xs font-arabic font-semibold hover:bg-emerald-600 transition-colors"
                      >
                        <CheckCircle size={13} /> حل النزاع
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-arabic font-semibold hover:bg-red-100 transition-colors"
                      >
                        <XCircle size={13} /> إلغاء الطلب
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Debts Tab */
        <div className="space-y-3">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard size={16} className="text-red-600" />
              <p className="font-arabic font-bold text-sm text-red-700">إجمالي الديون المستحقة</p>
            </div>
            <p className="text-2xl font-bold font-arabic text-red-700 tabular-nums">{fmt(totalDebt)}</p>
            <p className="text-xs text-red-500 font-arabic mt-1">{debts.length} معاملة معلقة</p>
          </div>

          {debts.map((order) => (
            <div key={order.id} className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-arabic font-bold text-sm text-foreground">{order.retailer}</p>
                  <p className="text-xs text-muted-foreground font-arabic mt-0.5">مورد: {order.supplier}</p>
                  <p className="text-xs text-muted-foreground font-arabic mt-0.5">طلب: {order.id} — {order.date}</p>
                </div>
                <div className="text-left flex-shrink-0">
                  <p className="font-arabic font-bold text-sm text-red-600 tabular-nums">{fmt(order.debtAmount || 0)}</p>
                  <span className={`text-xs font-arabic font-semibold px-2 py-0.5 rounded-full border ${statusConfig[order.status].color} ${statusConfig[order.status].bg} ${statusConfig[order.status].border}`}>
                    {statusConfig[order.status].label}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <button
                  onClick={() => updateOrderStatus(order.id, 'completed')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500 text-white text-xs font-arabic font-semibold hover:bg-emerald-600 transition-colors"
                >
                  <CheckCircle size={13} /> تسوية الدين
                </button>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-muted text-foreground text-xs font-arabic font-semibold hover:bg-muted/80 transition-colors"
                >
                  <FileText size={13} /> فاتورة
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      <Modal open={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="تفاصيل الطلب" size="md">
        {selectedOrder && (
          <div className="space-y-4" dir="rtl">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'رقم الطلب', value: selectedOrder.id },
                { label: 'التاريخ', value: selectedOrder.date },
                { label: 'المحل', value: selectedOrder.retailer },
                { label: 'المورد', value: selectedOrder.supplier },
                { label: 'المبلغ الكلي', value: fmt(selectedOrder.amount) },
                { label: 'طريقة الدفع', value: selectedOrder.paymentMethod },
                { label: 'عدد المنتجات', value: selectedOrder.items.toString() },
                { label: 'الحالة', value: statusConfig[selectedOrder.status].label },
              ].map((row) => (
                <div key={row.label} className="bg-muted/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground font-arabic mb-1">{row.label}</p>
                  <p className="font-arabic font-semibold text-foreground text-sm">{row.value}</p>
                </div>
              ))}
            </div>
            {selectedOrder.status === 'disputed' && (
              <div className="flex gap-2">
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 text-white font-arabic font-semibold text-sm hover:bg-emerald-600 transition-colors"
                >
                  <CheckCircle size={16} /> حل النزاع
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 text-white font-arabic font-semibold text-sm hover:bg-red-600 transition-colors"
                >
                  <XCircle size={16} /> إلغاء
                </button>
              </div>
            )}
            {selectedOrder.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500 text-white font-arabic font-semibold text-sm hover:bg-blue-600 transition-colors"
                >
                  <RefreshCw size={16} /> بدء التجهيز
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
