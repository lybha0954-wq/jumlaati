'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Truck, UserPlus, Trash2, Phone, Mail, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function SupplierCouriersPage() {
  const { user } = useAuth();
  const [couriers, setCouriers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // جلب الموصليين التابعين للمورد
  useEffect(() => {
    if (!user) return;
    async function fetchCouriers() {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('employer_supplier_id', user.id)
        .eq('role', 'courier');
      
      if (!error && data) setCouriers(data);
      setLoading(false);
    }
    fetchCouriers();
  }, [user]);

  // إضافة موصل جديد
  const addCourier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // 1. إنشاء حساب مؤقت في auth.users (بكلمة مرور 123456)
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: email,
      password: '123456',
      options: {
        data: { full_name: fullName, role: 'courier' },
      },
    });

    if (authError) {
      alert('خطأ في إنشاء الحساب: ' + authError.message);
      return;
    }

    // 2. إضافة البروفايل وربطه بالمورد
    if (authUser?.user?.id) {
      const { error: profileError } = await supabase.from('user_profiles').insert({
        id: authUser.user.id,
        email: email,
        full_name: fullName,
        role: 'courier',
        phone: phone,
        employer_supplier_id: user.id,
      });

      if (!profileError) {
        // تحديث القائمة
        const { data } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('employer_supplier_id', user.id)
          .eq('role', 'courier');
        setCouriers(data || []);
        
        // إعادة تعيين النموذج
        setShowForm(false);
        setFullName(''); setPhone(''); setEmail('');
      } else {
        alert('خطأ في حفظ البروفايل: ' + profileError.message);
      }
    }
  };

  // تغيير حالة الموصل
  const updateStatus = async (courierId: string, status: string) => {
    const { error } = await supabase
      .from('user_profiles')
      .update({ courier_status: status })
      .eq('id', courierId);

    if (!error) {
      setCouriers(couriers.map(c => c.id === courierId ? { ...c, courier_status: status } : c));
    }
  };

  // حذف موصل
  const deleteCourier = async (courierId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الموصل؟')) {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', courierId);
      
      if (!error) {
        setCouriers(couriers.filter(c => c.id !== courierId));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* الترويسة */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">إدارة الموصليين</h1>
            <p className="text-sm text-slate-400">أضف أعضاء فريق التوصيل وتابع حالتهم</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:scale-105"
          >
            <UserPlus size={20} />
            {showForm ? 'إغلاق' : 'إضافة موصل'}
          </button>
        </div>

        {/* نموذج إضافة موصل */}
        {showForm && (
          <form onSubmit={addCourier} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full"></span>
              بيانات الموصل الجديد
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-300 block mb-1">الاسم الكامل</label>
                <input
                  type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                  className="w-full bg-slate-900/60 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                  placeholder="مثال: علي حسن"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 block mb-1">رقم الهاتف</label>
                <input
                  type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required
                  className="w-full bg-slate-900/60 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                  placeholder="07700000000"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 block mb-1">البريد الإلكتروني</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full bg-slate-900/60 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                  placeholder="courier@example.com"
                />
              </div>
            </div>
            <p className="text-xs text-slate-500">سيتم إنشاء حساب للموصل بكلمة مرور مؤقتة: <span className="font-mono font-bold text-amber-400">123456</span></p>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition">
              حفظ الموصل
            </button>
          </form>
        )}

        {/* قائمة الموصليين */}
        <div className="space-y-4">
          {loading && <div className="text-center py-10 text-slate-500">جاري تحميل الموصليين...</div>}
          {!loading && couriers.length === 0 && (
            <div className="text-center py-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
              <div className="bg-slate-800 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck size={40} className="text-slate-500" />
              </div>
              <p className="text-slate-400">لا يوجد موصلين في فريقك بعد.</p>
            </div>
          )}

          {couriers.map((courier) => (
            <div key={courier.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 rounded-3xl p-5 transition-all duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-emerald-400">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{courier.full_name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-2" dir="ltr">
                      <Phone size={12} /> {courier.phone || 'غير محدد'}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-1" dir="ltr">
                      <Mail size={12} /> {courier.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* تغيير الحالة */}
                  <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1">
                    <button
                      onClick={() => updateStatus(courier.id, 'متواجد')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${courier.courier_status === 'متواجد' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      <CheckCircle2 size={14} /> متواجد
                    </button>
                    <button
                      onClick={() => updateStatus(courier.id, 'مشغول')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${courier.courier_status === 'مشغول' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      <Clock size={14} /> مشغول
                    </button>
                    <button
                      onClick={() => updateStatus(courier.id, 'غائب')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${courier.courier_status === 'غائب' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      <AlertCircle size={14} /> غائب
                    </button>
                  </div>

                  {/* حذف */}
                  <button
                    onClick={() => deleteCourier(courier.id)}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl transition"
                  >
                    <Trash2 size={16} /> حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
            }
