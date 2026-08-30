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
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


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

const roleMeta: Record<RequesterRole, { label: string; icon: React.ElementType; color: string }> = {
  supplier: { label: 'جملة / مجهز', icon: Boxes, color: 'text-amber-600 bg-amber-50' },
  retailer: { label: 'محل / سوبرماركت', icon: Store, color: 'text-blue-600 bg-blue-50' },
  delivery: { label: 'توصيل', icon: Truck, color: 'text-emerald-600 bg-emerald-50' },
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
// بيانات تجريبية أولية (تُستبدل لاحقاً بربط Supabase)
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
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">

        <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">تنفيذ طلبات الربط والعمولات</h1>
            <p className="text-sm text-gray-500 mt-1">
              استقبال طلبات الجملة والمحل والتوصيل، ومطابقتها/تنفيذها من هنا. تنفيذ الربط هو اللحظة التي تُفعَّل بها عمولة كل طرف.
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard icon={Inbox} label="طلبات بانتظار التنفيذ" value={String(pendingCount)} tone="text-amber-600 bg-amber-50" />
          <SummaryCard icon={TrendingUp} label="عمولات قيد الاستقطاع" value={formatCurrency(totalPending)} tone="text-blue-600 bg-blue-50" />
          <SummaryCard icon={Wallet} label="إجمالي العمولات المحصّلة" value={formatCurrency(totalCollected)} tone="text-emerald-600 bg-emerald-50" />
        </div>

        <MatchSection
          icon={Truck}
          title="مطابقة: طلب سائق توصيل (من الجملة) ⇄ طلب ارتباط بمجهز (من السائق)"
          leftLabel="طلبات الجملة (تريد سائقاً)"
          rightLabel="طلبات السائقين (يريدون مجهزاً)"
          leftItems={driverWanted.map((r) => ({ id: r.id, primary: r.supplierName, secondary: r.supplierArea }))}
          rightItems={partnerWanted.map((r) => ({ id: r.id, primary: r.driverName, secondary: `${r.driverArea} · ${r.vehicle}` }))}
          selectedLeft={selectedDriverReq}
          selectedRight={selectedPartnerReq}
          onSelectLeft={setSelectedDriverReq}
          onSelectRight={setSelectedPartnerReq}
          onExecute={executeDriverMatch}
          commissionNote={`عند التنفيذ: عمولة ${formatCurrency(LINK_COMMISSION_DEFAULTS.get_driver)} على الجملة + ${formatCurrency(LINK_COMMISSION_DEFAULTS.get_supplier_partner)} على السائق`}
        />

        <MatchSection
          icon={Store}
          title="مطابقة: طلب إضافة عميل (من الجملة) ⇄ طلب مورد قريب (من المحل)"
          leftLabel="طلبات الجملة (تريد إضافة عميل)"
          rightLabel="طلبات المحلات (تريد مورداً)"
          leftItems={addRetailer.map((r) => ({ id: r.id, primary: r.supplierName, secondary: '' }))}
          rightItems={nearbySupplier.map((r) => ({ id: r.id, primary: r.retailerName, secondary: r.retailerArea }))}
          selectedLeft={selectedAddRetailerReq}
          selectedRight={selectedNearbySupplierReq}
          onSelectLeft={setSelectedAddRetailerReq}
          onSelectRight={setSelectedNearbySupplierReq}
          onExecute={executeRetailerMatch}
          commissionNote={`عند التنفيذ: عمولة ${formatCurrency(LINK_COMMISSION_DEFAULTS.add_retailer)} على الجملة + ${formatCurrency(LINK_COMMISSION_DEFAULTS.get_nearby_supplier)} على المحل`}
        />

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <Megaphone className="w-4.5 h-4.5 text-amber-600" />
            <div>
              <h2 className="text-base font-bold text-gray-900">طلبات رفع عروض</h2>
              <p className="text-xs text-gray-500 mt-1">لا تحتاج طرفاً مقابلاً — موافقة مباشرة من الإدارة تُفعّل العمولة.</p>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {offers.map((o) => (
              <div key={o.id} className="p-4 sm:p-6 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-amber-600">{o.supplierName}</span>
                  <h3 className="font-bold text-gray-900 text-sm mt-0.5">{o.offerTitle}</h3>
                </div>
                <button
                  onClick={() => approveOffer(o.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  موافقة وتنفيذ
                </button>
              </div>
            ))}
            {offers.length === 0 && <div className="p-8 text-center text-sm text-gray-400">لا توجد طلبات رفع عروض حالياً.</div>}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">العمولات بعد التنفيذ</h2>
            <p className="text-xs text-gray-500 mt-1">تُستقطع تدريجياً من كل طرف من خلال عمله وتنفيذه للطلبات على المنصة.</p>
          </div>
          <div className="divide-y divide-gray-100">
            {activeCommissions.map((c) => {
              const meta = roleMeta[c.role];
              const RoleIcon = meta.icon;
              const progress = c.totalCommission === 0 ? 0 : Math.round((c.collected / c.totalCommission) * 100);
              return (
                <div key={c.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.color}`}>
                    <RoleIcon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-semibold text-gray-400">{meta.label}</span>
                      <span className="text-gray-300">•</span>
                      <span className="font-semibold text-blue-600">{typeLabel[c.type]}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      {c.partyName}
                      {c.counterpartName && (
                        <span className="flex items-center gap-1 text-xs font-normal text-gray-400">
                          <ArrowLeftRight className="w-3 h-3" /> {c.counterpartName}
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-[11px] text-gray-400">{progress}% محصّل</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-gray-900">{formatCurrency(c.collected)}</div>
                    <div className="text-[11px] text-gray-400">من أصل {formatCurrency(c.totalCommission)}</div>
                  </div>
                </div>
              );
            })}
            {activeCommissions.length === 0 && (
              <div className="p-10 text-center text-sm text-gray-400">لا توجد عمولات نشطة بعد — نفّذ أول عملية ربط أعلاه.</div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}

// ============================================================
// مكوّنات فرعية
// ============================================================
function SummaryCard({ icon: Icon, label, value, tone }: { icon: React.ElementType; label: string; value: string; tone: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${tone}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-[11px] text-gray-400">{label}</div>
        <div className="text-sm font-bold text-gray-900 mt-0.5">{value}</div>
      </div>
    </div>
  );
}

interface MatchItem {
  id: string;
  primary: string;
  secondary: string;
}

function MatchSection({
  icon: Icon,
  title,
  leftLabel,
  rightLabel,
  leftItems,
  rightItems,
  selectedLeft,
  selectedRight,
  onSelectLeft,
  onSelectRight,
  onExecute,
  commissionNote,
}: {
  icon: React.ElementType;
  title: string;
  leftLabel: string;
  rightLabel: string;
  leftItems: MatchItem[];
  rightItems: MatchItem[];
  selectedLeft: string;
  selectedRight: string;
  onSelectLeft: (id: string) => void;
  onSelectRight: (id: string) => void;
  onExecute: () => void;
  commissionNote: string;
}) {
  const canExecute = Boolean(selectedLeft) && Boolean(selectedRight);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <Icon className="w-4.5 h-4.5 text-blue-600" />
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <MatchColumn label={leftLabel} items={leftItems} selectedId={selectedLeft} onSelect={onSelectLeft} />
        <MatchColumn label={rightLabel} items={rightItems} selectedId={selectedRight} onSelect={onSelectRight} />
      </div>

      <div className="px-6 pb-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-50">
        <span className="text-[11px] text-gray-400">{commissionNote}</span>
        <button
          disabled={!canExecute}
          onClick={onExecute}
          className={`flex items-center gap-2 text-xs font-medium px-5 py-2.5 rounded-xl transition-all shrink-0 ${
            canExecute ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          تنفيذ الربط
        </button>
      </div>
    </section>
  );
}

function MatchColumn({
  label,
  items,
  selectedId,
  onSelect,
}: {
  label: string;
  items: MatchItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold text-gray-500">{label}</span>
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full text-right p-3 rounded-xl border transition-all ${
                isSelected ? 'border-blue-500 bg-blue-50/60' : 'border-gray-100 hover:bg-gray-50'
              }`}
            >
              <div className="text-sm font-bold text-gray-900">{item.primary}</div>
              {item.secondary && <div className="text-[11px] text-gray-400 mt-0.5">{item.secondary}</div>}
              <div className="flex items-center gap-1 text-[10px] text-gray-300 mt-1">
                <Clock className="w-3 h-3" /> بانتظار التنفيذ
              </div>
            </button>
          );
        })}
        {items.length === 0 && (
          <div className="p-4 text-center text-xs text-gray-400">لا توجد طلبات حالياً.</div>
        )}
      </div>
    </div>
  );
}
