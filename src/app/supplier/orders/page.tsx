'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Phone, MapPin, UserCheck, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export default function SupplierOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [couriers, setCouriers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // جلب الطلبات والموصليين
  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      // جلب الطلبات الخاصة بالمورد
      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('supplier_id', user.id)
        .order('created_at', { ascending: false });

      // جلب الموصلين العاملين لديه
      const { data: courierData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('employer_supplier_id', user.id)
        .eq('role', 'courier');

      if (orderData) setOrders(orderData);
      if (courierData) setCouriers(courierData);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  // تكليف موصل بالطلب
  const assignCourier = async (orderId: string, courierId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ courier_id: courierId, status: 'assigned', assigned_at: new Date().toISOString() })
      .eq('id', orderId);

    if (!error) {
      // تحديث الحالة محلياً
      setOrders(orders.map(o => o.id === orderId ? { ...o, courier_id: courierId, status: 'assigned' } : o));
    }
  };

  // تغيير حالة الطلب (مثلاً: بدأ التوصيل أو اكتمل)
  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    }
  };

  // الفلترة
  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

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

        {/* الترويسة والفلترة */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">إدارة الطلبات</h1>
            <p className="text-sm text-slate-400">تابع الطلبات الواردة وكلف الموصليين المتواجدين</p>
          </div>
          <div className="flex gap-2">
            {['all', 'reviewing', 'assigned', 'delivering', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  filter === status
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                {status === 'all' ? 'الكل' : statusLabels[status]}
              </button>
            ))}
          </div>
        </div>

        {/* قائمة الطلبات */}
        <div className="space-y-4">
          {loading && <div className="text-center py-10 text-slate-500">جاري تحميل الطلبات...</div>}
          {!loading && filteredOrders.length === 0 && (
            <div className="text-center py-16 text-slate-500">لا توجد طلبات في هذه الحالة.</div>
          )}

          {filteredOrders.map((order) => {
            const assignedCourier = couriers.find(c => c.id === order.courier_id);
            const availableCouriers = couriers.filter(c => c.courier_status === 'متواجد');

            return (
              <div key={order.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-blue-500/30 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
                
                {/* رأس الطلب */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-blue-400">
                      <Package size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{order.buyer_store_name || 'متجر غير محدد'}</h3>
                      <p className="text-xs text-slate-500 font-mono">طلب رقم: {order.order_number}</p>
                    </div>
                  </div>
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border ${statusColors(order.status)}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>

                {/* تفاصيل العنوان والهاتف */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-3 text-slate-300">
                    <MapPin size={18} className="text-slate-500 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">عنوان التوصيل</p>
                      <p className="font-medium">{order.delivery_city} - {order.delivery_address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Phone size={18} className="text-slate-500 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">هاتف التاجر</p>
                      <p className="font-medium" dir="ltr">{order.buyer_phone || 'غير مسجل'}</p>
                    </div>
                  </div>
                </div>

                {/* المبلغ الإجمالي */}
                <div className="flex items-center justify-between border-t border-white/10 pt-4 mb-6">
                  <span className="text-slate-400 text-sm">إجمالي قيمة الطلب</span>
                  <span className="text-2xl font-black text-emerald-400">{order.total.toLocaleString()} د.ع</span>
                </div>

                {/* قسم التكليف أو الحالة */}
                {order.status === 'reviewing' && (
                  <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-4">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <UserCheck size={16} className="text-blue-400" /> تكليف موصل
                    </h4>
                    {availableCouriers.length === 0 ? (
                      <p className="text-xs text-slate-500">لا يوجد موصلين متواجدين حالياً. يرجى الانتظار أو تعديل حالة موصليك.</p>
                    ) : (
                      <select
                        onChange={(e) => assignCourier(order.id, e.target.value)}
                        className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 outline-none"
                      >
                        <option value="">اختر موصلاً متواجداً...</option>
                        {availableCouriers.map((courier) => (
                          <option key={courier.id} value={courier.id}>{courier.full_name} - {courier.phone}</option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {order.status === 'assigned' && (
                  <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <UserCheck size={20} className="text-blue-400" />
                      <div>
                        <p className="text-sm font-bold text-white">{assignedCourier?.full_name || 'موصل غير محدد'}</p>
                        <p className="text-xs text-slate-400">تم تكليفه بالمهمة</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateStatus(order.id, 'delivering')}
                      className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition"
                    >
                      بدأ التوصيل
                    </button>
                  </div>
                )}

                {order.status === 'delivering' && (
                  <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <Clock size={20} className="text-indigo-400" />
                      <p className="text-sm font-bold text-white">الطلب في الطريق إلى التاجر</p>
                    </div>
                    <button
                      onClick={() => updateStatus(order.id, 'completed')}
                      className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition"
                    >
                      تم التسليم
                    </button>
                  </div>
                )}

                {order.status === 'completed' && (
                  <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-emerald-400">
                    <CheckCircle2 size={20} />
                    <p className="text-sm font-bold">اكتمل الطلب بنجاح</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
