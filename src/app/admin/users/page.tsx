'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { userService } from '@/lib/services/userService';
import type { UserProfile } from '@/contexts/AuthContext';
import { Users, Search, Phone, Mail, Shield, Store, Truck, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');

  const loadUsers = async () => {
    try {
      const all = await userService.getAllUsers();
      setUsers(all);
    } catch (e) {
      console.error('Failed to load users:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (uid: string, newRole: string) => {
    const ok = await userService.updateUser(uid, { role: newRole as any });
    if (ok) {
      toast.success('تم تحديث دور المستخدم بنجاح');
      loadUsers();
    } else {
      toast.error('تعذر تحديث دور المستخدم');
    }
  };

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const nameStr = (u.fullName || '').toLowerCase();
    const busStr = (u.businessName || '').toLowerCase();
    const phoneStr = (u.phone || '').toLowerCase();
    const emailStr = (u.email || '').toLowerCase();
    const s = search.toLowerCase();
    const matchesSearch =
      nameStr.includes(s) || busStr.includes(s) || phoneStr.includes(s) || emailStr.includes(s);
    return matchesRole && matchesSearch;
  });

  return (
    <AppLayout activeRoute="/admin-users">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-foreground font-arabic">إدارة المستخدمين والحسابات</h1>
            <p className="text-xs text-muted-foreground font-arabic mt-1">
              متابعة حسابات أصحاب المحلات، كبار الموردين، وإدارة الصلاحيات
            </p>
          </div>
          <div className="text-xs bg-card border border-border px-3.5 py-2 rounded-xl text-muted-foreground font-arabic flex items-center gap-2">
            <span>إجمالي الحسابات:</span>
            <span className="font-bold text-foreground">{users.length}</span>
          </div>
        </div>

        {/* Search & Role Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم، اسم المحل/الشركة، الهاتف، أو البريد الإلكتروني..."
              className="w-full bg-card border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'جميع الحسابات' },
              { id: 'retailer', label: 'أصحاب المحلات (تجزئة)' },
              { id: 'supplier', label: 'كبار الموردين (جملة)' },
              { id: 'admin', label: 'مدراء النظام' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-arabic transition-colors ${
                  roleFilter === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table / List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-card border border-border rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <Users size={40} className="mx-auto text-muted-foreground/30 mb-3" />
            <h3 className="text-base font-bold text-foreground font-arabic">لا يوجد مستخدمون مطابقون للبحث</h3>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm divide-y divide-border">
            {filtered.map((u) => {
              const roleArabic =
                u.role === 'retailer'
                  ? 'صاحب محل'
                  : u.role === 'supplier'
                  ? 'مورد جملة'
                  : u.role === 'admin'
                  ? 'مدير نظام'
                  : u.role;

              const roleColor =
                u.role === 'retailer'
                  ? 'bg-emerald-500/10 text-emerald-600'
                  : u.role === 'supplier'
                  ? 'bg-blue-500/10 text-blue-600'
                  : 'bg-purple-500/10 text-purple-600';

              return (
                <div
                  key={u.uid}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded font-arabic ${roleColor}`}>
                        {roleArabic}
                      </span>
                      {u.businessName && (
                        <span className="text-xs font-bold text-foreground font-arabic">
                          {u.businessName}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-foreground font-arabic">{u.fullName || 'مستخدم بدون اسم'}</h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-arabic mt-1">
                      {u.phone && (
                        <span className="flex items-center gap-1" dir="ltr">
                          <Phone size={11} />
                          {u.phone}
                        </span>
                      )}
                      {u.email && (
                        <span className="flex items-center gap-1">
                          <Mail size={11} />
                          {u.email}
                        </span>
                      )}
                      {u.city && <span>المدينة: {u.city}</span>}
                    </div>
                  </div>

                  {/* Role Switcher */}
                  <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-border">
                    <span className="text-xs text-muted-foreground font-arabic">تغيير الدور:</span>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                      className="bg-background border border-border rounded-xl px-3 py-1.5 text-xs font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                    >
                      <option value="retailer">صاحب محل</option>
                      <option value="supplier">مورد جملة</option>
                      <option value="admin">مدير نظام</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
