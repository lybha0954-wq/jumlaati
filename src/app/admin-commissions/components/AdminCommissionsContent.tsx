'use client';

import React, { useState } from 'react';
import { TrendingUp, Truck, Boxes, Clock, Wallet, Link2, ArrowLeftRight, Inbox, ShieldCheck,  } from 'lucide-react';

type RequesterRole = 'supplier' | 'retailer' | 'delivery';
type LinkRequestType = 'raise_offer' | 'add_retailer' | 'get_driver' | 'get_nearby_supplier' | 'get_supplier_partner';

interface RequestItem {
  id: string;
  primary: string;
  secondary: string;
  extra?: string;
}

interface ActiveCommissionItem {
  id: string;
  role: RequesterRole;
  typeName: string;
  partyName: string;
  counterpartName?: string;
  total: number;
  collected: number;
  progress: number;
}

export default function AdminCommissionsContent() {
  // حالات الطلبات المعلقة للمطابقة
  const [driverWanted, setDriverWanted] = useState<RequestItem[]>([
    { id: 'DW-01', primary: 'مؤسسة الرافدين للمواد الغذائية', secondary: 'الكرخ - بغداد' },
    { id: 'DW-02', primary: 'شركة دجلة للتوزيع بالجملة', secondary: 'المنصور - بغداد' },
  ]);

  const [partnerWanted, setPartnerWanted] = useState<RequestItem[]>([
    { id: 'PW-01', primary: 'أحمد كريم', secondary: 'الكرخ - بغداد', extra: 'دفع رباعي صغير' },
    { id: 'PW-02', primary: 'سجاد علي', secondary: 'الرصافة - بغداد', extra: 'دراجة نارية' },
  ]);

  const [selectedSupplierReq, setSelectedSupplierReq] = useState<string>('');
  const [selectedDriverReq, setSelectedDriverReq] = useState<string>('');

  // العمولات النشطة
  const [activeCommissions, setActiveCommissions] = useState<ActiveCommissionItem[]>([
    {
      id: 'AC-01',
      role: 'supplier',
      typeName: 'طلب إضافة عميل (محل/سوبرماركت)',
      partyName: 'شركة دجلة للتوزيع بالجملة',
      counterpartName: 'محل بغداد للمواد الغذائية',
      total: 50000,
      collected: 50000,
      progress: 100,
    },
    {
      id: 'AC-02',
      role: 'delivery',
      typeName: 'طلب الارتباط بمجهز',
      partyName: 'أحمد كريم',
      counterpartName: 'مؤسسة الرافدين للمواد الغذائية',
      total: 20000,
      collected: 20000,
      progress: 100,
    },
  ]);

  const handleExecuteMatch = () => {
    if (!selectedSupplierReq || !selectedDriverReq) return;

    const sup = driverWanted.find((i) => i.id === selectedSupplierReq);
    const drv = partnerWanted.find((i) => i.id === selectedDriverReq);
    if (!sup || !drv) return;

    // إضافة عمولات جديدة نشطة
    setActiveCommissions((prev) => [
      {
        id: `AC-${Date.now()}-1`,
        role: 'supplier',
        typeName: 'طلب الحصول على سائق توصيل',
        partyName: sup.primary,
        counterpartName: drv.primary,
        total: 40000,
        collected: 0,
        progress: 0,
      },
      {
        id: `AC-${Date.now()}-2`,
        role: 'delivery',
        typeName: 'طلب الارتباط بمجهز',
        partyName: drv.primary,
        counterpartName: sup.primary,
        total: 20000,
        collected: 0,
        progress: 0,
      },
      ...prev,
    ]);

    // إزالة العناصر التي تم ربطها
    setDriverWanted((prev) => prev.filter((i) => i.id !== selectedSupplierReq));
    setPartnerWanted((prev) => prev.filter((i) => i.id !== selectedDriverReq));
    setSelectedSupplierReq('');
    setSelectedDriverReq('');
  };

  const totalPendingCount = driverWanted.length + partnerWanted.length;
  const totalCollectedAmount = activeCommissions.reduce((acc, curr) => acc + curr.collected, 0);
  const totalPendingAmount = activeCommissions.reduce((acc, curr) => acc + (curr.total - curr.collected), 0);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* 1. الترويسة الرئيسية */}
        <header className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1.5 h-full bg-blue-500" />
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
              <ShieldCheck className="w-4 h-4" /> لوحة تحكم الإدارة المركزية
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">إدارة طلبات الربط والعمولات</h1>
            <p className="text-sm text-slate-400">
              إدارة مطابقة طلبات الجملة والمحل والتوصيل. تنفيذ الربط يوثق العلاقة التجارية ويفعّل خطط استقطاع العمولات تلقائياً.
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
            <Wallet className="w-6 h-6" />
          </div>
        </header>

        {/* 2. شريط الإحصائيات (مترتب باليمين واليسار بدقة) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400">إجمالي العمولات المحصلة فعلياً</div>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">{totalCollectedAmount.toLocaleString('ar-IQ')} د.ع</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400">إجمالي العمولات قيد الاستقطاع</div>
              <div className="text-xl font-bold text-blue-400 mt-0.5">{totalPendingAmount.toLocaleString('ar-IQ')} د.ع</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400">طلبات بانتظار المطابقة والتنفيذ</div>
              <div className="text-xl font-bold text-amber-400 mt-0.5">{totalPendingCount}</div>
            </div>
          </div>
        </div>

        {/* 3. قسم مطابقة خدمات النقل والتوصيل */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">مطابقة خدمات النقل والتوصيل</h2>
              <p className="text-xs text-slate-400 mt-0.5">ربط طلبات الجملة التي تحتاج سائقاً مع طلبات السائقين الراغبين بالارتباط بمجهزين</p>
            </div>
          </div>

          {/* محتوى الأعمدة المتقابلة */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-950/40">
            
            {/* العمود الأيمن: طلبات مجهزي الجملة */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400">طلبات مجهزي الجملة (يبحثون عن سائق)</div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {driverWanted.map((item) => {
                  const isSelected = selectedSupplierReq === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedSupplierReq(item.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-600/10 border-blue-500 text-white' :'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-sm text-white">{item.primary}</div>
                      <div className="text-xs text-slate-400 mt-1">{item.secondary}</div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-400 mt-2">
                        <Clock className="w-3 h-3" /> بانتظار التنفيذ
                      </div>
                    </div>
                  );
                })}
                {driverWanted.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-900 rounded-xl border border-slate-800">
                    لا توجد طلبات جملة معلقة حالياً
                  </div>
                )}
              </div>
            </div>

            {/* العمود الأيسر: طلبات السائقين */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400">طلبات السائقين (يبحثون عن مجهز)</div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {partnerWanted.map((item) => {
                  const isSelected = selectedDriverReq === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedDriverReq(item.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-600/10 border-blue-500 text-white' :'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-sm text-white">{item.primary}</div>
                      <div className="text-xs text-slate-400 mt-1">{item.secondary} {item.extra && `· ${item.extra}`}</div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-400 mt-2">
                        <Clock className="w-3 h-3" /> بانتظار التنفيذ
                      </div>
                    </div>
                  );
                })}
                {partnerWanted.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-900 rounded-xl border border-slate-800">
                    لا توجد طلبات سائقين معلقة حالياً
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* شريط الإجراء السفلي للمطابقة */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              عند التنفيذ: عمولة 40,000 د.ع على الجملة + 20,000 د.ع على السائق
            </div>
            <button
              onClick={handleExecuteMatch}
              disabled={!selectedSupplierReq || !selectedDriverReq}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                selectedSupplierReq && selectedDriverReq
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-lg shadow-blue-600/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Link2 className="w-4 h-4" /> تنفيذ الربط
            </button>
          </div>
        </section>

        {/* 4. جدول العمولات النشطة */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-base font-bold text-white">العمولات بعد التنفيذ</h2>
            <p className="text-xs text-slate-400 mt-0.5">تُستقطع تدريجياً من كل طرف من خلال عمله وتنفيذها للطلبات على المنصة.</p>
          </div>
          <div className="divide-y divide-slate-800">
            {activeCommissions.map((comm) => (
              <div key={comm.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${comm.role === 'supplier' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    {comm.role === 'supplier' ? <Boxes className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400">{comm.role === 'supplier' ? 'جملة / مجهز' : 'توصيل'}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-blue-400 font-medium">{comm.typeName}</span>
                    </div>
                    <div className="font-bold text-sm text-white flex items-center gap-2">
                      {comm.partyName}
                      {comm.counterpartName && (
                        <span className="text-xs text-slate-400 font-normal flex items-center gap-1">
                          <ArrowLeftRight className="w-3 h-3 text-slate-500" /> {comm.counterpartName}
                        </span>
                      )}
                    </div>
                    {/* شريط التقدم */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${comm.progress}%` }} />
                      </div>
                      <span className="text-[11px] text-slate-400">{comm.progress}% محصّل</span>
                    </div>
                  </div>
                </div>

                <div className="text-left w-full md:w-auto flex md:flex-col justify-between items-center md:items-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                  <div className="text-sm font-bold text-emerald-400">{comm.collected.toLocaleString('ar-IQ')} د.ع</div>
                  <div className="text-xs text-slate-500">من أصل {comm.total.toLocaleString('ar-IQ')} د.ع</div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
