'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Package, Truck, Wallet, TrendingUp, Activity, ShoppingBag, UserPlus } from 'lucide-react';

export default function AdminPanelPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ users: 0, orders: 0, products: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAdminData() {
      if (!user) return;

      // جلب إجمالي المستخدمين
      const { count: userCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // جلب إجمالي الطلبات
      const { count: orderCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // جلب إجمالي المنتجات
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // جلب إجمالي الإيرادات
      const { data: orders } = await supabase
        .from('orders')
        .select('total, created_at, order_number, buyer_store_name, status')
        .order('created_at', { ascending: false });

      const totalRevenue = (orders || []).reduce((acc, o) => acc + (o.total || 0), 0);

      setStats({
        users: userCount || 0,
        orders: orderCount || 0,
        products: productCount || 0,
        revenue: totalRevenue,
      });

      setRecentOrders(orders?.slice(0, 6) || []);
    }
    fetchAdminData();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* الترويسة */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            لوحة التحكم الرئيسية
          </h1>
          <p className="text-sm text-slate-400">نظرة شاملة على أداء منصة جملتي</p>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/20 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Users size={24} />
              </div>
              <span className="text-xs text-slate-500 flex items-center gap-1"><Activity size={12} /> نشط</span>
            </div>
            <p className="text-slate-400 text-sm mt-4">إجمالي المستخدمين</p>
            <h2 className="text-3xl font-black text-white mt-1">{stats.users}</h2>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 rounded-2xl bg-pink-500/20 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <ShoppingBag size={24} />
              </div>
              <span className="text-xs text-slate-500">الكل</span>
            </div>
            <p className="text-slate-400 text-sm mt-4">إجمالي الطلبات</p>
            <h2 className="text-3xl font-black text-white mt-1">{stats.orders}</h2>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Package size={24} />
              </div>
              <span className="text-xs text-slate-500">المخزون</span>
            </div>
            <p className="text-slate-400 text-sm mt-4">إجمالي المنتجات</p>
            <h2 className="text-3xl font-black text-white mt-1">{stats.products}</h2>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Wallet size={24} />
              </div>
              <span className="text-xs text-slate-500 flex items-center gap-1"><TrendingUp size={12} /> نمو</span>
            </div>
            <p className="text-slate-400 text-sm mt-4">إجمالي الإيرادات</p>
            <h2 className="text-3xl font-black text-emerald-400 mt-1">{stats.revenue.toLocaleString()} د.ع</h2>
          </div>
        </div>

        {/* أحدث الطلبات */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
              أحدث الطلبات في المنصة
            </h2>
            <button 
              onClick={() => router.push('/admin/orders')}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              عرض جميع الطلبات
            </button>
          </div>

          <div className="space-y-4">
            {recentOrders.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-sm">لا توجد طلبات بعد.</div>
            )}
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/30 transition">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
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
                    order.status === 'delivering' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                    order.status === 'assigned' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {order.status === 'completed' ? 'مكتمل' : order.status === 'delivering' ? 'قيد التوصيل' : order.status === 'assigned' ? 'تم التكليف' : 'قيد المراجعة'}
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
