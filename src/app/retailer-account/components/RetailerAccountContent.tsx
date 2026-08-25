'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { User, Phone, Mail, Save, CheckCircle, MapPin, Plus, CreditCard, Building2, Shield, LogOut, Store, Wallet, ChevronDown, ChevronUp, Banknote, ArrowUpRight, ReceiptText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { CURRENCY } from '@/lib/commissionStore';
import { financialService, type LedgerEntry } from '@/lib/services/financialService';
import { supplierService, type Supplier } from '@/lib/services/supplierService';

// ─── Interfaces & Types ───────────────────────────────────────────────────────
interface Address {
  id: string;
  label: string;
  city: string;
  district: string;
  street: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  label: string;
  last4?: string;
  bank?: string;
  isDefault: boolean;
}

interface SupplierCredit {
  id: string;
  name: string;
  region: string;
  creditLimit: number;
  creditUsed: number;
  pendingDebt: number;
  dueDays: number;
  status: 'good' | 'warning' | 'overdue';
}

interface PaymentRecord extends LedgerEntry {
  balance: number;
}

type MainTab = 'profile' | 'addresses' | 'payments' | 'suppliers' | 'ledger' | 'settings';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => `${n.toLocaleString('ar-IQ')} ${CURRENCY}`;

const statusConfig = {
  good: { label: 'جيد', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  warning: { label: 'تحذير', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
  overdue: { label: 'متأخر', color: 'text-red-600', bg: 'bg-red-50 border-red-200', dot: 'bg-red-500' },
};

const txnTypeConfig = {
  order: { label: 'طلب', icon: ReceiptText, color: 'text-blue-600', bg: 'bg-blue-50' },
  payment: { label: 'دفعة', icon: Banknote, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  adjustment: { label: 'تسوية', icon: ArrowUpRight, color: 'text-purple-600', bg: 'bg-purple-50' },
};

const initialAddresses: Address[] = [
  { id: 'addr-1', label: 'المتجر الرئيسي', city: 'بغداد', district: 'الكرادة', street: 'شارع أبو نواس، بناية 14', isDefault: true },
  { id: 'addr-2', label: 'المستودع', city: 'بغداد', district: 'الشعب', street: 'شارع المصنع، مجمع 7', isDefault: false },
];

const initialPayments: PaymentMethod[] = [
  { id: 'pay-1', type: 'card', label: 'Visa', last4: '4242', isDefault: true },
  { id: 'pay-2', type: 'bank', label: 'مصرف الرافدين', bank: 'حساب جاري', isDefault: false },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
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
            <p className="font-arabic text-sm text-muted-foreground mt-1">هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 bg-muted text-foreground rounded-xl py-3 font-arabic font-semibold text-sm hover:bg-muted/80 transition-all">إلغاء</button>
            <button onClick={onConfirm} className="flex-1 bg-red-500 text-white rounded-xl py-3 font-arabic font-semibold text-sm hover:bg-red-600 transition-all">تسجيل الخروج</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreditBar({ used, limit }: { used: number; limit: number }) {
  const pct = Math.min((used / limit) * 100, 100);
  const color = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div className={`h-2 rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function SupplierCreditCard({ supplier }: { supplier: SupplierCredit }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[supplier.status];
  const available = supplier.creditLimit - supplier.creditUsed;
  const usedPct = Math.round((supplier.creditUsed / supplier.creditLimit) * 100);

  return (
    <div className={`bg-card border rounded-xl overflow-hidden transition-all duration-200 ${supplier.status === 'overdue' ? 'border-red-200' : supplier.status === 'warning' ? 'border-amber-200' : 'border-border'}`}>
      <button onClick={() => setExpanded((v) => !v)} className="w-full flex items-center gap-3 p-4 text-right hover:bg-muted/40 transition-colors">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Building2 size={18} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0 text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="font-arabic font-semibold text-foreground text-sm">{supplier.name}</span>
            <span className={`inline-flex items-center gap-1 text-xs font-arabic px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">{supplier.region}</p>
        </div>
        <div className="text-left flex-shrink-0">
          <p className="text-xs text-muted-foreground font-arabic">المتاح</p>
          <p className={`font-bold text-sm tabular-nums ${available <= 0 ? 'text-red-600' : 'text-emerald-600'}`}>{fmt(available)}</p>
        </div>
        <div className="text-muted-foreground flex-shrink-0">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>
      <div className="px-4 pb-3">
        <div className="flex justify-between text-xs text-muted-foreground font-arabic mb-1">
          <span className="tabular-nums">{usedPct}% مستخدم</span>
          <span className="tabular-nums">الحد: {fmt(supplier.creditLimit)}</span>
        </div>
        <CreditBar used={supplier.creditUsed} limit={supplier.creditLimit} />
      </div>
      {expanded && (
        <div className="border-t border-border bg-muted/20 px-4 py-3 grid grid-cols-2 gap-3">
          <div className="bg-card rounded-lg p-3 border border-border">
            <p className="text-xs text-muted-foreground font-arabic mb-1">الحد الائتماني</p>
            <p className="font-bold text-foreground tabular-nums text-sm">{fmt(supplier.creditLimit)}</p>
          </div>
          <div className="bg-card rounded-lg p-3 border border-border">
            <p className="text-xs text-muted-foreground font-arabic mb-1">المستخدم</p>
            <p className="font-bold text-foreground tabular-nums text-sm">{fmt(supplier.creditUsed)}</p>
          </div>
          <div className={`rounded-lg p-3 border ${supplier.pendingDebt > 0 ? 'bg-red-50 border-red-200' : 'bg-card border-border'}`}>
            <p className="text-xs text-muted-foreground font-arabic mb-1">الديون المعلقة</p>
            <p className={`font-bold tabular-nums text-sm ${supplier.pendingDebt > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {supplier.pendingDebt > 0 ? fmt(supplier.pendingDebt) : 'لا يوجد'}
            </p>
          </div>
          <div className={`rounded-lg p-3 border ${supplier.dueDays < 0 ? 'bg-red-50 border-red-200' : supplier.dueDays <= 3 ? 'bg-amber-50 border-amber-200' : 'bg-card border-border'}`}>
            <p className="text-xs text-muted-foreground font-arabic mb-1">موعد الاستحقاق</p>
            <p className={`font-bold text-sm font-arabic ${supplier.dueDays < 0 ? 'text-red-600' : supplier.dueDays <= 3 ? 'text-amber-600' : 'text-foreground'}`}>
              {supplier.dueDays < 0 ? `متأخر ${Math.abs(supplier.dueDays)} أيام` : supplier.dueDays === 0 ? 'اليوم' : `خلال ${supplier.dueDays} أيام`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function TransactionRow({ txn }: { txn: PaymentRecord }) {
  const typeCfg = txnTypeConfig[txn.entryType];
  const TxnIcon = typeCfg.icon;
  const isDebit = txn.direction === 'debit';
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${typeCfg.bg}`}>
        <TxnIcon size={16} className={typeCfg.color} />
      </div>
      <div className="flex-1 min-w-0 text-right">
        <p className="font-arabic text-sm font-medium text-foreground truncate">{txn.description}</p>
        <div className="flex items-center gap-2 mt-0.5 justify-end">
          <span className="text-xs text-muted-foreground font-arabic">{txn.supplierName}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground tabular-nums">{txn.entryDate}</span>
          {txn.status === 'overdue' && <span className="text-xs text-red-600 font-arabic bg-red-50 px-1.5 py-0.5 rounded-full">متأخر</span>}
        </div>
      </div>
      <div className="text-left flex-shrink-0">
        <p className={`font-bold tabular-nums text-sm ${isDebit ? 'text-red-600' : 'text-emerald-600'}`}>
          {isDebit ? '-' : '+'}{fmt(txn.amount)}
        </p>
      </div>
    </div>
  );
}

// ─── Main Integrated Component ────────────────────────────────────────────────
export default function RetailerAccountContent() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MainTab>('profile');
  const [saved, setSaved] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);

  // Profile States
  const [profile, setProfile] = useState({
    storeName: 'متجر الجبوري للمواد الغذائية',
    ownerName: 'أحمد الجبوري',
    phone: '07701234567',
    email: 'ahmed@jabouri-store.iq',
    city: 'بغداد',
    category: 'مواد الغذائية',
  });

  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', city: '', district: '', street: '' });
  const [payments, setPayments] = useState<PaymentMethod[]>(initialPayments);

  // Ledger & Financial States
  const [ledgerEntries, setLedgerEntries] = useState<PaymentRecord[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingLedger, setLoadingLedger] = useState(true);
  const [filterSupplier, setFilterSupplier] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [ledgerSubTab, setLedgerSubTab] = useState<'overview' | 'history'>('overview');

  const loadLedgerData = useCallback(async () => {
    try {
      const [entries, sups] = await Promise.all([
        financialService.getLedgerEntries(),
        supplierService.getAll(),
      ]);
      setLedgerEntries(entries.map((e) => ({ ...e, balance: 0 })));
      setSuppliers(sups);
    } catch {
      // silent fallback
    } finally {
      setLoadingLedger(false);
    }
  }, []);

  useEffect(() => {
    loadLedgerData();
  }, [loadLedgerData]);

  const supplierCredits: SupplierCredit[] = suppliers.map((s) => ({
    id: s.id,
    name: s.name,
    region: s.region,
    creditLimit: s.creditLimit,
    creditUsed: s.creditUsed,
    pendingDebt: s.pendingDebt,
    dueDays: s.dueDays,
    status: s.creditStatus,
  }));

  const totalDebt = supplierCredits.reduce((s, c) => s + c.pendingDebt, 0);
  const totalCreditLimit = supplierCredits.reduce((s, c) => s + c.creditLimit, 0);
  const totalCreditUsed = supplierCredits.reduce((s, c) => s + c.creditUsed, 0);
  const totalAvailable = totalCreditLimit - totalCreditUsed;
  const overdueCount = supplierCredits.filter((c) => c.status === 'overdue').length;
  const totalPaid = ledgerEntries.filter((t) => t.direction === 'credit').reduce((s, t) => s + t.amount, 0);

  const filteredHistory = ledgerEntries.filter((t) => {
    const matchSupplier = filterSupplier === 'all' || t.supplierId === filterSupplier;
    const matchType = filterType === 'all' || t.entryType === filterType;
    return matchSupplier && matchType;
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSignOut = async () => {
    setShowSignOut(false);
    try { await signOut(); } catch { /* silent */ }
    router.push('/sign-up-login');
  };

  const mainTabs: { id: MainTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'profile', label: 'الملف التجاري', icon: Building2 },
    { id: 'addresses', label: 'عناوين التوصيل', icon: MapPin },
    { id: 'payments', label: 'طرق الدفع', icon: CreditCard },
    { id: 'suppliers', label: 'أقرب المجهزين', icon: Store },
    { id: 'ledger', label: 'كشف الحساب والديون', icon: Wallet, badge: totalDebt > 0 ? totalDebt : undefined },
    { id: 'settings', label: 'إعدادات الحساب', icon: Shield },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12" dir="rtl">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3 bg-card border border-border p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground font-arabic">حسابي (محل التجزئة)</h1>
            <p className="text-xs text-muted-foreground font-arabic mt-0.5">إدارة متجرك، الائتمان المالي، وعناوين التوصيل بكل سهولة</p>
          </div>
        </div>
        <button
          onClick={() => setShowSignOut(true)}
          className="flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-arabic font-semibold px-3.5 py-2 rounded-xl hover:bg-red-100 transition-all"
        >
          <LogOut size={14} />
          تسجيل الخروج
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 bg-muted/40 border border-border rounded-2xl p-1.5">
        {mainTabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-arabic font-semibold transition-all relative ${
                isActive
                  ? 'bg-card text-accent shadow-sm border border-border scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
              }`}
            >
              <TabIcon size={18} />
              <span className="truncate">{tab.label}</span>
              {tab.id === 'ledger' && totalDebt > 0 && (
                <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* ─── 1. Profile Tab ──────────────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building2 size={16} className="text-blue-600" />
            </div>
            <h2 className="text-base font-bold text-foreground font-arabic">معلومات المتجر الأساسية</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'اسم المتجر', key: 'storeName', icon: Building2, type: 'text' },
              { label: 'اسم المالك', key: 'ownerName', icon: User, type: 'text' },
              { label: 'رقم الهاتف', key: 'phone', icon: Phone, type: 'tel' },
              { label: 'البريد الإلكتروني', key: 'email', icon: Mail, type: 'email' },
              { label: 'المدينة', key: 'city', icon: MapPin, type: 'text' },
              { label: 'فئة المتجر', key: 'category', icon: Store, type: 'text' },
            ].map((field) => {
              const FieldIcon = field.icon;
              return (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-muted-foreground font-arabic mb-1.5">{field.label}</label>
                  <div className="relative">
                    <FieldIcon size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={field.type}
                      value={profile[field.key as keyof typeof profile]}
                      onChange={(e) => setProfile((p) => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full pr-9 pl-4 py-2.5 border border-border rounded-xl text-sm font-arabic bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-arabic font-semibold transition-all ${
              saved ? 'bg-emerald-500 text-white' : 'bg-accent text-white hover:bg-accent/90'
            }`}
          >
            {saved ? <CheckCircle size={16} /> : <Save size={16} />}
            {saved ? 'تم الحفظ بنجاح' : 'حفظ التغييرات'}
          </button>
        </div>
      )}

      {/* ─── 2. Addresses Tab ────────────────────────────────────────────── */}
      {activeTab === 'addresses' && (
        <div className="space-y-4 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <MapPin size={16} className="text-orange-600" />
              </div>
              <h2 className="text-base font-bold text-foreground font-arabic">عناوين التوصيل المسجلة</h2>
            </div>
            <button
              onClick={() => setShowAddressForm(true)}
              className="flex items-center gap-1.5 bg-accent text-white text-xs font-arabic font-semibold px-4 py-2.5 rounded-xl hover:bg-accent/90 transition-colors"
            >
              <Plus size={15} />
              إضافة عنوان
            </button>
          </div>

          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr.id} className={`border rounded-xl p-4 flex items-start gap-4 ${addr.isDefault ? 'border-accent/40 bg-accent/5' : 'border-border'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${addr.isDefault ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'}`}>
                  <MapPin size={18} />
                </div>
                <div className="flex-1 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="font-arabic font-semibold text-foreground text-sm">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-xs bg-accent/10 text-accent font-arabic px-2 py-0.5 rounded-full">افتراضي</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-arabic mt-1">{addr.city} - {addr.district}</p>
                  <p className="text-xs text-muted-foreground font-arabic">{addr.street}</p>
                </div>
                {!addr.isDefault && (
                  <button
                    onClick={() => setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === addr.id })))}
                    className="text-xs text-accent font-arabic hover:underline flex-shrink-0"
                  >
                    تعيين افتراضي
                  </button>
                )}
              </div>
            ))}
          </div>

          {showAddressForm && (
            <div className="border border-dashed border-accent/40 rounded-xl p-4 space-y-3 bg-accent/5">
              <h3 className="font-arabic font-semibold text-foreground text-sm">إضافة عنوان جديد</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: 'تسمية العنوان', key: 'label', placeholder: 'مثال: المتجر الفرعي' },
                  { label: 'المدينة', key: 'city', placeholder: 'بغداد' },
                  { label: 'الحي / المنطقة', key: 'district', placeholder: 'الكرادة' },
                  { label: 'الشارع والتفاصيل', key: 'street', placeholder: 'شارع ...' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs text-muted-foreground font-arabic mb-1">{f.label}</label>
                    <input
                      type="text"
                      placeholder={f.placeholder}
                      value={newAddress[f.key as keyof typeof newAddress]}
                      onChange={(e) => setNewAddress((p) => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm font-arabic bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (newAddress.label && newAddress.city) {
                      setAddresses((prev) => [...prev, { id: `addr-${Date.now()}`, ...newAddress, isDefault: false }]);
                      setNewAddress({ label: '', city: '', district: '', street: '' });
                      setShowAddressForm(false);
                    }
                  }}
                  className="bg-accent text-white text-sm font-arabic font-semibold px-5 py-2.5 rounded-xl hover:bg-accent/90 transition-colors"
                >
                  حفظ العنوان
                </button>
                <button
                  onClick={() => setShowAddressForm(false)}
                  className="bg-muted text-foreground text-sm font-arabic px-5 py-2.5 rounded-xl hover:bg-muted/80 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── 3. Payments Tab ─────────────────────────────────────────────── */}
      {activeTab === 'payments' && (
        <div className="space-y-4 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <CreditCard size={16} className="text-purple-600" />
            </div>
            <h2 className="text-base font-bold text-foreground font-arabic">طرق الدفع المسجلة</h2>
          </div>
          <div className="space-y-3">
            {payments.map((pm) => (
              <div key={pm.id} className={`border rounded-xl p-4 flex items-center gap-4 ${pm.isDefault ? 'border-accent/40 bg-accent/5' : 'border-border'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${pm.isDefault ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'}`}>
                  {pm.type === 'card' ? <CreditCard size={18} /> : <Building2 size={18} />}
                </div>
                <div className="flex-1 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="font-arabic font-semibold text-foreground text-sm">{pm.label}</span>
                    {pm.isDefault && <span className="text-xs bg-accent/10 text-accent font-arabic px-2 py-0.5 rounded-full">افتراضي</span>}
                  </div>
                  <p className="text-xs text-muted-foreground font-arabic mt-0.5">
                    {pm.type === 'card' ? `**** **** **** ${pm.last4}` : pm.bank}
                  </p>
                </div>
                {!pm.isDefault && (
                  <button
                    onClick={() => setPayments((prev) => prev.map((p) => ({ ...p, isDefault: p.id === pm.id })))}
                    className="text-xs text-accent font-arabic hover:underline flex-shrink-0"
                  >
                    تعيين افتراضي
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 4. Suppliers Tab ────────────────────────────────────────────── */}
      {activeTab === 'suppliers' && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Store size={16} className="text-green-600" />
            </div>
            <h2 className="text-base font-bold text-foreground font-arabic">الموردون المرتبطون</h2>
          </div>
          <div className="space-y-3">
            {supplierCredits.length === 0 ? (
              <div className="py-10 text-center">
                <Store size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="font-arabic text-muted-foreground text-sm">لا يوجد موردون مرتبطون</p>
              </div>
            ) : (
              supplierCredits.map((s) => (
                <SupplierCreditCard key={s.id} supplier={s} />
              ))
            )}
          </div>
        </div>
      )}

      {/* ─── 5. Ledger Tab ───────────────────────────────────────────────── */}
      {activeTab === 'ledger' && (
        <div className="space-y-5">
          {loadingLedger ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* KPI row */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className={`rounded-xl border p-4 ${totalDebt > 0 ? 'bg-red-50 border-red-200' : 'bg-card border-border'}`}>
                  <p className="text-xs text-muted-foreground font-arabic mb-1">إجمالي الديون</p>
                  <p className={`font-bold tabular-nums text-lg ${totalDebt > 0 ? 'text-red-600' : 'text-foreground'}`}>{fmt(totalDebt)}</p>
                  {overdueCount > 0 && <p className="text-xs text-red-500 font-arabic mt-1">{overdueCount} موردين متأخرين</p>}
                </div>
                <div className="rounded-xl border bg-emerald-50 border-emerald-200 p-4">
                  <p className="text-xs text-muted-foreground font-arabic mb-1">الرصيد المتاح</p>
                  <p className="font-bold tabular-nums text-lg text-emerald-600">{fmt(totalAvailable)}</p>
                  <p className="text-xs text-muted-foreground font-arabic mt-1">من أصل {fmt(totalCreditLimit)}</p>
                </div>
                <div className="rounded-xl border bg-card border-border p-4">
                  <p className="text-xs text-muted-foreground font-arabic mb-1">الائتمان المستخدم</p>
                  <p className="font-bold tabular-nums text-lg text-foreground">{fmt(totalCreditUsed)}</p>
                  <p className="text-xs text-muted-foreground font-arabic mt-1">
                    {totalCreditLimit > 0 ? Math.round((totalCreditUsed / totalCreditLimit) * 100) : 0}% من الحد
                  </p>
                </div>
                <div className="rounded-xl border bg-card border-border p-4">
                  <p className="text-xs text-muted-foreground font-arabic mb-1">الموردون</p>
                  <p className="font-bold tabular-nums text-lg text-foreground">{supplierCredits.length}</p>
                  <p className="text-xs text-muted-foreground font-arabic mt-1">
                    {supplierCredits.filter((c) => c.status === 'good').length} بحالة جيدة
                  </p>
                </div>
              </div>

              {/* Sub-tabs */}
              <div className="flex gap-1 bg-muted rounded-xl p-1">
                {[
                  { key: 'overview', label: 'الحدود الائتمانية', icon: CreditCard },
                  { key: 'history', label: 'سجل المعاملات', icon: Wallet },
                ].map(({ key, label, icon: TabIcon }) => (
                  <button key={key} onClick={() => setLedgerSubTab(key as 'overview' | 'history')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-arabic font-medium transition-all duration-150 ${ledgerSubTab === key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                    {React.createElement(TabIcon, { size: 15 })}
                    {label}
                  </button>
                ))}
              </div>

              {ledgerSubTab === 'overview' && (
                <div className="space-y-3">
                  {supplierCredits.map((s) => (
                    <SupplierCreditCard key={s.id} supplier={s} />
                  ))}
                </div>
              )}

              {ledgerSubTab === 'history' && (
                <div className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                      <Building2 size={14} className="text-muted-foreground" />
                      <select value={filterSupplier} onChange={(e) => setFilterSupplier(e.target.value)}
                        className="text-sm font-arabic bg-transparent text-foreground outline-none cursor-pointer">
                        <option value="all">كل الموردين</option>
                        {supplierCredits.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                      <Wallet size={14} className="text-muted-foreground" />
                      <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                        className="text-sm font-arabic bg-transparent text-foreground outline-none cursor-pointer">
                        <option value="all">كل العمليات</option>
                        <option value="order">طلبات</option>
                        <option value="payment">دفعات</option>
                        <option value="adjustment">تسويات</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl px-4 divide-y divide-border">
                    {filteredHistory.length === 0 ? (
                      <div className="py-10 text-center">
                        <ReceiptText size={32} className="text-muted-foreground mx-auto mb-2" />
                        <p className="font-arabic text-muted-foreground text-sm">لا توجد معاملات</p>
                      </div>
                    ) : (
                      filteredHistory.map((txn) => <TransactionRow key={txn.id} txn={txn} />)
                    )}
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-arabic">إجمالي الرصيد المستحق</p>
                      <p className="font-bold text-red-600 tabular-nums text-lg">{fmt(totalDebt)}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground font-arabic">إجمالي المدفوع</p>
                      <p className="font-bold text-emerald-600 tabular-nums text-lg">{fmt(totalPaid)}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ─── 6. Settings Tab ─────────────────────────────────────────────── */}
      {activeTab === 'settings' && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <Shield size={16} className="text-gray-600" />
            </div>
            <h2 className="text-base font-bold text-foreground font-arabic">إعدادات الحساب والأمان</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-border rounded-xl">
              <button className="text-sm font-arabic text-accent hover:underline">تغيير كلمة المرور</button>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-muted-foreground" />
                <span className="text-sm font-arabic text-foreground">كلمة المرور</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-xl">
              <button
                onClick={() => setShowSignOut(true)}
                className="text-sm font-arabic text-red-600 hover:underline flex items-center gap-1.5"
              >
                <LogOut size={14} />
                تسجيل الخروج من الحساب
              </button>
              <span className="text-sm font-arabic text-red-700 font-semibold">تسجيل الخروج</span>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Modal */}
      {showSignOut && (
        <SignOutModal onClose={() => setShowSignOut(false)} onConfirm={handleSignOut} />
      )}
    </div>
  );
}
