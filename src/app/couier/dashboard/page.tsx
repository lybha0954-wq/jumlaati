'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function CourierDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('courier_id', user?.id);
      if (!error && data) setOrders(data);
    }
    fetchOrders();
  }, [user?.id]);

  return (
    <div>
      <h1 className="text-2xl font-bold">مرحباً بك في لوحة تحكم الموصل</h1>
      <p className="text-slate-400 mt-2">هذه إحصائياتك اليوم:</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-sm">الطلبات المكلف بها</p>
          <h2 className="text-3xl font-black text-cyan-400 mt-2">{orders.length}</h2>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-sm">مهام قيد التوصيل</p>
          <h2 className="text-3xl font-black text-amber-400 mt-2">
            {orders.filter((o) => o.status === 'delivering').length}
          </h2>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-sm">حالة الاتصال</p>
          <h2 className="text-3xl font-black text-emerald-400 mt-2">متواجد</h2>
        </div>
      </div>
    </div>
  );
}
