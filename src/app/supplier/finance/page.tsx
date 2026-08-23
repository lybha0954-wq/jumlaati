'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Wallet, TrendingUp, Percent, Coins, ReceiptText, ArrowUpRight } from 'lucide-react';

export default function SupplierFinancePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalRevenue: 0, totalCommission: 0, netProfit: 0, completedOrders: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchFinanceData() {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('order_number, total, commission, status, created_at, buyer_store_name')
        .eq('supplier_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && orders) {
        // حساب الإحصائيات
        const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
        const totalCommission = orders.reduce((acc, o) => acc + (o.commission || 0), 0);
        const netProfit = totalRevenue - totalCommission; // صافي المبلغ الذي يذهب للمورد بعد خصم عمولة المنصة
        const completedOrders = orders.filter((o) => o.status === 'completed').length;

        setStats({
          totalRevenue,
          totalCommission,
          netProfit,
          completedOrders,
        });

        // عرض آخر 5 معاملات
        setTransactions(orders.slice(0, 5));
      }
      setLoading(false);
    }
    fetchFinanceData();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* الترويسة */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">الإدارة المالية</h1>
          <p className="text-sm text-slate-400">متابعة أرباحك وعمولاتك وسجل معاملاتك المالية</p>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <span className="text-xs text-slate-500">للمنصة</span>
            </div>
            <p className="text-slate-400 text-sm mt-4">عمولة المنصة</p>
            <h2 className="text-2xl font-black text-purple-400 mt-1">{stats.totalCommission.toLocaleString()} د.ع</h2>
          </div>

          {/* صافي الربح */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Coins size={24} />
              </div>
              <span className="text-xs text-slate-500">لك</span>
            </div>
            <p className="text-slate-400 text-sm mt-4">صافي ربحك</p>
            <h2 className="text-2xl font-black text-blue-400 mt-1">{stats.netProfit.toLocaleString()} د.ع</h2>
          </div>

          {/* الطلبات المكتملة */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-amber-500/50 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ReceiptText size={24} />
              </div>
              <span className="text-xs text-slate-500">مكتملة</span>
            </div>
            <p className="text-slate-400 text-sm mt-4">الطلبات المكتملة</p>
            <h2 className="text-2xl font-black text-amber-400 mt-1">{stats.completedOrders}</h2>
          </div>
        </div>

        {/* سجل المعاملات */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full"></span>
              آخر المعاملات المالية
            </h2>
            <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition">
              عرض الكل <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {loading && <div className="text-center py-10 text-slate-500">جاري تحميل المعاملات...</div>}
            {!loading && transactions.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-sm">لا توجد معاملات بعد.</div>
            )}
            
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 transition">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <ReceiptText size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{txn.buyer_store_name || 'متجر غير محدد'}</p>
                    <p className="text-xs text-slate-500">طلب رقم: {txn.order_number}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-emerald-400">{txn.total.toLocaleString()} د.ع</p>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 bg-slate-500/10 text-slate-400">
                    عمولة: {txn.commission.toLocaleString()} د.ع
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
