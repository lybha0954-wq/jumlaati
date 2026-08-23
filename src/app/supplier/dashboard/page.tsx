'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Truck, Wallet, ArrowUpRight, TrendingUp, Users } from 'lucide-react';

export default function SupplierDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ products: 0, orders: 0, couriers: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;

      // جلب عدد المنتجات
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('supplier_id', user.id);

      // جلب عدد الطلبات والإيرادات
      const { data: orders } = await supabase
        .from('orders')
        .select('total, status, order_number, created_at, buyer_store_name')
        .eq('supplier_id', user.id)
        .order('created_at', { ascending: false });

      const totalRevenue = (orders || []).reduce((acc, o) => acc + (o.total || 0), 0);

      // جلب عدد الموصليين العاملين لديه
      const { count: courierCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('employer_supplier_id', user.id)
        .eq('role', 'courier');

      setStats({
        products: productCount || 0,
        orders: orders?.length || 0,
        couriers: courierCount || 0,
        revenue: totalRevenue,
      });

      setRecentOrders(orders?.slice(0, 5) || []);
    }
    fetchDashboardData();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* الترحيب والرأس */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              أهلاً بك، {user?.email?.split('@')[0]} 👋
            </h1>
            <p className="text-sm text-slate-400">نظرة عامة على أداء متجرك اليوم</p>
          </div>
          <button
            onClick={() => router.push('/supplier/products')}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:scale-105"
          >
            <Package size={20} />
            إدارة المنتجات
          </button>
        </div>

        {/* بطاقات الإحصائيات الاحترافية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Wallet size={24} />
              </div>
              <span className="text-xs text-slate-500 flex items-center gap-1"><TrendingUp size={12} /> إجمالي</span>
            </div>
            <p className="text-slate-400 text-sm mt-4">الإيرادات</p>
            <h2 className="text-2xl font-black text-white mt-1">{stats.revenue.toLocaleString()} د.ع</h2>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Package size={24} />
              </div>
              <span className="text-xs text-slate-500">المخزون</span>
            </div>
            <p className="text-slate-400 text-sm mt-4">المنتجات</p>
            <h2 className="text-2xl font-black text-white mt-1">{stats.products}</h2>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Truck size={24} />
              </div>
              <span className="text-xs text-slate-500">الشحن</span>
            </div>
            <p className="text-slate-400 text-sm mt-4">الطلبات</p>
            <h2 className="text-2xl font-black text-white mt-1">{stats.orders}</h2>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/20 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Users size={24} />
              </div>
              <span className="text-xs text-slate-500">الفريق</span>
            </div>
            <p className="text-slate-400 text-sm mt-4">الموصليين</p>
            <h2 className="text-2xl font-black text-white mt-1">{stats.couriers}</h2>
          </div>
        </div>

        {/* آخر الطلبات */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full"></span>
              آخر الطلبات الواردة
            </h2>
            <button 
              onClick={() => router.push('/supplier/orders')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              عرض الكل <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {recentOrders.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-sm">
                لا توجد طلبات بعد. سيتم عرض الطلبات هنا فور وصولها.
              </div>
            )}
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 transition">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Truck size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{order.buyer_store_name || 'متجر غير محدد'}</p>
                    <p className="text-xs text-slate-500">طلب رقم: {order.order_number}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-emerald-400">{order.total.toLocaleString()} د.ع</p>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                    order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    order.status === 'assigned' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                  }`}>
                    {order.status === 'completed' ? 'مكتمل' : order.status === 'assigned' ? 'تم التكليف' : 'قيد المراجعة'}
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
