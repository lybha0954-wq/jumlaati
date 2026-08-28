'use client';
import React, { useState } from 'react';
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
} from 'lucide-react';
import { CURRENCY } from '@/lib/commissionStore';
import Icon from '@/components/ui/AppIcon';


type OrderStatus = 'pending' | 'ready' | 'shipped';

interface LineItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  unitPrice: number;
}

interface SupplierOrder {
  id: string;
  orderNumber: string;
  placedAt: string;
  status: OrderStatus;
  customer: {
    name: string;
    storeName: string;
    phone: string;
  };
  delivery: {
    address: string;
    city: string;
    notes?: string;
  };
  items: LineItem[];
}

const initialOrders: SupplierOrder[] = [
  {
    id: 'o1',
    orderNumber: 'ORD-2026-0841',
    placedAt: '٢٠٢٦/٠٨/٠٤ - ٠٩:١٥',
    status: 'pending',
    customer: { name: 'كريم حسن', storeName: 'سوبرماركت الأمل', phone: '07701234567' },
    delivery: { address: 'شارع الكرادة، بناية رقم ١٢', city: 'بغداد - الكرخ', notes: 'التوصيل قبل الظهر' },
    items: [
      { id: 'i1', name: 'زيت نباتي ٥ لتر', qty: 20, unit: 'كرتون', unitPrice: 85000 },
      { id: 'i2', name: 'سكر أبيض ٥٠ كغ', qty: 10, unit: 'كيس', unitPrice: 62000 },
      { id: 'i3', name: 'أرز بسمتي ٢٥ كغ', qty: 8, unit: 'كيس', unitPrice: 74000 },
    ],
  },
  {
    id: 'o2',
    orderNumber: 'ORD-2026-0840',
    placedAt: '٢٠٢٦/٠٨/٠٤ - ٠٨:٤٠',
    status: 'ready',
    customer: { name: 'سامي علي', storeName: 'متجر النور', phone: '07809876543' },
    delivery: { address: 'حي الزيتون، قرب جامع الرحمن', city: 'بغداد - الرصافة' },
    items: [
      { id: 'i4', name: 'معكرونة ٥٠٠غ', qty: 50, unit: 'كرتون', unitPrice: 28000 },
      { id: 'i5', name: 'صلصة طماطم ٤٠٠غ', qty: 30, unit: 'كرتون', unitPrice: 35000 },
    ],
  },
  {
    id: 'o3',
    orderNumber: 'ORD-2026-0839',
    placedAt: '٢٠٢٦/٠٨/٠٣ - ١٦:٢٢',
    status: 'shipped',
    customer: { name: 'عمر خالد', storeName: 'متجر الرافدين', phone: '07801122334' },
    delivery: { address: 'شارع النجفي، بجانب مستشفى الجمهوري', city: 'الموصل', notes: 'الاتصال قبل الوصول' },
    items: [
      { id: 'i6', name: 'حليب كامل الدسم ١ لتر', qty: 100, unit: 'علبة', unitPrice: 3500 },
      { id: 'i7', name: 'جبنة بيضاء ١ كغ', qty: 40, unit: 'قطعة', unitPrice: 12000 },
      { id: 'i8', name: 'زبادي طبيعي ٥٠٠غ', qty: 60, unit: 'علبة', unitPrice: 4500 },
    ],
  },
  {
    id: 'o4',
    orderNumber: 'ORD-2026-0838',
    placedAt: '٢٠٢٦/٠٨/٠٣ - ١٤:٠٥',
    status: 'pending',
    customer: { name: 'حيدر عباس', storeName: 'متجر السلام', phone: '07799001122' },
    delivery: { address: 'شارع الإمام علي، مقابل الحسينية الكبرى', city: 'كربلاء' },
    items: [
      { id: 'i9', name: 'دقيق قمح ٢٥ كغ', qty: 15, unit: 'كيس', unitPrice: 38000 },
      { id: 'i10', name: 'خميرة فورية ٥٠٠غ', qty: 24, unit: 'علبة', unitPrice: 8500 },
    ],
  },
  {
    id: 'o5',
    orderNumber: 'ORD-2026-0837',
    placedAt: '٢٠٢٦/٠٨/٠٣ - ١١:٣٠',
    status: 'ready',
    customer: { name: 'مصطفى ناصر', storeName: 'متجر الحضارة', phone: '07766778899' },
    delivery: { address: 'منطقة الكاظمية، شارع الإمام الكاظم', city: 'بغداد - الكاظمية', notes: 'مستودع خلفي' },
    items: [
      { id: 'i11', name: 'مياه معدنية ١.٥ لتر', qty: 200, unit: 'زجاجة', unitPrice: 1200 },
      { id: 'i12', name: 'عصير برتقال ١ لتر', qty: 48, unit: 'علبة', unitPrice: 5500 },
      { id: 'i13', name: 'مشروب غازي ٢٥٠مل', qty: 120, unit: 'علبة', unitPrice: 1800 },
    ],
  },
];

const statusConfig: Record<OrderStatus, { label: string; icon: React.ElementType; bg: string; text: string; dot: string }> = {
  pending: { label: 'قيد الانتظار', icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  ready: { label: 'جاهز للشحن', icon: CheckCircle, bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  shipped: { label: 'تم الشحن', icon: Truck, bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

const statusFlow: OrderStatus[] = ['pending', 'ready', 'shipped'];

const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  pending: 'ready',
  ready: 'shipped',
  shipped: null,
};

const nextLabel: Record<OrderStatus, string> = {
  pending: 'تحديد كـ "جاهز للشحن"',
  ready: 'تحديد كـ "تم الشحن"',
  shipped: '',
};

function formatPrice(n: number) {
  return n.toLocaleString('ar-IQ') + ' ' + CURRENCY;
}

export default function SupplierOrdersContent() {
  const [orders, setOrders] = useState<SupplierOrder[]>(initialOrders);
  const [expanded, setExpanded] = useState<string | null>('o1');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');

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

  const advanceStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const next = nextStatus[o.status];
        return next ? { ...o, status: next } : o;
      })
    );
  };

  const orderTotal = (items: LineItem[]) => items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">طلبات الموردين الواردة</h1>
          <p className="text-sm text-muted-foreground font-arabic mt-0.5">
            إدارة الطلبات الواردة من المحلات مع تفاصيل المنتجات وعناوين التوصيل
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-4 py-2 shadow-sm">
          <ClipboardList size={18} className="text-accent" />
          <span className="font-arabic text-sm font-semibold text-foreground">{orders.length} طلب إجمالي</span>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-3">
        {(['pending', 'ready', 'shipped'] as OrderStatus[]).map((s) => {
          const cfg = statusConfig[s];
          const Icon = cfg.icon;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
              className={`flex items-center gap-3 rounded-xl p-4 border transition-all ${
                statusFilter === s
                  ? `${cfg.bg} border-current ${cfg.text} shadow-sm`
                  : 'bg-white border-border hover:border-accent/40'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cfg.bg}`}>
                <Icon size={18} className={cfg.text} />
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold tabular-nums ${statusFilter === s ? cfg.text : 'text-foreground'}`}>
                  {counts[s]}
                </p>
                <p className="text-xs text-muted-foreground font-arabic">{cfg.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث برقم الطلب، اسم المحل، المدينة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-border rounded-xl pr-9 pl-4 py-2.5 text-sm font-arabic focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-border rounded-xl px-1 py-1">
          <Filter size={14} className="text-muted-foreground mx-2" />
          {(['all', 'pending', 'ready', 'shipped'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-arabic font-medium transition-all ${
                statusFilter === s
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              }`}
            >
              {s === 'all' ? 'الكل' : statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white border border-border rounded-2xl p-12 text-center">
            <ClipboardList size={40} className="mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-arabic text-muted-foreground">لا توجد طلبات تطابق البحث</p>
          </div>
        )}
        {filtered.map((order) => {
          const cfg = statusConfig[order.status];
          const StatusIcon = cfg.icon;
          const isOpen = expanded === order.id;
          const total = orderTotal(order.items);
          const next = nextStatus[order.status];

          return (
            <div
              key={order.id}
              className={`bg-white border rounded-2xl overflow-hidden transition-all shadow-sm ${
                isOpen ? 'border-accent/40 shadow-md' : 'border-border hover:border-accent/20'
              }`}
            >
              {/* Order header row */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer select-none"
                onClick={() => setExpanded(isOpen ? null : order.id)}
              >
                {/* Status dot */}
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />

                {/* Order info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-foreground font-arabic text-sm">{order.orderNumber}</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-arabic px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                      <StatusIcon size={11} />
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-arabic mt-0.5">
                    {order.customer.storeName} · {order.placedAt}
                  </p>
                </div>

                {/* Total */}
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-bold text-foreground tabular-nums">{formatPrice(total)}</p>
                  <p className="text-xs text-muted-foreground font-arabic">{order.items.length} منتجات</p>
                </div>

                {/* Expand icon */}
                <div className="text-muted-foreground flex-shrink-0">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* Expanded details */}
              {isOpen && (
                <div className="border-t border-border/60 px-5 pb-5 pt-4 space-y-5">
                  {/* Customer + Delivery row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Customer */}
                    <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground font-arabic uppercase tracking-wide">
                        بيانات العميل
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <User size={14} className="text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground font-arabic">{order.customer.storeName}</p>
                          <p className="text-xs text-muted-foreground font-arabic">{order.customer.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-arabic">
                        <Phone size={12} className="text-accent flex-shrink-0" />
                        <span dir="ltr">{order.customer.phone}</span>
                      </div>
                    </div>

                    {/* Delivery address */}
                    <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground font-arabic uppercase tracking-wide">
                        عنوان التوصيل
                      </p>
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-foreground font-arabic">{order.delivery.city}</p>
                          <p className="text-xs text-muted-foreground font-arabic">{order.delivery.address}</p>
                          {order.delivery.notes && (
                            <p className="text-xs text-amber-600 font-arabic mt-1">ملاحظة: {order.delivery.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Line items table */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground font-arabic uppercase tracking-wide mb-2">
                      تفاصيل المنتجات
                    </p>
                    <div className="rounded-xl border border-border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/40 border-b border-border">
                            <th className="text-right px-4 py-2.5 font-arabic text-xs font-semibold text-muted-foreground">
                              المنتج
                            </th>
                            <th className="text-center px-3 py-2.5 font-arabic text-xs font-semibold text-muted-foreground">
                              الكمية
                            </th>
                            <th className="text-center px-3 py-2.5 font-arabic text-xs font-semibold text-muted-foreground">
                              سعر الوحدة
                            </th>
                            <th className="text-left px-4 py-2.5 font-arabic text-xs font-semibold text-muted-foreground">
                              الإجمالي
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, idx) => (
                            <tr
                              key={item.id}
                              className={`border-b border-border/50 last:border-0 ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0">
                                    <Package size={12} className="text-accent" />
                                  </div>
                                  <span className="font-arabic text-foreground text-sm">{item.name}</span>
                                </div>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span className="font-arabic text-sm text-foreground tabular-nums">
                                  {item.qty} {item.unit}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span className="font-arabic text-sm text-muted-foreground tabular-nums">
                                  {formatPrice(item.unitPrice)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-left">
                                <span className="font-arabic text-sm font-semibold text-foreground tabular-nums">
                                  {formatPrice(item.qty * item.unitPrice)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-accent/5 border-t border-accent/20">
                            <td colSpan={3} className="px-4 py-3 text-right font-arabic text-sm font-bold text-foreground">
                              إجمالي الطلب
                            </td>
                            <td className="px-4 py-3 text-left font-arabic text-sm font-bold text-accent tabular-nums">
                              {formatPrice(total)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Status progression */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    {/* Progress steps */}
                    <div className="flex items-center gap-1">
                      {statusFlow.map((s, idx) => {
                        const stepCfg = statusConfig[s];
                        const StepIcon = stepCfg.icon;
                        const currentIdx = statusFlow.indexOf(order.status);
                        const isDone = idx <= currentIdx;
                        return (
                          <React.Fragment key={s}>
                            <div
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-arabic font-medium transition-all ${
                                isDone ? `${stepCfg.bg} ${stepCfg.text}` : 'bg-muted/40 text-muted-foreground'
                              }`}
                            >
                              <StepIcon size={12} />
                              {stepCfg.label}
                            </div>
                            {idx < statusFlow.length - 1 && (
                              <div
                                className={`w-6 h-0.5 rounded-full transition-all ${
                                  idx < currentIdx ? 'bg-accent' : 'bg-border'
                                }`}
                              />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* Advance button */}
                    {next && (
                      <button
                        onClick={() => advanceStatus(order.id)}
                        className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-xl text-sm font-arabic font-semibold hover:bg-accent/90 active:scale-95 transition-all shadow-sm"
                      >
                        {React.createElement(statusConfig[next].icon, { size: 15 })}
                        {nextLabel[order.status]}
                      </button>
                    )}
                    {!next && (
                      <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-arabic font-semibold">
                        <CheckCircle size={15} />
                        تم تسليم الطلب
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
