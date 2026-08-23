'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Truck, CheckCircle2, Clock, AlertCircle, ArrowRight, MapPin } from 'lucide-react';

export default function RetailerOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('retailer_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, [user]);

  const statusColors = (status: string) => {
    switch (status) {
      case 'reviewing': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'assigned': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'delivering': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const statusLabels: Record<string, string> = {
    reviewing: 'قيد المراجعة',
    assigned: 'تم التكليف',
    delivering: 'قيد التوصيل',
    completed: 'مكتمل',
    cancelled: 'ملغي'
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* الترويسة */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">طلباتي</h1>
            <p className="text-sm text-slate-400">تابع حالة طلباتك التي قمت بشرائها</p>
          </div>
          <button onClick={() => router.push('/retailer/browse')} className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:scale-105">
            <ArrowRight size={20} /> شراء المزيد
          </button>
        </div>

        {/* قائمة الطلبات */}
        <div className="space-y-6">
          {loading && <div className="text-center py-10 text-slate-500">جاري تحميل الطلبات...</div>}
          {!loading && orders.length === 0 && (
            <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
              <div className="bg-slate-800 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={40} className="text-slate-500" />
              </div>
              <p className="text-slate-400">لا توجد طلبات بعد.</p>
              <button onClick={() => router.push('/retailer/browse')} className="mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-2xl transition">
                ابدأ التسوق الآن
              </button>
            </div>
          )}

          {orders.map((order) => (
            <div key={order.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5">
              
              {/* رأس الطلب */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-white/10 flex items-center justify-center text-emerald-400">
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">طلب رقم: {order.order_number}</h3>
                    <p className="text-xs text-slate-500">بتاريخ: {new Date(order.created_at).toLocaleDateString('ar-IQ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border ${statusColors(order.status)}`}>
                    {statusLabels[order.status]}
                  </span>
                  <span className="text-2xl font-black text-emerald-400">{order.total.toLocaleString()} د.ع</span>
                </div>
              </div>

              {/* تفاصيل التوصيل */}
              <div className="flex items-center gap-3 text-sm text-slate-300 mb-4">
                <MapPin size={16} className="text-slate-500" />
                <span>{order.delivery_city} - {order.delivery_address}</span>
              </div>

              {/* المنتجات داخل الطلب */}
              <div className="border-t border-white/10 pt-4">
                <h4 className="text-sm font-bold text-white mb-3">المنتجات المطلوبة:</h4>
                <div className="space-y-2">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{item.product_name} <span className="text-slate-500">× {item.qty}</span></span>
                      <span className="text-slate-400">{(item.unit_price * item.qty).toLocaleString()} د.ع</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* مؤشر الحالة الزمني */}
              {order.status === 'delivering' && (
                <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 mt-4 text-indigo-300">
                  <Truck size={20} />
                  <p className="text-sm font-bold">طلبك في الطريق إليك الآن!</p>
                </div>
              )}
              {order.status === 'completed' && (
                <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 mt-4 text-emerald-300">
                  <CheckCircle2 size={20} />
                  <p className="text-sm font-bold">تم استلام طلبك بنجاح!</p>
                </div>
              )}
              {order.status === 'reviewing' && (
                <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mt-4 text-amber-300">
                  <Clock size={20} />
                  <p className="text-sm font-bold">بانتظار مراجعة المورد...</p>
                </div>
              )}
              {order.status === 'cancelled' && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mt-4 text-red-300">
                  <AlertCircle size={20} />
                  <p className="text-sm font-bold">تم إلغاء هذا الطلب.</p>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
