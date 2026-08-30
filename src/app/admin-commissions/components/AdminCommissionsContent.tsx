'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Truck,
  Store,
  Boxes,
  Clock,
  CheckCircle2,
  Wallet,
  Link2,
  ArrowLeftRight,
  Megaphone,
  Inbox,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

// ============================================================
// أنواع البيانات
// ============================================================

type RequesterRole = 'supplier' | 'retailer' | 'delivery';

interface DriverWantedRequest {
  id: string;
  supplierName: string;
  supplierArea: string;
  createdAt: string;
}

interface PartnerWantedRequest {
  id: string;
  driverName: string;
  driverArea: string;
  vehicle: string;
  createdAt: string;
}

interface AddRetailerRequest {
  id: string;
  supplierName: string;
  createdAt: string;
}

interface NearbySupplierRequest {
  id: string;
  retailerName: string;
  retailerArea: string;
  createdAt: string;
}

interface OfferRequest {
  id: string;
  supplierName: string;
  offerTitle: string;
  createdAt: string;
}

type LinkRequestType = 'raise_offer' | 'add_retailer' | 'get_driver' | 'get_nearby_supplier' | 'get_supplier_partner';
type LinkStatus = 'in_progress' | 'completed';

interface ActiveCommission {
  id: string;
  role: RequesterRole;
  type: LinkRequestType;
  partyName: string;
  counterpartName?: string;
  totalCommission: number;
  collected: number;
  status: LinkStatus;
  executedAt: string;
}

const LINK_COMMISSION_DEFAULTS: Record<LinkRequestType, number> = {
  raise_offer: 75000,
  add_retailer: 50000,
  get_driver: 40000,
  get_nearby_supplier: 35000,
  get_supplier_partner: 20000,
};

const roleMeta: Record<RequesterRole, { label: string; icon: React.ElementType; color: string; badge: string }> = {
  supplier: { label: 'جملة / مجهز', icon: Boxes, color: 'text-amber-700 bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-800' },
  retailer: { label: 'محل / سوبرماركت', icon: Store, color: 'text-blue-700 bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-800' },
  delivery: { label: 'توصيل', icon: Truck, color: 'text-emerald-700 bg-emerald-50 border-emerald-200', badge: 'bg-emerald-100 text-emerald-800' },
};

const typeLabel: Record<LinkRequestType, string> = {
  raise_offer: 'طلب رفع عرض',
  add_retailer: 'طلب إضافة عميل (محل/سوبرماركت)',
  get_driver: 'طلب الحصول على سائق توصيل',
  get_nearby_supplier: 'طلب الحصول على مورد قريب',
  get_supplier_partner: 'طلب الارتباط بمجهز',
};

function formatCurrency(n: number) {
  return `${n.toLocaleString('ar-IQ')} د.ع`;
}

// ============================================================
// بيانات تجريبية أولية
// ============================================================
const initialDriverWanted: DriverWantedRequest[] = [
  { id: 'DW-01', supplierName: 'مؤسسة الرافدين للمواد الغذائية', supplierArea: 'الكرخ - بغداد', createdAt: '2026-08-28' },
  { id: 'DW-02', supplierName: 'شركة دجلة للتوزيع بالجملة', supplierArea: 'المنصور - بغداد', createdAt: '2026-08-29' },
];

const initialPartnerWanted: PartnerWantedRequest[] = [
  { id: 'PW-01', driverName: 'أحمد كريم', driverArea: 'الكرخ - بغداد', vehicle: 'دفع رباعي صغير', createdAt: '2026-08-28' },
  { id: 'PW-02', driverName: 'سجاد علي', driverArea: 'الرصافة - بغداد', vehicle: 'دراجة نارية', createdAt: '2026-08-30' },
];

const initialAddRetailer: AddRetailerRequest[] = [
  { id: 'AR-01', supplierName: 'مؤسسة الرافدين للمواد الغذائية', createdAt: '2026-08-27' },
];

const initialNearbySupplier: NearbySupplierRequest[] = [
  { id: 'NS-01', retailerName: 'سوبرماركت النخبة - الكرادة', retailerArea: 'الكرادة - بغداد', createdAt: '2026-08-25' },
];

const initialOffers: OfferRequest[] = [
  { id: 'OF-01', supplierName: 'شركة دجلة للتوزيع بالجملة', offerTitle: 'خصم 10% على مواد التنظيف بالجملة', createdAt: '2026-08-26' },
];

const initialActiveCommissions: ActiveCommission[] = [
  { id: 'AC-01', role: 'supplier', type: 'add_retailer', partyName: 'شركة دجلة للتوزيع بالجملة', counterpartName: 'محل بغداد للمواد الغذائية', totalCommission: 50000, collected: 50000, status: 'completed', executedAt: '2026-08-05' },
  { id: 'AC-02', role: 'delivery', type: 'get_supplier_partner', partyName: 'أحمد كريم', counterpartName: 'مؤسسة الرافدين للمواد الغذائية', totalCommission: 20000, collected: 20000, status: 'completed', executedAt: '2026-07-28' },
];

// ============================================================
// المكوّن الرئيسي
// ============================================================
export default function AdminCommissionsContent() {
  const [driverWanted, setDriverWanted] = useState(initialDriverWanted);
  const [partnerWanted, setPartnerWanted] = useState(initialPartnerWanted);
  const [addRetailer, setAddRetailer] = useState(initialAddRetailer);
  const [nearbySupplier, setNearbySupplier] = useState(initialNearbySupplier);
  const [offers, setOffers] = useState(initialOffers);
  const [activeCommissions, setActiveCommissions] = useState<ActiveCommission[]>(initialActiveCommissions);

  const [selectedDriverReq, setSelectedDriverReq] = useState<string>('');
  const [selectedPartnerReq, setSelectedPartnerReq] = useState<string>('');
  const [selectedAddRetailerReq, setSelectedAddRetailerReq] = useState<string>('');
  const [selectedNearbySupplierReq, setSelectedNearbySupplierReq] = useState<string>('');

  const executeDriverMatch = () => {
    const supplierReq = driverWanted.find((r) => r.id === selectedDriverReq);
    const driverReq = partnerWanted.find((r) => r.id === selectedPartnerReq);
    if (!supplierReq || !driverReq) return;

    const now = new Date().toISOString().slice(0, 10);
    setActiveCommissions((prev) => [
      {
        id: `AC-${Date.now()}-S`,
        role: 'supplier',
        type: 'get_driver',
        partyName: supplierReq.supplierName,
        counterpartName: driverReq.driverName,
        totalCommission: LINK_COMMISSION_DEFAULTS.get_driver,
        collected: 0,
        status: 'in_progress',
        executedAt: now,
      },
      {
        id: `AC-${Date.now()}-D`,
        role: 'delivery',
        type: 'get_supplier_partner',
        partyName: driverReq.driverName,
        counterpartName: supplierReq.supplierName,
        totalCommission: LINK_COMMISSION_DEFAULTS.get_supplier_partner,
        collected: 0,
        status: 'in_progress',
        executedAt: now,
      },
      ...prev,
    ]);

    setDriverWanted((prev) => prev.filter((r) => r.id !== supplierReq.id));
    setPartnerWanted((prev) => prev.filter((r) => r.id !== driverReq.id));
    setSelectedDriverReq('');
    setSelectedPartnerReq('');
  };

  const executeRetailerMatch = () => {
    const supplierReq = addRetailer.find((r) => r.id === selectedAddRetailerReq);
    const retailerReq = nearbySupplier.find((r) => r.id === selectedNearbySupplierReq);
    if (!supplierReq || !retailerReq) return;

    const now = new Date().toISOString().slice(0, 10);
    setActiveCommissions((prev) => [
      {
        id: `AC-${Date.now()}-AR`,
        role: 'supplier',
        type: 'add_retailer',
        partyName: supplierReq.supplierName,
        counterpartName: retailerReq.retailerName,
        totalCommission: LINK_COMMISSION_DEFAULTS.add_retailer,
        collected: 0,
        status: 'in_progress',
        executedAt: now,
      },
      {
        id: `AC-${Date.now()}-NS`,
        role: 'retailer',
        type: 'get_nearby_supplier',
        partyName: retailerReq.retailerName,
        counterpartName: supplierReq.supplierName,
        totalCommission: LINK_COMMISSION_DEFAULTS.get_nearby_supplier,
        collected: 0,
        status: 'in_progress',
        executedAt: now,
      },
      ...prev,
    ]);

    setAddRetailer((prev) => prev.filter((r) => r.id !== supplierReq.id));
    setNearbySupplier((prev) => prev.filter((r) => r.id !== retailerReq.id));
    setSelectedAddRetailerReq('');
    setSelectedNearbySupplierReq('');
  };

  const approveOffer = (id: string) => {
    const req = offers.find((r) => r.id === id);
    if (!req) return;
    const now = new Date().toISOString().slice(0, 10);
    setActiveCommissions((prev) => [
      {
        id: `AC-${Date.now()}-OF`,
        role: 'supplier',
        type: 'raise_offer',
        partyName: req.supplierName,
        totalCommission: LINK_COMMISSION_DEFAULTS.raise_offer,
        collected: 0,
        status: 'in_progress',
        executedAt: now,
      },
      ...prev,
    ]);
    setOffers((prev) => prev.filter((r) => r.id !== id));
  };

  const pendingCount = driverWanted.length + partnerWanted.length + addRetailer.length + nearbySupplier.length + offers.length;
  const totalCollected = activeCommissions.reduce((acc, c) => acc + c.collected, 0);
  const totalPending = activeCommissions.reduce((acc, c) => acc + (c.totalCommission - c.collected), 0);

  return (
    <main dir="rtl" className="min-h-screen bg-slate-900/5 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* الهيدر الرئيسي */}
        <header className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-blue-600" />
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> لوحة تحكم الإدارة المركزية
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">إدارة طلبات الربط والعمولات</h1>
            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
              إدارة مطابقة طلبات الجملة، المحلات، والتوصيل. تنفيذ الربط يوثق العلاقة التجارية ويفعّل خطط استقطاع العمولات تلقائياً.
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
            <Wallet className="w-6 h-6" />
          </div>
        </header>

        {/* بطاقات الملخص الإحصائي */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard 
            icon={Inbox} 
            label="طلبات بانتظار المطابقة والتنفيذ" 
            value={String(pendingCount)} 
            tone="text-amber-600 bg-amber-50/80 border-amber-100" 
          />
          <SummaryCard 
            icon={TrendingUp} 
            label="إجمالي العمولات قيد الاستقطاع" 
            value={formatCurrency(totalPending)} 
            tone="text-blue-600 bg-blue-50/80 border-blue-100" 
          />
          <SummaryCard 
            icon={Wallet} 
            label="إجمالي العمولات المحصّلة فعلياً" 
            value={formatCurrency(totalCollected)} 
            tone="text-emerald-600 bg-emerald-50/80 border-emerald-100" 
          />
        </div>

        {/* قسم المطابقة الأولى: التوصيل والمجهز */}
        <MatchSection
          icon={Truck}
          iconColor="text-emerald-600 bg-emerald-50"
          title="مطابقة خدمات النقل والتوصيل"
          subtitle="ربط طلبات الجملة التي تحتاج سائقاً مع طلبات السائقين الراغبين بالارتباط بمجهزين"
          leftLabel="طلبات مجهزي الجملة (يبحثون عن سائق)"
          rightLabel="طلبات السائقين (يبحثون عن مجهز)"
          leftItems={driverWanted.map((r) => ({ id: r.id, primary: r.supplierName, secondary: r.supplierArea }))}
          rightItems={partnerWanted.map((r) => ({ id: r.id, primary: r.driverName, secondary: `${r.driverArea} · ${r.vehicle}` }))}
          selectedLeft={selectedDriverReq}
          selectedRight={selectedPartnerReq}
          onSelectLeft={setSelectedDriverReq}
          onSelectRight={setSelectedPartnerReq}
          onExecute={executeDriverMatch}
          commissionNote={`عمولة الربط: ${formatCurrency(LINK_COMMISSION_DEFAULTS.get_driver)} (جملة) + ${formatCurrency(LINK_COMMISSION_DEFAULTS.get_supplier_partner)} (سائق)`}
        />

        {/* قسم المطابقة الثانية: المتاجر والموردين */}
        <MatchSection
          icon={Store}
          iconColor="text-blue-600 bg-blue-50"
          title="مطابقة شبكة التوزيع والمتاجر"
          subtitle="ربط طلبات المجهزين لإضافة عملاء جدد مع طلبات المحلات والسوبرماركت للبحث عن موردين قريبين"
          leftLabel="طلبات مجهزي الجملة (إضافة عميل جديد)"
          rightLabel="طلبات المحلات (البحث عن مورد قريب)"
          leftItems={addRetailer.map((r) => ({ id: r.id, primary: r.supplierName, secondary: '' }))}
          rightItems={nearbySupplier.map((r) => ({ id: r.id, primary: r.retailerName, secondary: r.retailerArea }))}
          selectedLeft={selectedAddRetailerReq}
          selectedRight={selectedNearbySupplierReq}
          onSelectLeft={setSelectedAddRetailerReq}
          onSelectRight={setSelectedNearbySupplierReq}
          onExecute={executeRetailerMatch}
          commissionNote={`عمولة الربط: ${formatCurrency(LINK_COMMISSION_DEFAULTS.add_retailer)} (جملة) + ${formatCurrency(LINK_COMMISSION_DEFAULTS.get_nearby_supplier)} (محل)`}
        />

        {/* قسم طلبات رفع العروض */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">طلبات رفع العروض والتخفيضات</h2>
                <p className="text-xs text-slate-500 mt-0.5">طلبات مستقلة لا تتطلب طرفاً مقابلاً — موافقة الإدارة تنشط العرض وتفعّل العمولة.</p>
              </div>
            </div>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
              {offers.length} بانتظار الاعتماد
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {offers.map((o) => (
              <div key={o.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    <Sparkles className="w-3 h-3" /> {o.supplierName}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{o.offerTitle}</h3>
                  <span className="text-xs text-slate-400">تاريخ الطلب: {o.createdAt}</span>
                </div>
                <button
                  onClick={() => approveOffer(o.id)}
                  className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-600/20 flex items-center gap-2 shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  موافقة وتنفيذ العرض
                </button>
              </div>
            ))}
            {offers.length === 0 && (
              <div className="p-12 text-center text-sm text-slate-400 flex flex-col items-center justify-center gap-2">
                <Inbox className="w-8 h-8 text-slate-300" />
                لا توجد طلبات رفع عروض بانتظار الموافقة حالياً.
              </div>
            )}
          </div>
        </section>

        {/* قسم العمولات النشطة */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
           سجل العمولات النشطة والمحصلة 
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">سجل العمولات النشطة</h2>
              <p className="text-xs text-slate-500 mt-0.5">متابعة تحصيل العمولات تدريجياً عبر الأنشطة اليومية للأطراف المرتبطة.</p>
            </div>
            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto">
              إجمالي السجلات: {activeCommissions.length}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {activeCommissions.map((c) => {
              const meta = roleMeta[c.role];
              const RoleIcon = meta.icon;
              const progress = c.totalCommission === 0 ? 0 : Math.round((c.collected / c.totalCommission) * 100);
              const isCompleted = c.status === 'completed' || progress === 100;

              return (
                <div key={c.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${meta.color}`}>
                      <RoleIcon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold ${meta.badge}`}>{meta.label}</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{typeLabel[c.type]}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400">تاريخ التنفيذ: {c.executedAt}</span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 flex-wrap">
                        {c.partyName}
                        {c.counterpartName && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                            <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" /> مع: {c.counterpartName}
                          </span>
                        )}
                      </h3>
                      
                      {/* شريط التقدم */}
                      <div className="flex items-center gap-3 pt-1">
                        <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                            style={{ width: `${progress}%` }} 
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-600">{progress}% محصّل</span>
                        {isCompleted && (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> مكتمل
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex lg:flex-col items-center lg:items-end justify-between gap-1 shrink-0">
                    <div className="text-xs text-slate-400">إجمالي العمولة المستهدفة</div>
                    <div className="text-base font-black text-slate-900">{formatCurrency(c.totalCommission)}</div>
                    <div className="text-xs text-emerald-600 font-bold mt-0.5">المحصل: {formatCurrency(c.collected)}</div>
                  </div>
                </div>
              );
            })}
            {activeCommissions.
