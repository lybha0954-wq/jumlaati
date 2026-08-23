'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Package, Truck, Store, User, MapPin, Phone, Search, Filter } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // جلب جميع الطلبات وبيانات المستخدمين
  useEffect(() => {
    async function fetchAllData() {
      // جلب الطلبات
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // جلب بيانات المستخدمين (لربط الأسماء)
      const { data: usersData } = await supabase
        .from('user_profiles')
        .select('id, full_name, role');

      // إنشاء خريطة للمستخدمين (id -> user object)
      const userMap: Record<string, any> = {};
      if (usersData) {
        usersData.forEach((u) => { userMap[u.id] = u; });
      }

      if (!ordersError && ordersData) setOrders(ordersData);
      setUsersMap(userMap);
      setLoading(false);
    }
    fetchAllData();
  }, []);

  // تغيير حالة الطلب يدوياً من قبل الأدمن
  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    }
  };

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

  // الفلترة والبحث
  const filteredOrders = orders.filter((o) => {
    const supplier = usersMap[o.supplier_id]?.full_name || '';
    const retailer = usersMap[o.retailer_id]?.full_name || '';
    const courier = usersMap[o.courier_id]?.full_name || '';
    const matchesFilter = filter === 'all' || o.status === filter;
    const matchesSearch = o.order_number.includes(search) || supplier.includes(search) || retailer.includes(search) || courier.includes(search);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* الترويسة والفلترة */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">إدارة الطلبات</h1>
            <p className="text-sm text-slate-400">راقب جميع الطلبات في المنصة وتتبع الموردين والموصليين</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-3.5 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="ابحث برقم الطلب أو الاسم..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-3 pr-12 pl-4 text-white placeholder-slate-500 focus:border-purple-500 transition"
            />
          </div>
        </div>

        {/* أزرار الفلترة */}
        <div className="flex flex-wrap gap-2">
          {['all', 'reviewing', 'assigned', 'delivering', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                filter === status
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              {status === 'all' ? 'الكل' : statusLabels[status]}
            </button>
          ))}
        </div>

        {/* قائمة الطلبات */}
        <div className="space-y-4">
          {loading && <div className="text-center py-10 text-slate-500">جاري تحميل الطلبات...</div>}
          {!loading && filteredOrders.length === 0 && (
            <div className="text-center py-16 text-slate-500">لا توجد طلبات مطابقة.</div>
          )}

          {filteredOrders.map((order) => {
            const supplier = usersMap[order.supplier_id] || { full_name: 'غير محدد' };
            const retailer = usersMap[order.retailer_id] || { full_name: 'غير محدد' };
            const courier = usersMap[order.courier_id] || { full_name: 'غير معين' };
            
            return (
              <div key={order.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5">
                
                {/* رأس الطلب */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center text-purple-400">
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

                {/* الأطراف الثلاثة */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-t border-white/10 pt-4 text-sm">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Store size={18} className="text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">المورد</p>
                      <p className="font-medium">{supplier.full_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <User size={18} className="text-blue-400 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">التاجر</p>
                      <p className="font-medium">{retailer.full_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Truck size={18} className="text-amber-400 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">الموصل</p>
                      <p className="font-medium">{courier.full_name}</p>
                    </div>
                  </div>
                </div>

                {/* تفاصيل التوصيل */}
                <div className="flex items-center gap-3 text-sm text-slate-400 mb-4">
                  <MapPin size={16} className="text-slate-500" />
                  <span>{order.delivery_city} - {order.delivery_address}</span>
                </div>

                {/* التحكم اليدوي من الأدمن */}
                <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <>
                      <button onClick={() => updateOrderStatus(order.id, 'delivering')} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition">قيد التوصيل</button>
                      <button onClick={() => updateOrderStatus(order.id, 'completed')} className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition">مكتمل</button>
                      <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="text-xs bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl transition">إلغاء</button>
                    </>
                  )}
                  {order.status === 'completed' && <span className="text-xs text-emerald-400 font-bold">الطلب مكتمل</span>}
                  {order.status === 'cancelled' && <span className="text-xs text-red-400 font-bold">الطلب ملغي</span>}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
