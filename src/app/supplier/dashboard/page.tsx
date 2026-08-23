'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Truck, Wallet } from 'lucide-react';

export default function SupplierDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    async function fetchStats() {
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('supplier_id', user?.id);

      const { data: orders } = await supabase
        .from('orders')
        .select('total')
        .eq('supplier_id', user?.id);

      const totalRevenue = (orders || []).reduce((acc, o) => acc + (o.total || 0), 0);

      setStats({
        products: productCount || 0,
        orders: orders?.length || 0,
        revenue: totalRevenue,
      });
    }
    fetchStats();
  }, [user?.id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">مرحباً بك في لوحة تحكم المورد</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div className="flex items-center gap-2 text-indigo-400 mb-2"><Package size={20} /> <span>المنتجات</span></div>
          <h2 className="text-3xl font-black">{stats.products}</h2>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div className="flex items-center gap-2 text-amber-400 mb-2"><Truck size={20} /> <span>الطلبات</span></div>
          <h2 className="text-3xl font-black">{stats.orders}</h2>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div className="flex items-center gap-2 text-emerald-400 mb-2"><Wallet size={20} /> <span>الإيرادات</span></div>
          <h2 className="text-3xl font-black">{stats.revenue.toLocaleString()} د.ع</h2>
        </div>
      </div>
    </div>
  );
}
