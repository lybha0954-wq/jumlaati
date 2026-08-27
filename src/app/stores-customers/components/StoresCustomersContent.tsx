'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Store, Search, CheckCircle, XCircle, Clock, Eye, MapPin } from 'lucide-react';
import { storeService, type Store as StoreRecord } from '@/lib/services/storeService';
import { CURRENCY } from '@/lib/commissionStore';
import { toast } from 'sonner';

const statusConfig = {
  active: { label: 'نشط', icon: CheckCircle, cls: 'bg-emerald-100 text-emerald-700' },
  pending: { label: 'قيد المراجعة', icon: Clock, cls: 'bg-amber-100 text-amber-700' },
  suspended: { label: 'موقوف', icon: XCircle, cls: 'bg-red-100 text-red-600' },
};

export default function StoresCustomersContent() {
  const [stores, setStores] = useState<StoreRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [selected, setSelected] = useState<StoreRecord | null>(null);

  const loadStores = useCallback(async () => {
    try {
      const data = await storeService.getAll();
      setStores(data);
    } catch {
      toast.error('فشل تحميل المحلات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStores(); }, [loadStores]);

  const filtered = stores.filter((s) => {
    const matchSearch = s.name.includes(search) || s.owner.includes(search) || s.city.includes(search);
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: stores.length,
    active: stores.filter((s) => s.status === 'active').length,
    pending: stores.filter((s) => s.status === 'pending').length,
    suspended: stores.filter((s) => s.status === 'suspended').length,
  };

  const handleStatusChange = async (id: string, newStatus: StoreRecord['status']) => {
    try {
      await storeService.updateStatus(id, newStatus);
      setStores((prev) => prev.map((s) => s.id === id ? { ...s, status: newStatus } : s));
      setSelected(null);
      toast.success('تم تحديث حالة المحل');
    } catch {
      toast.error('فشل تحديث الحالة');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">المحلات والعملاء</h1>
          <p className="text-sm text-muted-foreground font-arabic mt-0.5">قائمة محلات السوبرماركت المسجلة وحالتهم</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-arabic text-muted-foreground bg-muted/40 border border-border px-3 py-1.5 rounded-lg">
          <Store size={15} />
          <span>{stores.length} محل مسجل</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي المحلات', value: stores.length, bg: 'bg-blue-50 border-blue-200' },
          { label: 'المحلات النشطة', value: counts.active, bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'قيد المراجعة', value: counts.pending, bg: 'bg-amber-50 border-amber-200' },
          { label: 'الموقوفة', value: counts.suspended, bg: 'bg-red-50 border-red-200' },
        ].map((kpi, i) => (
          <div key={i} className={`rounded-xl border p-4 ${kpi.bg}`}>
            <p className="text-xs font-semibold text-muted-foreground font-arabic mb-2">{kpi.label}</p>
            <p className="text-2xl font-bold text-foreground font-arabic tabular-nums">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث بالاسم أو المالك أو المدينة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-9 pl-4 py-2 border border-border rounded-lg text-sm font-arabic bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'pending', 'suspended'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-arabic font-semibold transition-colors ${
                statusFilter === s ? 'bg-accent text-white' : 'bg-muted/40 text-muted-foreground hover:bg-muted'
              }`}
            >
              {s === 'all' ? `الكل (${counts.all})` : s === 'active' ? `نشط (${counts.active})` : s === 'pending' ? `مراجعة (${counts.pending})` : `موقوف (${counts.suspended})`}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  {['المحل', 'المالك', 'المدينة', 'تاريخ الانضمام', 'الطلبات', 'إجمالي الإنفاق', 'الحالة', 'تفاصيل'].map((h) => (
                    <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground font-arabic">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((store) => {
                  const sc = statusConfig[store.status];
                  const StatusIcon = sc.icon;
                  return (
                    <tr key={store.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                            <Store size={16} className="text-amber-600" />
                          </div>
                          <span className="font-semibold text-foreground font-arabic">{store.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-arabic">{store.owner}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-muted-foreground font-arabic">
                          <MapPin size={12} />
                          {store.city}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-arabic tabular-nums">{store.joinDate}</td>
                      <td className="px-4 py-3 text-foreground font-arabic tabular-nums">{store.totalOrders}</td>
                      <td className="px-4 py-3 font-semibold text-foreground font-arabic tabular-nums">
                        {store.totalSpent > 0 ? `${(store.totalSpent / 1000000).toFixed(1)}م ${CURRENCY}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-arabic font-semibold px-2.5 py-1 rounded-full ${sc.cls}`}>
                          <StatusIcon size={11} />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelected(store)}
                          className="text-muted-foreground hover:text-accent transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground font-arabic">لا توجد نتائج مطابقة</div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground font-arabic">{selected.name}</h2>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                <XCircle size={20} />
              </button>
            </div>
            <div className="space-y-3 text-sm font-arabic">
              {[
                { label: 'المالك', value: selected.owner },
                { label: 'الهاتف', value: selected.phone },
                { label: 'المدينة', value: selected.city },
                { label: 'تاريخ الانضمام', value: selected.joinDate },
                { label: 'إجمالي الطلبات', value: `${selected.totalOrders} طلب` },
                { label: 'إجمالي الإنفاق', value: selected.totalSpent > 0 ? `${selected.totalSpent.toLocaleString()} ${CURRENCY}` : '—' },
                { label: 'حد الائتمان', value: selected.creditLimit > 0 ? `${selected.creditLimit.toLocaleString()} ${CURRENCY}` : 'غير محدد' },
              ].map((row) => (
                <div key={row.label} className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-semibold text-foreground">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleStatusChange(selected.id, 'active')}
                className="flex-1 bg-accent text-white py-2 rounded-lg text-sm font-arabic font-semibold hover:bg-accent/90 transition-colors"
              >
                تفعيل
              </button>
              <button
                onClick={() => handleStatusChange(selected.id, 'suspended')}
                className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg text-sm font-arabic font-semibold hover:bg-red-200 transition-colors"
              >
                إيقاف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
