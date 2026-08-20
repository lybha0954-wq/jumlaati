'use client';
import React, { useState, useMemo } from 'react';
import { Search, Filter, CheckCircle, XCircle, ShieldCheck, ShieldOff, Users, Store, Truck, MapPin, Eye, MoreVertical, UserCheck, UserX } from 'lucide-react';
import Modal from '@/components/ui/Modal';

type AccountStatus = 'active' | 'frozen' | 'pending';
type AccountRole = 'supplier' | 'retailer';

interface Account {
  id: string;
  name: string;
  owner: string;
  role: AccountRole;
  phone: string;
  city: string;
  category: string;
  status: AccountStatus;
  joinedAt: string;
  ordersCount: number;
  verified: boolean;
}

const mockAccounts: Account[] = [
  { id: 'u1', name: 'شركة الفرات للمواد الغذائية', owner: 'كريم عبد الله', role: 'supplier', phone: '07701234567', city: 'بغداد', category: 'مواد غذائية', status: 'active', joinedAt: '٢٠٢٦/٠٣/١٥', ordersCount: 142, verified: true },
  { id: 'u2', name: 'سوبرماركت الأمل', owner: 'حسن البقالي', role: 'retailer', phone: '07712345678', city: 'بغداد - الكرادة', category: 'سوبرماركت', status: 'active', joinedAt: '٢٠٢٦/٠٤/٠٢', ordersCount: 87, verified: true },
  { id: 'u3', name: 'مستودع النخيل للتوزيع', owner: 'سامر الموسوي', role: 'supplier', phone: '07809876543', city: 'البصرة', category: 'مشروبات', status: 'active', joinedAt: '٢٠٢٦/٠٢/٢٠', ordersCount: 211, verified: true },
  { id: 'u4', name: 'بقالة الزهراء', owner: 'أم محمد', role: 'retailer', phone: '07801122334', city: 'بغداد - الأعظمية', category: 'بقالة', status: 'pending', joinedAt: '٢٠٢٦/٠٨/٠٢', ordersCount: 0, verified: false },
  { id: 'u5', name: 'مجمع الرافدين التجاري', owner: 'لؤي حسين', role: 'supplier', phone: '07711122334', city: 'الموصل', category: 'منتجات الألبان', status: 'frozen', joinedAt: '٢٠٢٦/٠١/١٠', ordersCount: 56, verified: true },
  { id: 'u6', name: 'مول الفردوس', owner: 'طارق العبيدي', role: 'retailer', phone: '07711223344', city: 'النجف', category: 'هايبرماركت', status: 'active', joinedAt: '٢٠٢٦/٠٥/١٨', ordersCount: 134, verified: true },
  { id: 'u7', name: 'شركة بابل للتوزيع', owner: 'علي الشمري', role: 'supplier', phone: '07801234321', city: 'كربلاء', category: 'حلويات', status: 'pending', joinedAt: '٢٠٢٦/٠٨/٠١', ordersCount: 0, verified: false },
  { id: 'u8', name: 'دكان أبو علي', owner: 'علي كاظم', role: 'retailer', phone: '07809988776', city: 'كركوك', category: 'بقالة', status: 'active', joinedAt: '٢٠٢٦/٠٦/٠٥', ordersCount: 29, verified: true },
  { id: 'u9', name: 'سوبرماركت الوفاء', owner: 'نور الدين', role: 'retailer', phone: '07712233445', city: 'الحلة', category: 'سوبرماركت', status: 'frozen', joinedAt: '٢٠٢٦/٠٣/٢٢', ordersCount: 45, verified: true },
  { id: 'u10', name: 'مخازن الخليج', owner: 'فيصل الراشد', role: 'supplier', phone: '07700112233', city: 'البصرة', category: 'مواد غذائية', status: 'active', joinedAt: '٢٠٢٦/٠٤/١٤', ordersCount: 178, verified: true },
];

const statusConfig: Record<AccountStatus, { label: string; color: string; bg: string; border: string }> = {
  active:  { label: 'نشط',      color: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-200' },
  frozen:  { label: 'مجمّد',    color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200' },
  pending: { label: 'قيد المراجعة', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
};

export default function AdminUsersContent() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | AccountRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AccountStatus>('all');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return accounts.filter((a) => {
      const matchSearch = !search || a.name.includes(search) || a.owner.includes(search) || a.phone.includes(search);
      const matchRole = roleFilter === 'all' || a.role === roleFilter;
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [accounts, search, roleFilter, statusFilter]);

  const updateStatus = (id: string, status: AccountStatus) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    setActionMenuId(null);
    setSelectedAccount(null);
  };

  const counts = {
    all: accounts.length,
    active: accounts.filter((a) => a.status === 'active').length,
    pending: accounts.filter((a) => a.status === 'pending').length,
    frozen: accounts.filter((a) => a.status === 'frozen').length,
  };

  return (
    <div className="space-y-4 pb-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-bold text-foreground font-arabic">إدارة الحسابات</h1>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">{accounts.length} حساب مسجل في المنصة</p>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'الكل', count: counts.all, color: 'text-foreground', bg: 'bg-muted' },
          { label: 'نشط', count: counts.active, color: 'text-emerald-700', bg: 'bg-emerald-50 border border-emerald-200' },
          { label: 'معلّق', count: counts.pending, color: 'text-amber-700', bg: 'bg-amber-50 border border-amber-200' },
          { label: 'مجمّد', count: counts.frozen, color: 'text-blue-700', bg: 'bg-blue-50 border border-blue-200' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-2.5 text-center`}>
            <p className={`text-lg font-bold font-arabic tabular-nums ${s.color}`}>{s.count}</p>
            <p className={`text-xs font-arabic ${s.color}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث بالاسم، المالك، أو الهاتف..."
          className="w-full bg-card border border-border rounded-xl pr-9 pl-4 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {/* Role Filter */}
        {(['all', 'supplier', 'retailer'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-arabic font-semibold border transition-all ${
              roleFilter === r
                ? 'bg-primary text-white border-primary' :'bg-card text-muted-foreground border-border hover:border-primary/40'
            }`}
          >
            {r === 'all' && <Filter size={12} />}
            {r === 'supplier' && <Truck size={12} />}
            {r === 'retailer' && <Store size={12} />}
            {r === 'all' ? 'الكل' : r === 'supplier' ? 'الموردون' : 'المحلات'}
          </button>
        ))}
        <div className="w-px bg-border flex-shrink-0" />
        {(['all', 'active', 'pending', 'frozen'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-arabic font-semibold border transition-all ${
              statusFilter === s
                ? 'bg-primary text-white border-primary' :'bg-card text-muted-foreground border-border hover:border-primary/40'
            }`}
          >
            {s === 'all' ? 'كل الحالات' : statusConfig[s as AccountStatus]?.label}
          </button>
        ))}
      </div>

      {/* Accounts List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="py-16 text-center bg-card rounded-2xl border border-border">
            <Users size={40} className="text-muted-foreground/40 mx-auto mb-3" />
            <p className="font-arabic text-muted-foreground text-sm">لا توجد نتائج</p>
          </div>
        ) : (
          filtered.map((account) => {
            const sc = statusConfig[account.status];
            return (
              <div key={account.id} className="bg-card rounded-2xl border border-border p-4">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    account.role === 'supplier' ? 'bg-violet-100' : 'bg-blue-100'
                  }`}>
                    {account.role === 'supplier'
                      ? <Truck size={18} className="text-violet-600" />
                      : <Store size={18} className="text-blue-600" />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-arabic font-bold text-sm text-foreground">{account.name}</p>
                      {account.verified && <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground font-arabic mt-0.5">{account.owner} — {account.phone}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`text-xs font-arabic font-semibold px-2 py-0.5 rounded-full border ${sc.color} ${sc.bg} ${sc.border}`}>
                        {sc.label}
                      </span>
                      <span className={`text-xs font-arabic px-2 py-0.5 rounded-full ${
                        account.role === 'supplier' ? 'bg-violet-50 text-violet-700 border border-violet-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {account.role === 'supplier' ? 'مورد' : 'محل'}
                      </span>
                      <span className="text-xs text-muted-foreground font-arabic flex items-center gap-1">
                        <MapPin size={10} /> {account.city}
                      </span>
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => setActionMenuId(actionMenuId === account.id ? null : account.id)}
                      className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    >
                      <MoreVertical size={16} className="text-muted-foreground" />
                    </button>
                    {actionMenuId === account.id && (
                      <div className="absolute left-0 top-9 z-20 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[160px]">
                        <button
                          onClick={() => { setSelectedAccount(account); setActionMenuId(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-arabic text-foreground hover:bg-muted transition-colors"
                        >
                          <Eye size={13} /> عرض التفاصيل
                        </button>
                        {account.status !== 'active' && (
                          <button
                            onClick={() => updateStatus(account.id, 'active')}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-arabic text-emerald-700 hover:bg-emerald-50 transition-colors"
                          >
                            <UserCheck size={13} /> تفعيل الحساب
                          </button>
                        )}
                        {account.status !== 'frozen' && (
                          <button
                            onClick={() => updateStatus(account.id, 'frozen')}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-arabic text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            <ShieldOff size={13} /> تجميد الحساب
                          </button>
                        )}
                        {account.status === 'pending' && (
                          <button
                            onClick={() => updateStatus(account.id, 'active')}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-arabic text-violet-700 hover:bg-violet-50 transition-colors"
                          >
                            <ShieldCheck size={13} /> موافقة على الانضمام
                          </button>
                        )}
                        <button
                          onClick={() => updateStatus(account.id, 'frozen')}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-arabic text-danger hover:bg-red-50 transition-colors border-t border-border"
                        >
                          <UserX size={13} /> إيقاف الحساب
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Action Buttons for Pending */}
                {account.status === 'pending' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <button
                      onClick={() => updateStatus(account.id, 'active')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500 text-white text-xs font-arabic font-semibold hover:bg-emerald-600 transition-colors"
                    >
                      <CheckCircle size={13} /> موافقة
                    </button>
                    <button
                      onClick={() => updateStatus(account.id, 'frozen')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-arabic font-semibold hover:bg-red-100 transition-colors"
                    >
                      <XCircle size={13} /> رفض
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      <Modal open={!!selectedAccount} onClose={() => setSelectedAccount(null)} title="تفاصيل الحساب" size="md">
        {selectedAccount && (
          <div className="space-y-4" dir="rtl">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selectedAccount.role === 'supplier' ? 'bg-violet-100' : 'bg-blue-100'
              }`}>
                {selectedAccount.role === 'supplier'
                  ? <Truck size={22} className="text-violet-600" />
                  : <Store size={22} className="text-blue-600" />
                }
              </div>
              <div>
                <h3 className="font-arabic font-bold text-foreground">{selectedAccount.name}</h3>
                <p className="text-xs text-muted-foreground font-arabic">{selectedAccount.role === 'supplier' ? 'مورد' : 'محل تجاري'} — {selectedAccount.category}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'المالك', value: selectedAccount.owner },
                { label: 'رقم الهاتف', value: selectedAccount.phone },
                { label: 'المدينة', value: selectedAccount.city },
                { label: 'تاريخ الانضمام', value: selectedAccount.joinedAt },
                { label: 'عدد الطلبات', value: selectedAccount.ordersCount.toString() },
                { label: 'الحالة', value: statusConfig[selectedAccount.status].label },
              ].map((row) => (
                <div key={row.label} className="bg-muted/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground font-arabic mb-1">{row.label}</p>
                  <p className="font-arabic font-semibold text-foreground text-sm">{row.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              {selectedAccount.status !== 'active' && (
                <button
                  onClick={() => updateStatus(selectedAccount.id, 'active')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 text-white font-arabic font-semibold text-sm hover:bg-emerald-600 transition-colors"
                >
                  <UserCheck size={16} /> تفعيل
                </button>
              )}
              {selectedAccount.status !== 'frozen' && (
                <button
                  onClick={() => updateStatus(selectedAccount.id, 'frozen')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500 text-white font-arabic font-semibold text-sm hover:bg-blue-600 transition-colors"
                >
                  <ShieldOff size={16} /> تجميد
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
