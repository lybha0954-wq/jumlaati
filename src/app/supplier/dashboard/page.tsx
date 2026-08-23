'use client';

export default function SupplierDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">مرحباً بك في لوحة تحكم المورد</h1>
      <p className="text-slate-400 mt-2">هذه هي الصفحة الرئيسية الخاصة بك.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-sm">إجمالي الطلبات</p>
          <h2 className="text-3xl font-black text-indigo-400 mt-2">0</h2>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-sm">المنتجات النشطة</p>
          <h2 className="text-3xl font-black text-emerald-400 mt-2">0</h2>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-sm">الموصليين المتواجدين</p>
          <h2 className="text-3xl font-black text-amber-400 mt-2">0</h2>
        </div>
      </div>
    </div>
  );
}
