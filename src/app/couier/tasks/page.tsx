'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Phone, Package, ArrowRight, Truck, CheckCircle2, Clock, ExternalLink } from 'lucide-react';

export default function CourierTasksPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب المهام الخاصة بالموصل
  useEffect(() => {
    async function fetchTasks() {
      if (!user) return;
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('courier_id', user.id)
        .in('status', ['assigned', 'delivering'])
        .order('created_at', { ascending: false });

      if (!error && data) setTasks(data);
      setLoading(false);
    }
    fetchTasks();
  }, [user]);

  // تحديث حالة الطلب
  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (!error) {
      setTasks(tasks.filter((task) => task.id !== orderId));
    }
  };

  // فتح الخريطة (إحداثيات المتجر أو عناوين جوجل)
  const openMap = (task: any) => {
    const query = task.delivery_city + ' ' + task.delivery_address;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* الترويسة */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">مهام التوصيل</h1>
          <p className="text-sm text-slate-400">هذه هي الطلبات التي كلفك بها المورد، قم بتحديث حالتها فور وصولك للتاجر.</p>
        </div>

        {/* قائمة المهام */}
        <div className="space-y-6">
          {loading && <div className="text-center py-10 text-slate-500">جاري تحميل المهام...</div>}
          {!loading && tasks.length === 0 && (
            <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
              <div className="bg-slate-800 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck size={40} className="text-slate-500" />
              </div>
              <p className="text-slate-400">لا توجد مهام حالياً. استرخِ! 🎉</p>
            </div>
          )}

          {tasks.map((task) => (
            <div key={task.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5">
              
              {/* رأس المهمة */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-cyan-400">
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{task.buyer_store_name || 'متجر غير محدد'}</h3>
                    <p className="text-xs text-slate-500 font-mono">طلب رقم: {task.order_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border ${
                    task.status === 'delivering' 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {task.status === 'delivering' ? 'قيد التوصيل' : 'تم التكليف'}
                  </span>
                  <span className="text-2xl font-black text-emerald-400">{task.total.toLocaleString()} د.ع</span>
                </div>
              </div>

              {/* التفاصيل والعنوان */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                <div className="flex items-center gap-3 text-slate-300">
                  <MapPin size={18} className="text-cyan-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">عنوان التاجر</p>
                    <p className="font-medium">{task.delivery_city} - {task.delivery_address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Phone size={18} className="text-cyan-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">هاتف التاجر</p>
                    <p className="font-medium" dir="ltr">{task.buyer_phone || 'غير مسجل'}</p>
                  </div>
                </div>
              </div>

              {/* أزرار التحكم والخريطة */}
              <div className="flex flex-col sm:flex-row gap-3 border-t border-white/10 pt-4">
                <button
                  onClick={() => openMap(task)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition"
                >
                  <ExternalLink size={18} /> فتح خريطة الوصول
                </button>
                
                {task.status === 'assigned' ? (
                  <button
                    onClick={() => updateStatus(task.id, 'delivering')}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300"
                  >
                    <Truck size={18} /> بدأت التوصيل
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(task.id, 'completed')}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300"
                  >
                    <CheckCircle2 size={18} /> تم التسليم
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
