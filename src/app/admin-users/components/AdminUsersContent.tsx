'use client';

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  Store, 
  Building2, 
  MoreVertical, 
  CheckCircle2, 
  XCircle,
  Edit,
  Trash2,
  Mail,
  Phone
} from 'lucide-react';

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'supplier' | 'retailer';
  roleName: string;
  status: 'active' | 'inactive';
  entity: string;
  phone: string;
}

export default function AdminUsersContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const [users, setUsers] = useState<UserItem[]>([
    { id: 1, name: 'محمد العتيبي', email: 'mohammed@example.com', role: 'retailer', roleName: 'مدير فرع / مطعم', status: 'active', entity: 'مطعم البرجر الذهبي', phone: '+966 50 111 2233' },
    { id: 2, name: 'عبدالله السالم', email: 'salem@packaging.com', role: 'supplier', roleName: 'مورد', status: 'active', entity: 'شركة التغليف الذكي', phone: '+966 55 222 3344' },
    { id: 3, name: 'سارة خالد', email: 'sara@admin.com', role: 'admin', roleName: 'مشرف نظام', status: 'active', entity: 'الإدارة العامة', phone: '+966 54 333 4455' },
    { id: 4, name: 'خالد العمري', email: 'khaled@pizza.com', role: 'retailer', roleName: 'مدير فرع / مطعم', status: 'inactive', entity: 'بيتزا روما', phone: '+966 56 444 5566' },
  ]);

  const toggleStatus = (id: number) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        return { ...user, status: user.status === 'active' ? 'inactive' : 'active' };
      }
      return user;
    }));
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.entity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين والصلاحيات</h1>
            <p className="text-sm text-gray-500 mt-1">عرض وإدارة حسابات المستخدمين في النظام (المشرفين، الموردين، ومديري الفروع).</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm shadow-blue-200">
            <UserPlus className="w-4 h-4" />
            <span>إضافة مستخدم جديد</span>
          </button>
        </header>

        {/* أدوات البحث والتصفية */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3.5 top-3 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="البحث بالاسم، البريد أو المنشأة..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <button 
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${roleFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              الكل
            </button>
            <button 
              onClick={() => setRoleFilter('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${roleFilter === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              المشرفين
            </button>
            <button 
              onClick={() => setRoleFilter('supplier')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${roleFilter === 'supplier' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              الموردين
            </button>
            <button 
              onClick={() => setRoleFilter('retailer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${roleFilter === 'retailer' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              مديري الفروع
            </button>
          </div>
        </div>

        {/* جدول المستخدمين */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 font-semibold bg-gray-50/50">
                  <th className="p-4">المستخدم</th>
                  <th className="p-4">الدور / الصلاحية</th>
                  <th className="p-4">المنشأة / الجهة</th>
                  <th className="p-4">بيانات الاتصال</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-gray-400">لا توجد نتائج مطابقة للبحث.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-all">
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{user.name}</div>
                        <div className="text-gray-400 text-[11px]">{user.email}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          user.role === 'admin' ? 'bg-purple-50 text-purple-700' :
                          user.role === 'supplier' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {user.roleName}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-gray-700">{user.entity}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{user.phone}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => toggleStatus(user.id)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all ${
                            user.status === 'active' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          }`}
                        >
                          {user.status === 'active' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{user.status === 'active' ? 'نشط' : 'معطل'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-left">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-all" title="تعديل المستخدم">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteUser(user.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all" 
                            title="حذف المستخدم"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
