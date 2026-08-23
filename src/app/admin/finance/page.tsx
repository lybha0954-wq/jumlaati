'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Wallet, TrendingUp, Percent, Coins, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function AdminFinancePage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCommission: 0,
    netProfit: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFinanceData() {
      // جلب جميع الطلبات
      const { data: orders } = await supabase
        .from('orders')
        .select('total, commission, payment_status')
        .order('created_at', { ascending: false });

      if (orders) {
        const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
        const totalCommission = orders.reduce((acc, o) => acc + (o.commission || 0), 0);
        const netProfit = totalRevenue - totalCommission; // الربح الصافي للمنصة (العمولة) + أرباح الموردين (المخزون)؟ في المنصة عادة العمولة هي ربح المنصة
        // ملاحظة: لتبسيط الأمر، الربح الصافي للمنصة هو العمولة نفسها إذا كانت المنصة وسيطاً.
        // لكن سنعرضه كالتالي: إجمالي المبيعات - العمولة = صافي المبيعات (أي ما يذهب للموردين + التوصيل)
        // بينما ربح المنصة هو العمولة.

        setStats({
          totalRevenue: totalRevenue,
          totalCommission: totalCommission,
          netProfit: totalRevenue - totalCommission, // صافي المبيعات (ما يتبقى للموردين)
          totalOrders: orders.length,
        });
      }
      setLoading(false);
    }
    fetchFinanceData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* الترويسة */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">الإدارة المالية</h1>
          <p className="text-sm text-slate-400">نظرة شاملة على أموال المنصة وربحيتها</p>
        </div>

        {/* بطاقات الإحصائيات المالية */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* إجمالي الإيرادات */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-emerald-500/50 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Wallet size={24} />
              </div>
              <span className="text-xs text-slate-500 flex items-center gap-1"><TrendingUp size={12} /> إجمالي</span>
            </div>
            <p className="text-slate-400 text-sm mt-4">إجمالي المبيعات</p>
            <h2 className="text-2xl font-black text-emerald-400 mt-1">{stats.totalRevenue.toLocaleString()} د.ع</h2>
          </div>

          {/* العمولات */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/20 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Percent size={24} />
              </div>
              <span className="text-xs text-slate-500">ربح المنصة</span>
            </div>
            <p className="text-slate-400 text-sm mt-4">العمولات المكتسبة</p>
            <h2 className="text-2xl font-black text-purple-400 mt-1">{stats.totalCommission.toLocaleString()} د.ع</h2>
          </div>

          {/* صافي المبيعات */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Coins size={24} />
              </div>
              <span className="text-xs text-slate-500">للموردين</span>
            </div>
            <p className="text-slate-400 text-sm mt-4">صافي المبيعات</p>
            <h2 className="text-2xl font-black text-blue-400 mt-1">{stats.netProfit.toLocaleString()} د.ع</h2>
          </div>

          {/* عدد الطلبات */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-amber-500/50 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ArrowUpRight size={24} />
              </div>
              <span className="text-xs text-slate-500">النشاط</span>
            </div>
            <p className="text-slate-400 text-sm mt-4">إجمالي الطلبات</p>
            <h2 className="text-2xl font-black text-amber-400 mt-1">{stats.totalOrders}</h2>
          </div>
        </div>

        {/* ملاحظة توضيحية */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-slate-400 text-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-300">
            <ArrowDownRight size={18} className="text-emerald-400" />
            <span className="font-bold">صافي المبيعات</span> هو المبلغ الذي يذهب للموردين بعد خصم عمولة المنصة.
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <ArrowUpRight size={18} className="text-purple-400" />
            <span className="font-bold">العمولات</span> هي أرباح المنصة من كل عملية بيع.
          </div>
        </div>

      </div>
    </div>
  );
}
