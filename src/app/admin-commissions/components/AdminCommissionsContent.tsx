'use client';

import React, { useState, useMemo } from 'react';
import {
  Percent,
  TrendingUp,
  Users,
  Truck,
  Store,
  Boxes,
  Clock,
  CheckCircle2,
  ChevronDown,
  Wallet,
  ListFilter,
} from 'lucide-react';

// ============================================================
// أنواع البيانات
// ============================================================

// دور الطرف الذي صدر منه الطلب المُربح للمنصة
type RequesterRole = 'supplier' | 'retailer' | 'delivery';

// نوع طلب الربط (لمرة واحدة، عمولته تُستقطع تدريجياً أثناء العمل)
type LinkRequestType =
  | 'raise_offer'        // طلب رفع عرض (من الجملة/المجهز)
  | 'add_retailer'       // طلب إضافة عميل محل/سوبرماركت (من الجملة/المجهز)
  | 'get_driver'         // طلب الحصول على سائق توصيل (من الجملة/المجهز)
  | 'get_nearby_supplier'// طلب الحصول على مورد قريب (من المحل/السوبرماركت)
  | 'get_supplier_partner'; // طلب الحصول على مورد للتعامل معه (من التوصيل)

type LinkRequestStatus = 'pending' | 'in_progress' | 'completed';

interface LinkCommissionRequest {
  id: string;
  role: RequesterRole;
  type: LinkRequestType;
  partyName: string;      // اسم مقدّم الطلب
  totalCommission: number; // إجمالي العمولة المستحقة عن هذا الطلب
  collected: number;       // ما تم تحصيله فعلياً حتى الآن (استقطاع تدريجي)
  status: LinkRequestStatus;
  createdAt: string;
}

// سجل عمولة ثابتة لكل طلب توريد منفَّذ فعلياً (بضاعة تحركت من الجملة إلى المحل عبر التوصيل)
interface ExecutedOrderCommission {
  id: string;
  orderRef: string;
  supplierName: string;
  retailerName: string;
  deliveryName: string;
  orderValue: number;
  supplierCommission: number;
  retailerCommission: number;
  deliveryCommission: number;
  date: string;
}

// ============================================================
// إعدادات العمولة الثابتة (نسبة تؤخذ من كل طرف عن كل طلب منفَّذ)
// ============================================================
const FIXED_ORDER_RATES = {
  supplier: 2.5, // %
  retailer: 1.0, // %
  delivery: 5.0, // %
};

// ============================================================
// بيانات تجريبية (تُستبدل لاحقاً بربط Supabase)
// ============================================================
const linkRequestsSeed: LinkCommissionRequest[] = [
  { id: 'LR-1001', role: 'supplier', type: 'raise_offer', partyName: 'مؤسسة الرافدين للمواد الغذائية', totalCommission: 75000, collected: 30000, status: 'in_progress', createdAt: '2026-08-12' },
  { id: 'LR-1002', role: 'supplier', type: 'add_retailer', partyName: 'شركة دجلة للتوزيع بالجملة', totalCommission: 50000, collected: 50000, status: 'completed', createdAt: '2026-08-05' },
  { id: 'LR-1003', role: 'supplier', type: 'get_driver', partyName: 'مؤسسة الرافدين للمواد الغذائية', totalCommission: 40000, collected: 10000, status: 'in_progress', createdAt: '2026-08-20' },
  { id: 'LR-1004', role: 'retailer', type: 'get_nearby_supplier', partyName: 'سوبرماركت النخبة - الكرادة', totalCommission: 35000, collected: 0, status: 'pending', createdAt: '2026-08-25' },
  { id: 'LR-1005', role: 'delivery', type: 'get_supplier_partner', partyName: 'أحمد كريم - سائق توصيل', totalCommission: 20000, collected: 20000, status: 'completed', createdAt: '2026-07-28' },
];

const executedOrdersSeed: ExecutedOrderCommission[] = [
  { id: 'EX-9001', orderRef: '#ORD-4471', supplierName: 'شركة دجلة للتوزيع بالجملة', retailerName: 'سوبرماركت النخبة - الكرادة', deliveryName: 'أحمد كريم', orderValue: 1250000, supplierCommission: 31250, retailerCommission: 12500, deliveryCommission: 62500, date: '2026-08-28' },
  { id: 'EX-9002', orderRef: '#ORD-4472', supplierName: 'مؤسسة الرافدين للمواد الغذائية', retailerName: 'محل بغداد للمواد الغذائية', deliveryName: 'سجاد علي', orderValue: 640000, supplierCommission: 16000, retailerCommission: 6400, deliveryCommission: 32000, date: '2026-08-29' },
  { id: 'EX-9003', orderRef: '#ORD-4473', supplierName: 'شركة دجلة للتوزيع بالجملة', retailerName: 'سوبرماركت الأمانة', deliveryName: 'أحمد كريم', orderValue: 980000, supplierCommission: 24500, retailerCommission: 9800, deliveryCommission: 49000, date: '2026-08-30' },
];

// ============================================================
// خرائط عرض للأسماء والأيقونات
// ============================================================
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
  get_supplier_partner: 'طلب الحصول على مورد للتعامل معه',
};

const statusMeta: Record<LinkRequestStatus, { label: string; className: string; icon: React.ElementType }> = {
  pending: { label: 'قيد الانتظار', className: 'text-gray-500 bg-gray-100', icon: Clock },
  in_progress: { label: 'قيد الاستقطاع', className: 'text-amber-600 bg-amber-50', icon: TrendingUp },
  completed: { label: 'مكتملة التحصيل', className: 'text-emerald-600 bg-emerald-50', icon: CheckCircle2 },
};

function formatCurrency(n: number) {
  return `${n.toLocaleString('ar-IQ')} د.ع`;
}

// ============================================================
// المكوّن الرئيسي
// ============================================================
export default function AdminCommissionsContent() {
  const [roleFilter, setRoleFilter] = useState<RequesterRole | 'all'>('all');

  const filteredLinkRequests = useMemo(
    () => (roleFilter === 'all' ? linkRequestsSeed : linkRequestsSeed.filter((r) => r.role === roleFilter)),
    [roleFilter]
  );

  // إجمالي عمولات الربط (المحصّلة فعلياً فقط، وليس المستحقة الكاملة)
  const totalLinkCollected = linkRequestsSeed.reduce((acc, r) => acc + r.collected, 0);
  const totalLinkPending = linkRequestsSeed.reduce((acc, r) => acc + (r.totalCommission - r.collected), 0);

  // إجمالي العمولة الثابتة من الطلبات المنفذة
  const totalFixedFromExecuted = executedOrdersSeed.reduce(
    (acc, o) => acc + o.supplierCommission + o.retailerCommission + o.deliveryCommission,
    0
  );

  const grandTotalCommissions = totalLinkCollected + totalFixedFromExecuted;

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* رأس الصفحة */}
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">عمولات المنصة</h1>
            <p className="text-sm text-gray-500 mt-1">
              متابعة عمولات طلبات الربط (رفع عرض، إضافة عميل، الحصول على سائق/مورد) والعمولة الثابتة على كل طلب منفَّذ.
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </header>

        {/* بطاقات المؤشرات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            icon={Wallet}
            label="إجمالي العمولات المحصّلة"
            value={formatCurrency(grandTotalCommissions)}
            tone="text-blue-600 bg-blue-50"
          />
          <SummaryCard
            icon={TrendingUp}
            label="عمولات ربط قيد الاستقطاع"
            value={formatCurrency(totalLinkPending)}
            tone="text-amber-600 bg-amber-50"
          />
          <SummaryCard
            icon={Percent}
            label="عمولة الطلبات الثابتة"
            value={formatCurrency(totalFixedFromExecuted)}
            tone="text-emerald-600 bg-emerald-50"
          />
          <SummaryCard
            icon={Users}
            label="عدد طلبات الربط النشطة"
            value={String(linkRequestsSeed.filter((r) => r.status !== 'completed').length)}
            tone="text-purple-600 bg-purple-50"
          />
        </div>

        {/* قسم 1: عمولات طلبات الربط (لمرة واحدة، استقطاع تدريجي) */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-gray-900">عمولات طلبات الربط</h2>
              <p className="text-xs text-gray-500 mt-1">
                عمولة تُسجَّل عند تنفيذ الإدارة للطلب، وتُستقطع تدريجياً من خلال عمل الطرف على المنصة.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-gray-400" />
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as RequesterRole | 'all')}
                  className="appearance-none text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="all">كل الأطراف</option>
                  <option value="supplier">جملة / مجهز</option>
                  <option value="retailer">محل / سوبرماركت</option>
                  <option value="delivery">توصيل</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredLinkRequests.map((req) => {
              const meta = roleMeta[req.role];
              const st = statusMeta[req.status];
              const RoleIcon = meta.icon;
              const StatusIcon = st.icon;
              const progress = req.totalCommission === 0 ? 0 : Math.round((req.collected / req.totalCommission) * 100);

              return (
                <div key={req.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50/50 transition-all">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.color}`}>
                    <RoleIcon className="w-4.5 h-4.5" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-gray-400">{meta.label}</span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs font-semibold text-blue-600">{typeLabel[req.type]}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">{req.partyName}</h3>

                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-[11px] text-gray-400">{progress}% محصّل</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full">
                    <div className="text-left">
                      <div className="text-sm font-bold text-gray-900">{formatCurrency(req.collected)}</div>
                      <div className="text-[11px] text-gray-400">من أصل {formatCurrency(req.totalCommission)}</div>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 ${st.className}`}>
                      <StatusIcon className="w-3 h-3" />
                      {st.label}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredLinkRequests.length === 0 && (
              <div className="p-10 text-center text-sm text-gray-400">لا توجد طلبات ربط لهذا الطرف حالياً.</div>
            )}
          </div>
        </section>

        {/* قسم 2: العمولة الثابتة على الطلبات المنفَّذة */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">العمولة الثابتة على الطلبات المنفَّذة</h2>
            <p className="text-xs text-gray-500 mt-1">
              نسبة ثابتة تُقتطع من كل طرف عند تنفيذ أي طلب توريد، ولا تتأثر بأرباح الطرف السابقة.
            </p>
            <div className="flex flex-wrap gap-3 mt-3">
              <RateBadge label="جملة/مجهز" value={FIXED_ORDER_RATES.supplier} tone="text-amber-600 bg-amber-50" />
              <RateBadge label="محل/سوبرماركت" value={FIXED_ORDER_RATES.retailer} tone="text-blue-600 bg-blue-50" />
              <RateBadge label="توصيل" value={FIXED_ORDER_RATES.delivery} tone="text-emerald-600 bg-emerald-50" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="text-[11px] text-gray-400 border-b border-gray-100">
                  <th className="p-4 font-semibold">الطلب</th>
                  <th className="p-4 font-semibold">المجهز</th>
                  <th className="p-4 font-semibold">المحل</th>
                  <th className="p-4 font-semibold">التوصيل</th>
                  <th className="p-4 font-semibold">قيمة الطلب</th>
                  <th className="p-4 font-semibold">عمولة المجهز</th>
                  <th className="p-4 font-semibold">عمولة المحل</th>
                  <th className="p-4 font-semibold">عمولة التوصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {executedOrdersSeed.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-bold text-gray-900">{o.orderRef}</td>
                    <td className="p-4 text-gray-600">{o.supplierName}</td>
                    <td className="p-4 text-gray-600">{o.retailerName}</td>
                    <td className="p-4 text-gray-600">{o.deliveryName}</td>
                    <td className="p-4 font-semibold text-gray-900">{formatCurrency(o.orderValue)}</td>
                    <td className="p-4 text-amber-600 font-semibold">{formatCurrency(o.supplierCommission)}</td>
                    <td className="p-4 text-blue-600 font-semibold">{formatCurrency(o.retailerCommission)}</td>
                    <td className="p-4 text-emerald-600 font-semibold">{formatCurrency(o.deliveryCommission)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  );
}

// ============================================================
// مكوّنات فرعية صغيرة
// ============================================================
function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone: string;
}) {
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

function RateBadge({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${tone}`}>
      <Percent className="w-3 h-3" />
      {label}: {value}%
    </span>
  );
                }
