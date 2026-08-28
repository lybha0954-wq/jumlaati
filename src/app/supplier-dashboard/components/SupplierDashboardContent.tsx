'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, AlertTriangle, Plus, X, Bell, ArrowUpRight, Percent, Clock, CheckCircle, Gift, Package, ChevronRight, Star, Truck, ToggleLeft, ToggleRight, Flame, Target, Activity, LogOut, DollarSign } from 'lucide-react';
import { CURRENCY } from '@/lib/commissionStore';
import Link from 'next/link';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { orderService } from '@/lib/services/orderService';
import { productService } from '@/lib/services/productService';
import { useToast } from '@/components/ui/Toast';
import UnifiedNotificationCenter from '@/components/UnifiedNotificationCenter';
import DebtPaymentModal from '@/components/ui/DebtPaymentModal';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

function fmt(n: number) {
  return n.toLocaleString('ar-IQ') + ' ' + CURRENCY;
}

interface Promo {
  id: string;
  title: string;
  discount: number;
  product: string;
  expiry: string;
  active: boolean;
  usageCount: number;
}

const initialPromos: Promo[] = [
  { id: 'p1', title: 'عرض رمضان الذهبي', discount: 15, product: 'زيت نباتي 5 لتر', expiry: '٢٠٢٦/٠٨/٣٠', active: true, usageCount: 47 },
  { id: 'p2', title: 'خصم الجملة الكبرى', discount: 10, product: 'سكر أبيض 50 كغ', expiry: '٢٠٢٦/٠٩/١٥', active: true, usageCount: 23 },
  { id: 'p3', title: 'تصفية نهاية الموسم', discount: 20, product: 'أرز بسمتي 25 كغ', expiry: '٢٠٢٦/٠٨/٢٠', active: false, usageCount: 8 },
  { id: 'p4', title: 'عرض المنظفات', discount: 12, product: 'صابون غسيل 1 كغ', expiry: '٢٠٢٦/٠٩/٠١', active: true, usageCount: 31 },
];

const statusMap: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  reviewing: { label: 'قيد المراجعة', color: 'text-orange-700', bg: 'bg-orange-100', dot: 'bg-orange-400' },
  preparing: { label: 'قيد التجهيز',  color: 'text-blue-700',   bg: 'bg-blue-100',   dot: 'bg-blue-500'   },
  shipped:   { label: 'تم الشحن',     color: 'text-violet-700', bg: 'bg-violet-100', dot: 'bg-violet-500' },
  completed: { label: 'مكتمل',        color: 'text-emerald-700', bg: 'bg-emerald-100', dot: 'bg-emerald-500' },
};

// ── KPI Detail Modal ──────────────────────────────────────────────────────────
function KpiDetailModal({ title, value, subtitle, details, color, onClose }: {
  title: string; value: string; subtitle: string; details: string[]; color: string; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} dir="rtl">
      <div className="bg-card w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className={`px-5 py-4 flex items-center justify-between ${color}`}>
          <div>
            <h2 className="font-arabic font-bold text-white text-base">{title}</h2>
            <p className="text-white/70 text-xs font-arabic mt-0.5">{subtitle}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="text-center py-3">
            <p className="font-arabic text-4xl font-bold text-foreground tabular-nums">{value}</p>
          </div>
          <div className="space-y-2">
            {details.map((d, i) => (
              <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2.5">
                <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                <p className="font-arabic text-sm text-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Financial Debt Modal — replaced by shared DebtPaymentModal ───────────────

// ── Sign-Out Confirmation Modal ───────────────────────────────────────────────
function SignOutModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} dir="rtl">
      <div className="bg-card w-full max-w-xs rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
            <LogOut size={28} className="text-red-500" />
          </div>
          <div>
            <h2 className="font-arabic font-bold text-xl text-foreground">تأكيد تسجيل الخروج</h2>
            <p className="font-arabic text-sm text-muted-foreground mt-1">هل أنت متأكد من رغبتك في تسجيل الخروج؟</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 bg-muted text-foreground rounded-xl py-3 font-arabic font-semibold text-sm hover:bg-muted/80 active:scale-95 transition-all">إلغاء</button>
            <button onClick={onConfirm} className="flex-1 bg-red-500 text-white rounded-xl py-3 font-arabic font-semibold text-sm hover:bg-red-600 active:scale-95 transition-all">تسجيل الخروج</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Notification Drawer ───────────────────────────────────────────────────────
function NotificationDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} dir="rtl">
      <div className="bg-card w-full max-w-lg rounded-t-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <h2 className="font-arabic font-bold text-foreground text-base">الإشعارات</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-4">
          <UnifiedNotificationCenter role="supplier" embedded />
        </div>
      </div>
    </div>
  );
}

export default function SupplierDashboardContent() {
  const { showToast } = useToast();
  const { signOut } = useAuth();
  const router = useRouter();
  const [promos, setPromos] = useState<Promo[]>(initialPromos);
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [newPromo, setNewPromo] = useState({ title: '', discount: '', product: '', expiry: '' });
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showAllStock, setShowAllStock] = useState(false);

  // ── Modal states ─────────────────────────────────────────────────────────────
  const [kpiModal, setKpiModal] = useState<null | { title: string; value: string; subtitle: string; details: string[]; color: string }>(null);
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // ── Live data state ──────────────────────────────────────────────────────────
  const [recentOrders, setRecentOrders] = useState([
    { id: 'ORD-0841', store: 'سوبرماركت الأمل', amount: 1_870_000, status: 'reviewing', time: 'منذ ١٢ د', items: 3 },
    { id: 'ORD-0840', store: 'متجر النور', amount: 2_450_000, status: 'preparing', time: 'منذ ٤٥ د', items: 5 },
    { id: 'ORD-0839', store: 'متجر الرافدين', amount: 980_000, status: 'shipped', time: 'منذ ٣ س', items: 2 },
    { id: 'ORD-0838', store: 'متجر السلام', amount: 1_230_000, status: 'reviewing', time: 'منذ ٥ س', items: 4 },
    { id: 'ORD-0837', store: 'متجر الحضارة', amount: 3_100_000, status: 'completed', time: 'منذ ٧ س', items: 6 },
  ]);

  const [lowStockItems, setLowStockItems] = useState([
    { name: 'سكر أبيض 50 كغ', stock: 18, min: 50, unit: 'كيس' },
    { name: 'معكرونة 500غ', stock: 8, min: 30, unit: 'كرتون' },
    { name: 'حليب كامل 1 لتر', stock: 0, min: 100, unit: 'علبة' },
    { name: 'طحين قمح 25 كغ', stock: 12, min: 40, unit: 'كيس' },
  ]);

  const [kpiSales] = useState(6_530_000);
  const [kpiPending, setKpiPending] = useState(7);
  const [kpiLowStock, setKpiLowStock] = useState(12);
  const [realtimePulse, setRealtimePulse] = useState(false);

  // ── Initial data load ────────────────────────────────────────────────────────
  const loadOrders = useCallback(async () => {
    try {
      const orders = await orderService.getIncomingOrders();
      if (orders && orders.length > 0) {
        const mapped = orders.slice(0, 5).map((o: any) => ({
          id: o.orderNumber || o.id,
          store: o.buyerStoreName || o.buyer_store_name || 'متجر',
          amount: Number(o.total) || 0,
          status: o.status === 'pending' ? 'reviewing' : o.status,
          time: 'الآن',
          items: 1,
        }));
        setRecentOrders(mapped);
        setKpiPending(orders.filter((o: any) => o.status === 'pending' || o.status === 'reviewing').length);
      }
    } catch { /* silent */ }
  }, []);

  const loadInventory = useCallback(async () => {
    try {
      const products = await productService.getAll();
      if (products && products.length > 0) {
        const low = products
          .filter((p: any) => (p.stock ?? p.stock_quantity ?? 0) <= (p.low_stock_threshold ?? 10))
          .slice(0, 4)
          .map((p: any) => ({
            name: p.name || p.name_ar || 'منتج',
            stock: p.stock ?? p.stock_quantity ?? 0,
            min: p.low_stock_threshold ?? 10,
            unit: p.unit || 'قطعة',
          }));
        if (low.length > 0) setLowStockItems(low);
        setKpiLowStock(low.length);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    loadOrders();
    loadInventory();
  }, [loadOrders, loadInventory]);

  useRealtimeSubscription({ table: 'orders', event: '*', onData: () => { setRealtimePulse(true); setTimeout(() => setRealtimePulse(false), 1500); loadOrders(); } });
  useRealtimeSubscription({ table: 'products', event: '*', onData: () => { loadInventory(); } });
  useRealtimeSubscription({ table: 'supplier_orders', event: '*', onData: () => { setRealtimePulse(true); setTimeout(() => setRealtimePulse(false), 1500); loadOrders(); } });

  const togglePromo = (id: string) => {
    setPromos((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const next = { ...p, active: !p.active };
      showToast(next.active ? 'success' : 'info', next.active ? 'تم تفعيل العرض' : 'تم إيقاف العرض', next.title, 2500);
      return next;
    }));
  };

  const deletePromo = (id: string) => {
    const promo = promos.find((p) => p.id === id);
    setPromos((prev) => prev.filter((p) => p.id !== id));
    if (promo) showToast('error', 'تم حذف العرض', promo.title, 2500);
  };

  const addPromo = () => {
    if (!newPromo.title || !newPromo.discount || !newPromo.product) return;
    setPromos((prev) => [
      { id: `p${Date.now()}`, title: newPromo.title, discount: Number(newPromo.discount), product: newPromo.product, expiry: newPromo.expiry || '٢٠٢٦/١٢/٣١', active: true, usageCount: 0 },
      ...prev,
    ]);
    showToast('success', 'تمت إضافة العرض بنجاح', newPromo.title, 3000);
    setNewPromo({ title: '', discount: '', product: '', expiry: '' });
    setShowPromoForm(false);
  };

  const handleSignOut = async () => {
    setShowSignOut(false);
    showToast('info', 'جاري تسجيل الخروج...', undefined, 2000);
    try { await signOut(); } catch { /* silent */ }
    setTimeout(() => router.push('/sign-up-login'), 1500);
  };

  const displayedOrders = showAllOrders ? recentOrders : recentOrders.slice(0, 3);
  const displayedStock = showAllStock ? lowStockItems : lowStockItems.slice(0, 3);

  return (
    <div className="space-y-5 pb-6" dir="rtl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-[11px] text-muted-foreground font-arabic">الثلاثاء ٥ أغسطس ٢٠٢٦</p>
          <h1 className="text-xl font-bold text-foreground font-arabic leading-tight">لوحة المورد</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <button
            onClick={() => setShowNotifications(true)}
            className="relative w-9 h-9 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-center hover:bg-orange-100 active:scale-95 transition-all"
          >
            <Bell size={18} className="text-orange-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">٥</span>
          </button>
          {/* Sign Out */}
          <button
            onClick={() => setShowSignOut(true)}
            className="w-9 h-9 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-100 active:scale-95 transition-all"
            title="تسجيل الخروج"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* ── KPI Bento Grid ── */}
      <div className="grid grid-cols-2 gap-3">

        {/* Total Sales — full width hero card (clickable) */}
        <button
          onClick={() => setKpiModal({
            title: 'إجمالي المبيعات',
            value: fmt(kpiSales),
            subtitle: 'مقارنةً بالأمس ٥,٥٣٠,٠٠٠ د.ع',
            color: 'bg-gradient-to-l from-[#1a1a2e] to-[#0f3460]',
            details: [
              'مبيعات اليوم: ٦,٥٣٠,٠٠٠ د.ع',
              'مبيعات هذا الأسبوع: ٤٢.٣م د.ع',
              'مبيعات هذا الشهر: ١٨٧م د.ع',
              'طلبات اليوم: ٣١ طلب',
              'نمو مقارنة بالأمس: +١٨٪',
            ],
          })}
          className="col-span-2 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-2xl p-4 text-white relative overflow-hidden text-right hover:opacity-95 active:scale-[0.99] transition-all"
        >
          <div className="absolute -top-6 -left-6 w-28 h-28 bg-white/5 rounded-full" />
          <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-white/5 rounded-full" />
          <div className="absolute top-4 left-4 w-16 h-16 bg-[#e94560]/10 rounded-full blur-xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 bg-[#e94560]/20 rounded-lg flex items-center justify-center">
                  <Activity size={13} className="text-[#e94560]" />
                </div>
                <p className="text-xs font-arabic opacity-70">إجمالي مبيعات اليوم</p>
              </div>
              <div className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-2 py-0.5">
                <ArrowUpRight size={11} className="text-emerald-400" />
                <span className="text-[11px] font-arabic text-emerald-400 font-semibold">+١٨٪</span>
              </div>
            </div>
            <p className="text-3xl font-bold tabular-nums font-arabic">٦,٥٣٠,٠٠٠</p>
            <p className="text-xs opacity-50 font-arabic mt-0.5">{CURRENCY} — مقارنةً بالأمس ٥,٥٣٠,٠٠٠</p>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[
                { label: 'هذا الأسبوع', value: '٤٢.٣م' },
                { label: 'هذا الشهر', value: '١٨٧م' },
                { label: 'طلبات اليوم', value: '٣١' },
              ].map((s, i) => (
                <div key={i} className="bg-white/8 rounded-xl p-2 text-center">
                  <p className="text-sm font-bold tabular-nums font-arabic">{s.value}</p>
                  <p className="text-[10px] opacity-60 font-arabic mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </button>

        {/* Pending Orders — clickable link */}
        <Link href="/supplier-incoming-orders" className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 active:scale-95 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock size={17} className="text-amber-600" />
            </div>
            <div className="flex items-center gap-1 bg-amber-200/60 rounded-lg px-2 py-0.5">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-arabic text-amber-700 font-semibold">+٣ جديد</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-700 tabular-nums font-arabic">{kpiPending}</p>
          <p className="text-xs text-amber-600 font-arabic mt-0.5">طلبات معلقة</p>
          <div className="mt-2 h-1 bg-amber-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: '70%' }} />
          </div>
        </Link>

        {/* Total Debt — clickable opens debt modal */}
        <button
          onClick={() => setShowDebtModal(true)}
          className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-2xl p-4 text-right hover:opacity-95 active:scale-95 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
              <DollarSign size={17} className="text-red-500" />
            </div>
            <span className="text-[10px] font-arabic text-red-500 font-semibold bg-red-100 px-2 py-0.5 rounded-lg">٤ محلات</span>
          </div>
          <p className="text-2xl font-bold text-red-600 tabular-nums font-arabic">٢.٤م</p>
          <p className="text-xs text-red-500 font-arabic mt-0.5">ديون مستحقة {CURRENCY}</p>
          <div className="mt-2 h-1 bg-red-100 rounded-full overflow-hidden">
            <div className="h-full bg-red-400 rounded-full" style={{ width: '60%' }} />
          </div>
        </button>

        {/* Low Stock — clickable */}
        <button
          onClick={() => setKpiModal({
            title: 'تنبيهات المخزون',
            value: `${kpiLowStock} منتج`,
            subtitle: 'منتجات موشكة على النفاذ',
            color: 'bg-gradient-to-l from-violet-600 to-purple-600',
            details: lowStockItems.map((i) => `${i.name}: ${i.stock === 0 ? 'نفد' : `${i.stock}/${i.min} ${i.unit}`}`),
          })}
          className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-4 text-right hover:opacity-95 active:scale-95 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
              <AlertTriangle size={17} className="text-violet-600" />
            </div>
            <span className="text-[10px] font-arabic text-violet-600 font-semibold bg-violet-100 px-2 py-0.5 rounded-lg">تنبيه</span>
          </div>
          <p className="text-2xl font-bold text-violet-700 tabular-nums font-arabic">{kpiLowStock}</p>
          <p className="text-xs text-violet-600 font-arabic mt-0.5">منتج موشك على النفاذ</p>
          <div className="mt-2 h-1 bg-violet-100 rounded-full overflow-hidden">
            <div className="h-full bg-violet-400 rounded-full" style={{ width: '40%' }} />
          </div>
        </button>

        {/* Completed Today — clickable */}
        <button
          onClick={() => setKpiModal({
            title: 'الطلبات المكتملة',
            value: '٢٣ طلب',
            subtitle: 'مكتملة اليوم',
            color: 'bg-gradient-to-l from-emerald-600 to-teal-600',
            details: [
              'مكتملة اليوم: ٢٣ طلب',
              'مكتملة هذا الأسبوع: ١٤٧ طلب',
              'مكتملة هذا الشهر: ٥٨٩ طلب',
              'معدل الإتمام: ٩٤٪',
            ],
          })}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 text-right hover:opacity-95 active:scale-95 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle size={17} className="text-emerald-600" />
            </div>
            <span className="text-[10px] font-arabic text-emerald-600 font-semibold bg-emerald-100 px-2 py-0.5 rounded-lg">اليوم</span>
          </div>
          <p className="text-2xl font-bold text-emerald-700 tabular-nums font-arabic">٢٣</p>
          <p className="text-xs text-emerald-600 font-arabic mt-0.5">طلب مكتمل</p>
          <div className="mt-2 h-1 bg-emerald-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: '85%' }} />
          </div>
        </button>
      </div>

      {/* ── Quick Performance Row ── */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'أفضل منتج', value: 'زيت ٥ لتر', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'متوسط الطلب', value: '١.٢م', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'تقييم المورد', value: '٤.٨ ★', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((s, i) => {
          const SIcon = s.icon;
          return (
            <div key={i} className={`${s.bg} rounded-2xl p-3 flex flex-col items-center text-center gap-1.5`}>
              <SIcon size={17} className={s.color} />
              <p className={`text-xs font-bold font-arabic ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground font-arabic leading-tight">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Low Stock Alerts ── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-violet-50/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={14} className="text-violet-600" />
            </div>
            <h2 className="text-sm font-bold text-foreground font-arabic">تنبيهات المخزون</h2>
            <span className="bg-violet-100 text-violet-700 text-[10px] font-arabic font-bold px-2 py-0.5 rounded-full">{lowStockItems.length}</span>
          </div>
          <Link href="/inventory-management" className="text-xs text-primary font-arabic flex items-center gap-0.5">
            إدارة <ChevronRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {displayedStock.map((item, i) => {
            const pct = item.stock === 0 ? 0 : Math.round((item.stock / item.min) * 100);
            const isOut = item.stock === 0;
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isOut ? 'bg-red-100' : 'bg-amber-100'}`}>
                  <Package size={14} className={isOut ? 'text-red-500' : 'text-amber-600'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground font-arabic truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${isOut ? 'bg-red-500' : pct < 30 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <span className={`text-[10px] font-arabic font-semibold flex-shrink-0 ${isOut ? 'text-red-500' : 'text-amber-600'}`}>
                      {isOut ? 'نفد' : `${item.stock}/${item.min} ${item.unit}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {lowStockItems.length > 3 && (
          <button onClick={() => setShowAllStock(!showAllStock)} className="w-full py-2.5 text-xs text-primary font-arabic font-semibold border-t border-border hover:bg-muted/20 transition-colors">
            {showAllStock ? 'عرض أقل' : `عرض الكل (${lowStockItems.length})`}
          </button>
        )}
      </div>

      {/* ── Recent Orders ── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
              <ShoppingCart size={14} className="text-primary" />
            </div>
            <h2 className="text-sm font-bold text-foreground font-arabic">آخر الطلبات</h2>
          </div>
          <Link href="/supplier-incoming-orders" className="flex items-center gap-0.5 text-xs text-primary font-arabic">
            عرض الكل <ChevronRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {displayedOrders.map((o) => {
            const s = statusMap[o.status];
            return (
              <Link key={o.id} href="/supplier-incoming-orders" className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors active:bg-muted/30">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}>
                  {o.status === 'shipped' ? <Truck size={15} className={s.color} /> :
                   o.status === 'completed' ? <CheckCircle size={15} className={s.color} /> :
                   <ShoppingCart size={15} className={s.color} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground font-arabic truncate">{o.store}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-muted-foreground font-arabic">{o.id}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-[10px] text-muted-foreground font-arabic">{o.items} منتجات</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-[10px] text-muted-foreground font-arabic">{o.time}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <p className="text-xs font-bold text-foreground tabular-nums font-arabic">{fmt(o.amount)}</p>
                  <span className={`text-[10px] font-arabic font-semibold px-2 py-0.5 rounded-full ${s.bg} ${s.color}`}>{s.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
        {recentOrders.length > 3 && (
          <button onClick={() => setShowAllOrders(!showAllOrders)} className="w-full py-2.5 text-xs text-primary font-arabic font-semibold border-t border-border hover:bg-muted/20 transition-colors">
            {showAllOrders ? 'عرض أقل' : `عرض الكل (${recentOrders.length})`}
          </button>
        )}
      </div>

      {/* ── Promotions Manager ── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-accent/5 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-accent/10 rounded-lg flex items-center justify-center">
              <Gift size={14} className="text-accent" />
            </div>
            <h2 className="text-sm font-bold text-foreground font-arabic">العروض والتخفيضات</h2>
            <span className="bg-accent/10 text-accent text-[10px] font-arabic font-bold px-2 py-0.5 rounded-full">
              {promos.filter((p) => p.active).length} نشط
            </span>
          </div>
          <button
            onClick={() => setShowPromoForm(!showPromoForm)}
            className="flex items-center gap-1 bg-accent text-white text-xs font-arabic px-3 py-1.5 rounded-xl active:scale-95 transition-all shadow-sm"
          >
            <Plus size={12} />
            عرض جديد
          </button>
        </div>

        {showPromoForm && (
          <div className="px-4 py-3 bg-accent/5 border-b border-border space-y-3">
            <p className="text-xs font-bold text-foreground font-arabic">إضافة عرض ترويجي جديد</p>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="اسم العرض" value={newPromo.title} onChange={(e) => setNewPromo((p) => ({ ...p, title: e.target.value }))} className="col-span-2 border border-border rounded-xl px-3 py-2 text-sm font-arabic bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
              <input type="text" placeholder="المنتج المشمول" value={newPromo.product} onChange={(e) => setNewPromo((p) => ({ ...p, product: e.target.value }))} className="border border-border rounded-xl px-3 py-2 text-sm font-arabic bg-white focus:outline-none focus:ring-2 focus:ring-accent/30" />
              <input type="number" placeholder="نسبة الخصم ٪" value={newPromo.discount} onChange={(e) => setNewPromo((p) => ({ ...p, discount: e.target.value }))} className="border border-border rounded-xl px-3 py-2 text-sm font-arabic bg-white focus:outline-none focus:ring-2 focus:ring-accent/30" min="1" max="99" />
              <input type="date" value={newPromo.expiry} onChange={(e) => setNewPromo((p) => ({ ...p, expiry: e.target.value }))} className="col-span-2 border border-border rounded-xl px-3 py-2 text-sm font-arabic bg-white focus:outline-none focus:ring-2 focus:ring-accent/30" />
            </div>
            <div className="flex gap-2">
              <button onClick={addPromo} className="flex-1 bg-accent text-white text-sm font-arabic font-semibold py-2.5 rounded-xl active:scale-95 transition-all">إضافة العرض</button>
              <button onClick={() => setShowPromoForm(false)} className="px-4 bg-muted text-muted-foreground text-sm font-arabic rounded-xl active:scale-95 transition-all">إلغاء</button>
            </div>
          </div>
        )}

        <div className="divide-y divide-border">
          {promos.map((promo) => (
            <div key={promo.id} className={`flex items-center gap-3 px-4 py-3 transition-colors ${!promo.active ? 'opacity-60' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${promo.active ? 'bg-accent/10' : 'bg-muted'}`}>
                <Percent size={16} className={promo.active ? 'text-accent' : 'text-muted-foreground'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-foreground font-arabic truncate">{promo.title}</p>
                  <span className={`text-[10px] font-bold font-arabic px-1.5 py-0.5 rounded-full flex-shrink-0 ${promo.active ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}`}>-{promo.discount}٪</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-arabic mt-0.5 truncate">{promo.product}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground font-arabic">ينتهي {promo.expiry}</span>
                  <span className="text-[10px] text-muted-foreground font-arabic">·</span>
                  <span className="text-[10px] text-muted-foreground font-arabic">استُخدم {promo.usageCount} مرة</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => togglePromo(promo.id)} className="transition-all active:scale-90" title={promo.active ? 'إيقاف العرض' : 'تفعيل العرض'}>
                  {promo.active ? <ToggleRight size={26} className="text-primary" /> : <ToggleLeft size={26} className="text-muted-foreground" />}
                </button>
                <button onClick={() => deletePromo(promo.id)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors active:scale-90">
                  <X size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Modals ── */}
      {kpiModal && <KpiDetailModal {...kpiModal} onClose={() => setKpiModal(null)} />}
      {showDebtModal && <DebtPaymentModal onClose={() => setShowDebtModal(false)} role="supplier" />}
      {showSignOut && <SignOutModal onClose={() => setShowSignOut(false)} onConfirm={handleSignOut} />}
      {showNotifications && <NotificationDrawer onClose={() => setShowNotifications(false)} />}
    </div>
  );
}
