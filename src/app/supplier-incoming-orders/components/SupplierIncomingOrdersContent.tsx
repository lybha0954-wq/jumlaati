'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronDown, ChevronUp, Phone, MapPin, CheckCircle, Truck, Package, Printer, Check, X, User, AlertCircle, ArrowRight } from 'lucide-react';
import { CURRENCY } from '@/lib/commissionStore';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { orderService } from '@/lib/services/orderService';
import { useToast } from '@/components/ui/Toast';
import InvoicePrintModal, { type InvoiceData } from '@/components/ui/InvoicePrintModal';

function fmt(n: number) {
  return n.toLocaleString('ar-IQ') + ' ' + CURRENCY;
}

type OrderStatus = 'reviewing' | 'preparing' | 'shipped' | 'completed';

interface LineItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  unitPrice: number;
}

interface IncomingOrder {
  id: string;
  orderNumber: string;
  placedAt: string;
  status: OrderStatus;
  customer: { name: string; storeName: string; phone: string };
  delivery: { address: string; city: string; notes?: string };
  items: LineItem[];
}

const initialOrders: IncomingOrder[] = [
  {
    id: 'o1', orderNumber: 'ORD-2026-0841', placedAt: '٢٠٢٦/٠٨/٠٥ — ٠٩:١٥', status: 'reviewing',
    customer: { name: 'كريم حسن', storeName: 'سوبرماركت الأمل', phone: '07701234567' },
    delivery: { address: 'شارع الكرادة، بناية ١٢', city: 'بغداد — الكرخ', notes: 'التوصيل قبل الظهر' },
    items: [
      { id: 'i1', name: 'زيت نباتي 5 لتر', qty: 20, unit: 'كرتون', unitPrice: 85000 },
      { id: 'i2', name: 'سكر أبيض 50 كغ', qty: 10, unit: 'كيس', unitPrice: 62000 },
      { id: 'i3', name: 'أرز بسمتي 25 كغ', qty: 5, unit: 'كيس', unitPrice: 74000 },
    ],
  },
  {
    id: 'o2', orderNumber: 'ORD-2026-0840', placedAt: '٢٠٢٦/٠٨/٠٥ — ٠٨:٤٠', status: 'preparing',
    customer: { name: 'سامي علي', storeName: 'متجر النور', phone: '07809876543' },
    delivery: { address: 'حي الزيتون، قرب جامع الرحمن', city: 'بغداد — الرصافة' },
    items: [
      { id: 'i4', name: 'معكرونة 500غ', qty: 50, unit: 'كرتون', unitPrice: 28000 },
      { id: 'i5', name: 'صلصة طماطم 400غ', qty: 30, unit: 'كرتون', unitPrice: 35000 },
    ],
  },
  {
    id: 'o3', orderNumber: 'ORD-2026-0839', placedAt: '٢٠٢٦/٠٨/٠٤ — ١٦:٢٢', status: 'shipped',
    customer: { name: 'عمر خالد', storeName: 'متجر الرافدين', phone: '07801122334' },
    delivery: { address: 'شارع النجفي، مستشفى الجمهوري', city: 'الموصل', notes: 'الاتصال قبل الوصول' },
    items: [
      { id: 'i6', name: 'حليب كامل 1 لتر', qty: 100, unit: 'علبة', unitPrice: 3500 },
      { id: 'i7', name: 'جبنة بيضاء 1 كغ', qty: 40, unit: 'قطعة', unitPrice: 12000 },
    ],
  },
  {
    id: 'o4', orderNumber: 'ORD-2026-0838', placedAt: '٢٠٢٦/٠٨/٠٤ — ١٤:٠٥', status: 'completed',
    customer: { name: 'حيدر عباس', storeName: 'متجر السلام', phone: '07799001122' },
    delivery: { address: 'شارع الإمام علي، الحسينية الكبرى', city: 'كربلاء' },
    items: [
      { id: 'i9', name: 'دقيق قمح 25 كغ', qty: 15, unit: 'كيس', unitPrice: 38000 },
      { id: 'i10', name: 'مياه معدنية 1.5 لتر', qty: 200, unit: 'زجاجة', unitPrice: 1200 },
    ],
  },
  {
    id: 'o5', orderNumber: 'ORD-2026-0837', placedAt: '٢٠٢٦/٠٨/٠٤ — ١١:٣٠', status: 'reviewing',
    customer: { name: 'مصطفى ناصر', storeName: 'متجر الحضارة', phone: '07766778899' },
    delivery: { address: 'منطقة الكاظمية، شارع الإمام الكاظم', city: 'بغداد — الكاظمية', notes: 'مستودع خلفي' },
    items: [
      { id: 'i11', name: 'مياه معدنية 1.5 لتر', qty: 200, unit: 'زجاجة', unitPrice: 1200 },
      { id: 'i12', name: 'عصير برتقال 1 لتر', qty: 48, unit: 'علبة', unitPrice: 5500 },
    ],
  },
  {
    id: 'o6', orderNumber: 'ORD-2026-0836', placedAt: '٢٠٢٦/٠٨/٠٣ — ١٥:٠٠', status: 'completed',
    customer: { name: 'علي محمد', storeName: 'بقالة الرشيد', phone: '07755443322' },
    delivery: { address: 'شارع الرشيد، بناية ٤', city: 'بغداد — الرصافة' },
    items: [
      { id: 'i13', name: 'صابون غسيل 1 كغ', qty: 60, unit: 'كرتون', unitPrice: 15000 },
    ],
  },
];

const statusConfig: Record<OrderStatus, {
  label: string; icon: React.ElementType; bg: string; text: string;
  border: string; dot: string; nextLabel: string | null; nextStatus: OrderStatus | null;
  headerBg: string; toastMsg: string;
}> = {
  reviewing: {
    label: 'قيد المراجعة', icon: AlertCircle,
    bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300',
    dot: 'bg-orange-400', nextLabel: 'قبول الطلب', nextStatus: 'preparing',
    headerBg: 'bg-orange-50/80', toastMsg: 'تم قبول الطلب وبدء التجهيز',
  },
  preparing: {
    label: 'قيد التجهيز', icon: Package,
    bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300',
    dot: 'bg-blue-500', nextLabel: 'تم الشحن', nextStatus: 'shipped',
    headerBg: 'bg-blue-50/80', toastMsg: 'تم شحن الطلب بنجاح',
  },
  shipped: {
    label: 'تم الشحن', icon: Truck,
    bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-300',
    dot: 'bg-violet-500', nextLabel: 'تأكيد الاستلام', nextStatus: 'completed',
    headerBg: 'bg-violet-50/80', toastMsg: 'تم تأكيد استلام الطلب',
  },
  completed: {
    label: 'مكتمل', icon: CheckCircle,
    bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200',
    dot: 'bg-emerald-500', nextLabel: null, nextStatus: null,
    headerBg: 'bg-emerald-50/80', toastMsg: 'الطلب مكتمل',
  },
};

export default function SupplierIncomingOrdersContent() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<IncomingOrder[]>(initialOrders);
  const [expanded, setExpanded] = useState<string | null>('o1');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [printingId, setPrintingId] = useState<string | null>(null);
  const [realtimePulse, setRealtimePulse] = useState(false);
  const [advancingId, setAdvancingId] = useState<string | null>(null);
  const [invoiceModal, setInvoiceModal] = useState<InvoiceData | null>(null);

  const loadLiveOrders = useCallback(async () => {
    try {
      const liveOrders = await orderService.getIncomingOrders();
      if (liveOrders && liveOrders.length > 0) {
        const mapped: IncomingOrder[] = liveOrders.map((o: any) => ({
          id: o.id,
          orderNumber: o.orderNumber || o.order_number || o.id,
          placedAt: o.placedAt || o.placed_at || o.created_at || '',
          status: (o.status === 'pending' ? 'reviewing' : o.status) as OrderStatus,
          customer: { name: o.buyerName || o.buyer_name || 'عميل', storeName: o.buyerStoreName || o.buyer_store_name || 'متجر', phone: o.buyerPhone || o.buyer_phone || '' },
          delivery: { address: o.deliveryAddress || o.delivery_address || '', city: o.deliveryCity || o.delivery_city || '', notes: o.deliveryNotes || o.delivery_notes || '' },
          items: [],
        }));
        setOrders(mapped);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => { loadLiveOrders(); }, [loadLiveOrders]);

  useRealtimeSubscription({
    table: 'orders', event: 'INSERT',
    onData: () => { setRealtimePulse(true); setTimeout(() => setRealtimePulse(false), 1500); loadLiveOrders(); },
  });
  useRealtimeSubscription({
    table: 'orders', event: 'UPDATE',
    onData: (payload) => {
      setRealtimePulse(true);
      setTimeout(() => setRealtimePulse(false), 1500);
      if (payload?.new?.id) {
        setOrders((prev) => prev.map((o) => o.id === payload.new.id ? { ...o, status: (payload.new.status === 'pending' ? 'reviewing' : payload.new.status) as OrderStatus } : o));
      }
    },
  });

  const filtered = orders.filter((o) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q || o.orderNumber.toLowerCase().includes(q) || o.customer.storeName.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.delivery.city.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: orders.length,
    reviewing: orders.filter((o) => o.status === 'reviewing').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  const advanceStatus = (orderId: string) => {
    setAdvancingId(orderId);
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== orderId) return o;
          const cfg = statusConfig[o.status];
          if (cfg.nextStatus) {
            showToast('success', cfg.toastMsg, o.customer.storeName, 3000);
            return { ...o, status: cfg.nextStatus };
          }
          return o;
        })
      );
      setAdvancingId(null);
    }, 600);
  };

  const rejectOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (order) showToast('error', 'تم رفض الطلب', order.customer.storeName, 3000);
  };

  const printInvoice = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const invoiceData: InvoiceData = {
      invoiceNumber: order.orderNumber,
      date: order.placedAt,
      sellerName: 'المورد — جُمْلَتِي',
      sellerPhone: '',
      buyerName: order.customer.name,
      buyerStoreName: order.customer.storeName,
      buyerPhone: order.customer.phone,
      buyerAddress: `${order.delivery.address}، ${order.delivery.city}`,
      items: order.items.map((item) => ({
        name: item.name,
        qty: item.qty,
        unit: item.unit,
        unitPrice: item.unitPrice,
      })),
      notes: order.delivery.notes,
    };
    setInvoiceModal(invoiceData);
  };

  const orderTotal = (items: LineItem[]) => items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

  return (
    <div className="space-y-4 pb-6" dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-foreground font-arabic">الطلبات الواردة</h1>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">{orders.length} طلب إجمالي</p>
        </div>
        <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-xl px-3 py-1.5">
          <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
          <span className="text-xs font-arabic font-semibold text-orange-700">{counts.reviewing} جديد</span>
        </div>
      </div>

      {/* ── Order Flow Pipeline ── */}
      <div className="bg-card border border-border rounded-2xl p-3">
        <p className="text-[10px] text-muted-foreground font-arabic mb-2 font-semibold uppercase tracking-wide">مسار الطلبات</p>
        <div className="flex items-center gap-1">
          {(['reviewing', 'preparing', 'shipped', 'completed'] as OrderStatus[]).map((s, i) => {
            const cfg = statusConfig[s];
            const SIcon = cfg.icon;
            const active = statusFilter === s;
            const count = counts[s];
            return (
              <React.Fragment key={s}>
                <button
                  onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
                  className={`flex-1 flex flex-col items-center gap-1 rounded-xl p-2 border transition-all active:scale-95 ${active ? `${cfg.bg} ${cfg.border} ${cfg.text}` : 'bg-muted/30 border-transparent text-muted-foreground'}`}
                >
                  <SIcon size={15} />
                  <span className="text-[9px] font-arabic font-semibold leading-tight text-center">{cfg.label}</span>
                  <span className={`text-sm font-bold tabular-nums ${active ? cfg.text : count > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>{count}</span>
                </button>
                {i < 3 && <ArrowRight size={12} className="text-muted-foreground flex-shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="بحث برقم الطلب، المحل، المدينة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-border rounded-2xl pr-9 pl-4 py-2.5 text-sm font-arabic focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        {search && <button onClick={() => setSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><X size={14} /></button>}
      </div>

      {/* ── Orders List ── */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground font-arabic text-sm">
            <Package size={32} className="mx-auto mb-2 opacity-30" />
            لا توجد طلبات مطابقة
          </div>
        )}
        {filtered.map((order) => {
          const cfg = statusConfig[order.status];
          const StatusIcon = cfg.icon;
          const isExpanded = expanded === order.id;
          const total = orderTotal(order.items);
          const isPrinting = printingId === order.id;
          const isAdvancing = advancingId === order.id;

          return (
            <div
              key={order.id}
              className={`bg-card border rounded-2xl overflow-hidden transition-all ${order.status === 'reviewing' ? 'border-orange-300 shadow-sm shadow-orange-100' : 'border-border'}`}
            >
              {/* Order Header */}
              <button
                className="w-full flex items-center gap-3 p-3 text-right hover:bg-muted/10 active:bg-muted/20 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : order.id)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                  <StatusIcon size={18} className={cfg.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-foreground font-arabic">{order.customer.storeName}</p>
                    <span className={`text-[10px] font-arabic font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                    {order.status === 'reviewing' && <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" /></span>}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-arabic mt-0.5">{order.orderNumber} · {order.placedAt}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <p className="text-sm font-bold text-foreground tabular-nums font-arabic">{fmt(total)}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground font-arabic">{order.items.length} منتجات</span>
                    {isExpanded ? <ChevronUp size={13} className="text-muted-foreground" /> : <ChevronDown size={13} className="text-muted-foreground" />}
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-border">
                  {/* Customer & Delivery */}
                  <div className={`px-3 py-3 space-y-2 ${cfg.headerBg}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <User size={12} className="text-muted-foreground" />
                      </div>
                      <span className="text-xs font-arabic text-foreground font-semibold">{order.customer.name}</span>
                      <a href={`tel:${order.customer.phone}`} className="flex items-center gap-1 text-primary text-xs font-arabic mr-auto bg-white rounded-lg px-2 py-1 active:scale-95 transition-all hover:bg-primary/5">
                        <Phone size={11} />
                        {order.customer.phone}
                      </a>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin size={12} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-arabic text-foreground">{order.delivery.address}</p>
                        <p className="text-[10px] text-muted-foreground font-arabic">{order.delivery.city}</p>
                        {order.delivery.notes && <p className="text-[10px] text-accent font-arabic mt-0.5 font-semibold">ملاحظة: {order.delivery.notes}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="px-3 py-2.5 space-y-1.5 bg-white">
                    <p className="text-[10px] font-semibold text-muted-foreground font-arabic uppercase tracking-wide">المنتجات ({order.items.length})</p>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-muted rounded-lg flex items-center justify-center text-[10px] font-bold text-muted-foreground tabular-nums">{item.qty}</span>
                          <div>
                            <span className="text-xs font-arabic text-foreground">{item.name}</span>
                            <span className="text-[10px] text-muted-foreground font-arabic mr-1">{item.unit}</span>
                          </div>
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-arabic font-semibold text-foreground tabular-nums">{fmt(item.qty * item.unitPrice)}</span>
                          <p className="text-[10px] text-muted-foreground font-arabic tabular-nums">{fmt(item.unitPrice)} / وحدة</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-border mt-1">
                      <span className="text-xs font-bold text-foreground font-arabic">الإجمالي</span>
                      <span className="text-sm font-bold text-primary tabular-nums font-arabic">{fmt(total)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-3 pb-3 pt-2 flex gap-2 flex-wrap bg-white border-t border-border">
                    <button
                      onClick={() => printInvoice(order.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-arabic font-semibold border transition-all active:scale-95 ${isPrinting ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-muted border-border text-muted-foreground hover:text-foreground'}`}
                    >
                      {isPrinting ? <Check size={13} /> : <Printer size={13} />}
                      {isPrinting ? 'تمت الطباعة ✓' : 'طباعة الفاتورة'}
                    </button>

                    {order.status === 'reviewing' && (
                      <button
                        onClick={() => rejectOrder(order.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-arabic font-semibold bg-red-50 border border-red-200 text-red-600 active:scale-95 transition-all hover:bg-red-100"
                      >
                        <X size={13} />
                        رفض الطلب
                      </button>
                    )}

                    {cfg.nextStatus && (
                      <button
                        onClick={() => advanceStatus(order.id)}
                        disabled={isAdvancing}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-arabic font-semibold bg-primary text-white active:scale-95 transition-all shadow-sm hover:bg-primary/90 disabled:opacity-70"
                      >
                        {isAdvancing ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            {order.status === 'reviewing' ? <Check size={13} /> : order.status === 'preparing' ? <Truck size={13} /> : <CheckCircle size={13} />}
                            {cfg.nextLabel}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length > 0 && (
        <p className="text-center text-xs text-muted-foreground font-arabic">عرض {filtered.length} من {orders.length} طلب</p>
      )}

      {/* Invoice Print Modal */}
      {invoiceModal && (
        <InvoicePrintModal
          invoice={invoiceModal}
          onClose={() => setInvoiceModal(null)}
        />
      )}
    </div>
  );
}
