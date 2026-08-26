'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  ClipboardList,
  Search,
  MapPin,
  Phone,
  User,
  ChevronDown,
  ChevronUp,
  Package,
  CheckCircle,
  Truck,
  Clock,
  Filter,
  ShoppingCart,
  XCircle,
  CreditCard,
  Banknote,
  AlertCircle,
} from 'lucide-react';
import { CURRENCY } from '@/lib/commissionStore';
import { orderService, type IncomingOrder, type SupplierOrder, type LineItem } from '@/lib/services/orderService';
import { toast } from 'sonner';

// ─── Types ───────────────────────────────────────────────────────────────────

type IncomingStatus = 'reviewing' | 'delivering' | 'completed' | 'cancelled';
type SupplierStatus = 'pending' | 'ready' | 'shipped';
type PaymentStatus = 'paid' | 'pending' | 'overdue';

// ─── Config ───────────────────────────────────────────────────────────────────

const incomingStatusConfig: Record<IncomingStatus, { label: string; icon: React.ElementType; bg: string; text: string; dot: string }> = {
  reviewing: { label: 'قيد المراجعة', icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  delivering: { label: 'جاري التوصيل', icon: Truck, bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  completed: { label: 'مكتمل', icon: CheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  cancelled: { label: 'ملغى', icon: XCircle, bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-400' },
};

const supplierStatusConfig: Record<SupplierStatus, { label: string; icon: React.ElementType; bg: string; text: string; dot: string }> = {
  pending: { label: 'قيد المراجعة', icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  ready: { label: 'جاري التوصيل', icon: Truck, bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  shipped: { label: 'مكتمل', icon: CheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

const paymentConfig: Record<PaymentStatus, { label: string; icon: React.ElementType; bg: string; text: string }> = {
  paid: { label: 'مدفوع', icon: CreditCard, bg: 'bg-emerald-50', text: 'text-emerald-700' },
  pending: { label: 'بانتظار الدفع', icon: Banknote, bg: 'bg-amber-50', text: 'text-amber-700' },
  overdue: { label: 'متأخر', icon: AlertCircle, bg: 'bg-red-50', text: 'text-red-600' },
};

const supplierNextStatus: Record<SupplierStatus, SupplierStatus | null> = {
  pending: 'ready',
  ready: 'shipped',
  shipped: null,
};

const supplierNextLabel: Record<SupplierStatus, string> = {
  pending: 'تحديد كـ "جاري التوصيل"',
  ready: 'تحديد كـ "مكتمل"',
  shipped: '',
};

const supplierStatusFlow: SupplierStatus[] = ['pending', 'ready', 'shipped'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  return n.toLocaleString('ar-IQ') + ' ' + CURRENCY;
}

function orderTotal(items: LineItem[]) {
  return items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
}

// ─── Shared Order Row ─────────────────────────────────────────────────────────

interface OrderRowProps {
  id: string;
  orderNumber: string;
  placedAt: string;
  statusLabel: string;
  statusIcon: React.ElementType;
  statusBg: string;
  statusText: string;
  statusDot: string;
  paymentStatus: PaymentStatus;
  buyerName: string;
  storeName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  items: LineItem[];
  isOpen: boolean;
  onToggle: () => void;
  actionSlot?: React.ReactNode;
}

function OrderRow({
  orderNumber, placedAt, statusLabel, statusIcon, statusBg, statusText, statusDot,
  paymentStatus, buyerName, storeName, phone, city, address, notes, items, isOpen, onToggle, actionSlot,
}: OrderRowProps) {
  const total = orderTotal(items);
  const pay = paymentConfig[paymentStatus];
  const PayIcon = pay.icon;
  const StatusIcon = statusIcon;

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden transition-all shadow-sm ${isOpen ? 'border-accent/40 shadow-md' : 'border-border hover:border-accent/20'}`}>
      <div className="flex items-center gap-4 px-5 py-4 cursor-pointer select-none" onClick={onToggle}>
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusDot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-foreground font-arabic text-sm">{orderNumber}</span>
            <span className={`inline-flex items-center gap-1 text-xs font-arabic px-2 py-0.5 rounded-full ${statusBg} ${statusText}`}>
              <StatusIcon size={11} />
              {statusLabel}
            </span>
            <span className={`inline-flex items-center gap-1 text-xs font-arabic px-2 py-0.5 rounded-full ${pay.bg} ${pay.text}`}>
              <PayIcon size={11} />
              {pay.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">{storeName} · {placedAt}</p>
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-bold text-foreground tabular-nums">{formatPrice(total)}</p>
          <p className="text-xs text-muted-foreground font-arabic">{items.length} منتجات</p>
        </div>
        <div className="text-muted-foreground flex-shrink-0">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-border/60 px-5 pb-5 pt-4 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground font-arabic uppercase tracking-wide">بيانات المشتري</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <User size={14} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground font-arabic">{storeName}</p>
                  <p className="text-xs text-muted-foreground font-arabic">{buyerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-arabic">
                <Phone size={12} className="text-accent flex-shrink-0" />
                <span dir="ltr">{phone}</span>
              </div>
            </div>
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground font-arabic uppercase tracking-wide">عنوان التوصيل</p>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground font-arabic">{city}</p>
                  <p className="text-xs text-muted-foreground font-arabic">{address}</p>
                  {notes && <p className="text-xs text-amber-600 font-arabic mt-1">ملاحظة: {notes}</p>}
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground font-arabic uppercase tracking-wide mb-2">تفاصيل المنتجات</p>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 border-b border-border">
                    <th className="text-right px-4 py-2.5 font-arabic text-xs font-semibold text-muted-foreground">المنتج</th>
                    <th className="text-center px-3 py-2.5 font-arabic text-xs font-semibold text-muted-foreground">الكمية</th>
                    <th className="text-center px-3 py-2.5 font-arabic text-xs font-semibold text-muted-foreground">سعر الوحدة</th>
                    <th className="text-left px-4 py-2.5 font-arabic text-xs font-semibold text-muted-foreground">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item.id} className={`border-b border-border/50 last:border-0 ${idx % 2 !== 0 ? 'bg-muted/10' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0">
                            <Package size={12} className="text-accent" />
                          </div>
                          <span className="font-arabic text-foreground text-sm">{item.productName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="font-arabic text-sm text-foreground tabular-nums">{item.quantity} {item.unit}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="font-arabic text-sm text-muted-foreground tabular-nums">{formatPrice(item.unitPrice)}</span>
                      </td>
                      <td className="px-4 py-3 text-left">
                        <span className="font-arabic text-sm font-semibold text-foreground tabular-nums">{formatPrice(item.quantity * item.unitPrice)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-accent/5 border-t border-accent/20">
                    <td colSpan={3} className="px-4 py-3 text-right font-arabic text-sm font-bold text-foreground">إجمالي الطلب</td>
                    <td className="px-4 py-3 text-left font-arabic text-sm font-bold text-accent tabular-nums">{formatPrice(total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {actionSlot && <div>{actionSlot}</div>}
        </div>
      )}
    </div>
  );
}

// ─── Incoming Orders Tab ──────────────────────────────────────────────────────

function IncomingOrdersTab() {
  const [orders, setOrders] = useState<IncomingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | IncomingStatus>('all');

  const load = useCallback(async () => {
    try {
      const data = await orderService.getIncomingOrders();
      setOrders(data);
      if (data.length > 0) setExpanded(data[0].id);
    } catch { toast.error('فشل تحميل الطلبات'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.includes(search) ||
      o.buyer.storeName.includes(search) ||
      o.buyer.name.includes(search) ||
      o.delivery.city.includes(search);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: orders.length,
    reviewing: orders.filter((o) => o.status === 'reviewing').length,
    delivering: orders.filter((o) => o.status === 'delivering').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['reviewing', 'delivering', 'completed', 'cancelled'] as IncomingStatus[]).map((s) => {
          const cfg = incomingStatusConfig[s];
          const Ic = cfg.icon;
          return (
            <button key={s} onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
              className={`flex items-center gap-3 rounded-xl p-3 border transition-all ${statusFilter === s ? `${cfg.bg} border-current ${cfg.text} shadow-sm` : 'bg-white border-border hover:border-accent/40'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}><Ic size={16} className={cfg.text} /></div>
              <div className="text-right">
                <p className={`text-lg font-bold tabular-nums ${statusFilter === s ? cfg.text : 'text-foreground'}`}>{counts[s]}</p>
                <p className="text-xs text-muted-foreground font-arabic leading-tight">{cfg.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="بحث برقم الطلب، اسم المحل، المدينة..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-border rounded-xl pr-9 pl-4 py-2.5 text-sm font-arabic focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
        </div>
        <div className="flex items-center gap-1 bg-white border border-border rounded-xl px-1 py-1 flex-wrap">
          <Filter size={14} className="text-muted-foreground mx-2" />
          {(['all', 'reviewing', 'delivering', 'completed', 'cancelled'] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-arabic font-medium transition-all ${statusFilter === s ? 'bg-accent text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'}`}>
              {s === 'all' ? 'الكل' : incomingStatusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}

      {!loading && (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="bg-white border border-border rounded-2xl p-12 text-center">
              <ShoppingCart size={40} className="mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-arabic text-muted-foreground">لا توجد طلبات تطابق البحث</p>
            </div>
          )}
          {filtered.map((order) => {
            const cfg = incomingStatusConfig[order.status as IncomingStatus] ?? incomingStatusConfig['reviewing'];
            return (
              <OrderRow key={order.id} id={order.id} orderNumber={order.orderNumber}
                placedAt={new Date(order.placedAt).toLocaleString('ar-IQ')}
                statusLabel={cfg.label} statusIcon={cfg.icon} statusBg={cfg.bg} statusText={cfg.text} statusDot={cfg.dot}
                paymentStatus={order.paymentStatus} buyerName={order.buyer.name} storeName={order.buyer.storeName}
                phone={order.buyer.phone} city={order.delivery.city} address={order.delivery.address}
                notes={order.delivery.notes} items={order.items}
                isOpen={expanded === order.id} onToggle={() => setExpanded(expanded === order.id ? null : order.id)} />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Supplier Orders Tab ──────────────────────────────────────────────────────

function SupplierOrdersTab() {
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SupplierStatus>('all');

  const load = useCallback(async () => {
    try {
      const data = await orderService.getSupplierOrders();
      setOrders(data);
      if (data.length > 0) setExpanded(data[0].id);
    } catch { toast.error('فشل تحميل طلبات الموردين'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.includes(search) ||
      o.customer.storeName.includes(search) ||
      o.customer.name.includes(search) ||
      o.delivery.city.includes(search);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
  };

  const advanceStatus = async (orderId: string, currentStatus: SupplierStatus) => {
    const next = supplierNextStatus[currentStatus];
    if (!next) return;
    try {
      await orderService.updateSupplierOrderStatus(orderId, next);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: next } : o));
    } catch { toast.error('فشل تحديث حالة الطلب'); }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {(['pending', 'ready', 'shipped'] as SupplierStatus[]).map((s) => {
          const cfg = supplierStatusConfig[s];
          const Ic = cfg.icon;
          return (
            <button key={s} onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
              className={`flex items-center gap-3 rounded-xl p-3 border transition-all ${statusFilter === s ? `${cfg.bg} border-current ${cfg.text} shadow-sm` : 'bg-white border-border hover:border-accent/40'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}><Ic size={16} className={cfg.text} /></div>
              <div className="text-right">
                <p className={`text-lg font-bold tabular-nums ${statusFilter === s ? cfg.text : 'text-foreground'}`}>{counts[s]}</p>
                <p className="text-xs text-muted-foreground font-arabic leading-tight">{cfg.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="بحث برقم الطلب، اسم المحل، المدينة..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-border rounded-xl pr-9 pl-4 py-2.5 text-sm font-arabic focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
        </div>
        <div className="flex items-center gap-1 bg-white border border-border rounded-xl px-1 py-1">
          <Filter size={14} className="text-muted-foreground mx-2" />
          {(['all', 'pending', 'ready', 'shipped'] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-arabic font-medium transition-all ${statusFilter === s ? 'bg-accent text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'}`}>
              {s === 'all' ? 'الكل' : supplierStatusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}

      {!loading && (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="bg-white border border-border rounded-2xl p-12 text-center">
              <ClipboardList size={40} className="mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-arabic text-muted-foreground">لا توجد طلبات تطابق البحث</p>
            </div>
          )}
          {filtered.map((order) => {
            const safeStatus: SupplierStatus = (order.status as SupplierStatus) in supplierStatusConfig
              ? (order.status as SupplierStatus)
              : 'pending';
            const cfg = supplierStatusConfig[safeStatus];
            const next = supplierNextStatus[safeStatus];
            const actionSlot = (
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-1">
                  {supplierStatusFlow.map((s, idx) => {
                    const stepCfg = supplierStatusConfig[s];
                    const StepIcon = stepCfg.icon;
                    const currentIdx = supplierStatusFlow.indexOf(safeStatus);
                    const isDone = idx <= currentIdx;
                    return (
                      <React.Fragment key={s}>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-arabic font-medium transition-all ${isDone ? `${stepCfg.bg} ${stepCfg.text}` : 'bg-muted/40 text-muted-foreground'}`}>
                          <StepIcon size={12} />
                          {stepCfg.label}
                        </div>
                        {idx < supplierStatusFlow.length - 1 && (
                          <div className={`w-6 h-0.5 rounded-full transition-all ${idx < currentIdx ? 'bg-accent' : 'bg-border'}`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
                {next ? (
                  <button onClick={() => advanceStatus(order.id, safeStatus)}
                    className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-xl text-sm font-arabic font-semibold hover:bg-accent/90 active:scale-95 transition-all shadow-sm">
                    {React.createElement(supplierStatusConfig[next].icon, { size: 15 })}
                    {supplierNextLabel[safeStatus]}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-arabic font-semibold">
                    <CheckCircle size={15} />
                    تم تسليم الطلب
                  </div>
                )}
              </div>
            );

            return (
              <OrderRow key={order.id} id={order.id} orderNumber={order.orderNumber}
                placedAt={new Date(order.placedAt).toLocaleString('ar-IQ')}
                statusLabel={cfg.label} statusIcon={cfg.icon} statusBg={cfg.bg} statusText={cfg.text} statusDot={cfg.dot}
                paymentStatus={order.paymentStatus} buyerName={order.customer.name} storeName={order.customer.storeName}
                phone={order.customer.phone} city={order.delivery.city} address={order.delivery.address}
                notes={order.delivery.notes} items={order.items}
                isOpen={expanded === order.id} onToggle={() => setExpanded(expanded === order.id ? null : order.id)}
                actionSlot={actionSlot} />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type TabId = 'incoming' | 'supplier';

export default function UnifiedOrdersContent() {
  const [activeTab, setActiveTab] = useState<TabId>('incoming');
  const [incomingCount, setIncomingCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);

  useEffect(() => {
    orderService.getIncomingOrders().then((d) => setIncomingCount(d.length)).catch(() => {});
    orderService.getSupplierOrders().then((d) => setSupplierCount(d.length)).catch(() => {});
  }, []);

  const tabs: { id: TabId; label: string; icon: React.ElementType; badge: number }[] = [
    { id: 'incoming', label: 'الطلبات الواردة', icon: ShoppingCart, badge: incomingCount },
    { id: 'supplier', label: 'طلبات الموردين', icon: ClipboardList, badge: supplierCount },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">الطلبات</h1>
          <p className="text-sm text-muted-foreground font-arabic mt-0.5">إدارة الطلبات الواردة وطلبات الموردين في مكان واحد</p>
        </div>
      </div>

      <div className="flex gap-2 bg-muted/40 p-1 rounded-2xl w-fit">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-arabic font-semibold transition-all ${isActive ? 'bg-white text-accent shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'}`}>
              <TabIcon size={16} />
              {tab.label}
              <span className={`text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center tabular-nums ${isActive ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'}`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {activeTab === 'incoming' ? <IncomingOrdersTab /> : <SupplierOrdersTab />}
    </div>
  );
}
