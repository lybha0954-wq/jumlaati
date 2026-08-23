'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Search, Shield, Store, Truck, User, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // جلب جميع المستخدمين
  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setUsers(data);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  // تحديث دور المستخدم
  const updateRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
  };

  // حذف مستخدم
  const deleteUser = async (userId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (!error) {
        setUsers(users.filter(u => u.id !== userId));
      }
    }
  };

  // الفلترة والبحث
  const filteredUsers = users.filter((u) => {
    const matchesFilter = filter === 'all' || u.role === filter;
    const matchesSearch = u.full_name.includes(search) || u.email.includes(search);
    return matchesFilter && matchesSearch;
  });

  // أيقونات وألوان حسب الدور
  const roleConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    admin: { label: 'مدير', icon: <Shield size={18} />, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    supplier: { label: 'مورد', icon: <Store size={18} />, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    retailer: { label: 'تاجر', icon: <User size={18} />, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    courier: { label: 'موصل', icon: <Truck size={18} />, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* الترويسة والبحث */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">إدارة المستخدمين</h1>
            <p className="text-sm text-slate-400">تحكم في حسابات الموردين والتجار والموصليين</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-3.5 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="ابحث بالاسم أو البريد..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-3 pr-12 pl-4 text-white placeholder-slate-500 focus:border-purple-500 transition"
            />
          </div>
        </div>

        {/* الفلترة حسب الدور */}
        <div className="flex flex-wrap gap-2">
          {['all', 'supplier', 'retailer', 'courier', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                filter === role
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              {role === 'all' ? 'الكل' : role === 'supplier' ? 'الموردين' : role === 'retailer' ? 'التجار' : role === 'courier' ? 'الموصليين' : 'المدراء'}
            </button>
          ))}
        </div>

        {/* قائمة المستخدمين */}
        <div className="space-y-4">
          {loading && <div className="text-center py-10 text-slate-500">جاري تحميل المستخدمين...</div>}
          {!loading && filteredUsers.length === 0 && (
            <div className="text-center py-16 text-slate-500">لا يوجد مستخدمين مطابقين.</div>
          )}

          {filteredUsers.map((u) => {
            const config = roleConfig[u.role] || roleConfig.retailer;
            return (
              <div key={u.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 rounded-3xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* بيانات المستخدم */}
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center ${config.color}`}>
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{u.full_name || 'بدون اسم'}</h3>
                      <p className="text-xs text-slate-400" dir="ltr">{u.email}</p>
                      <p className="text-xs text-slate-500 mt-1">هاتف: {u.phone || 'غير مسجل'}</p>
                    </div>
                  </div>

                  {/* التحديثات والحذف */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1">
                      {Object.keys(roleConfig).map((role) => (
                        <button
                          key={role}
                          onClick={() => updateRole(u.id, role)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            u.role === role
                              ? 'bg-purple-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {roleConfig[role].label}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl transition"
                    >
                      <Trash2 size={16} /> حذف
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
