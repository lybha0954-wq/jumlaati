'use client';
import React, { useState } from 'react';
import { Truck, MapPin, Plus, Edit2, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  city: string;
  fee: number;
  minOrder: number;
  estimatedTime: string;
  active: boolean;
  ordersCount: number;
}

const initialZones: Zone[] = [
  { id: 'z1', name: 'المنطقة الخضراء', city: 'بغداد - الكرخ', fee: 3000, minOrder: 50000, estimatedTime: '٢-٤ ساعات', active: true, ordersCount: 142 },
  { id: 'z2', name: 'الرصافة الشمالية', city: 'بغداد - الرصافة', fee: 3500, minOrder: 50000, estimatedTime: '٣-٥ ساعات', active: true, ordersCount: 98 },
  { id: 'z3', name: 'الجادرية والدورة', city: 'بغداد - الجنوب', fee: 4000, minOrder: 75000, estimatedTime: '٤-٦ ساعات', active: true, ordersCount: 67 },
  { id: 'z4', name: 'المدينة الطبية', city: 'بغداد - الوسط', fee: 2500, minOrder: 40000, estimatedTime: '١-٣ ساعات', active: true, ordersCount: 211 },
  { id: 'z5', name: 'أبو غريب', city: 'بغداد - الغرب', fee: 6000, minOrder: 100000, estimatedTime: '٥-٨ ساعات', active: false, ordersCount: 23 },
  { id: 'z6', name: 'الكاظمية', city: 'بغداد - الشمال', fee: 3000, minOrder: 50000, estimatedTime: '٢-٤ ساعات', active: true, ordersCount: 88 },
  { id: 'z7', name: 'الموصل المركز', city: 'نينوى', fee: 8000, minOrder: 150000, estimatedTime: '٢٤-٤٨ ساعة', active: true, ordersCount: 34 },
  { id: 'z8', name: 'البصرة القديمة', city: 'البصرة', fee: 9000, minOrder: 150000, estimatedTime: '٢٤-٤٨ ساعة', active: false, ordersCount: 12 },
];

export default function DeliveryZonesContent() {
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFee, setEditFee] = useState('');

  const filtered = zones.filter(
    (z) => z.name.includes(search) || z.city.includes(search)
  );

  const toggleActive = (id: string) => {
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, active: !z.active } : z)));
  };

  const startEdit = (zone: Zone) => {
    setEditingId(zone.id);
    setEditFee(String(zone.fee));
  };

  const saveEdit = (id: string) => {
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, fee: Number(editFee) } : z)));
    setEditingId(null);
  };

  const totalActive = zones.filter((z) => z.active).length;
  const totalOrders = zones.reduce((s, z) => s + z.ordersCount, 0);
  const avgFee = Math.round(zones.reduce((s, z) => s + z.fee, 0) / zones.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">التوصيل والمناطق</h1>
          <p className="text-sm text-muted-foreground font-arabic mt-0.5">إدارة مناطق التوزيع ورسوم التوصيل</p>
        </div>
        <button className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg text-sm font-arabic font-semibold hover:bg-accent/90 transition-colors">
          <Plus size={16} />
          إضافة منطقة
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'المناطق الكلية', value: zones.length, icon: MapPin, bg: 'bg-blue-50 border-blue-200', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
          { label: 'المناطق النشطة', value: totalActive, icon: CheckCircle, bg: 'bg-emerald-50 border-emerald-200', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
          { label: 'متوسط رسوم التوصيل', value: `${avgFee.toLocaleString()} د.ع`, icon: Truck, bg: 'bg-amber-50 border-amber-200', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
          { label: 'إجمالي الطلبات', value: totalOrders, icon: Truck, bg: 'bg-violet-50 border-violet-200', iconBg: 'bg-violet-100', iconColor: 'text-violet-600' },
        ].map((kpi, i) => {
          const KpiIcon = kpi.icon;
          return (
            <div key={i} className={`rounded-xl border p-4 ${kpi.bg}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground font-arabic">{kpi.label}</p>
                <div className={`rounded-lg p-1.5 ${kpi.iconBg}`}>
                  <KpiIcon size={14} className={kpi.iconColor} />
                </div>
              </div>
              <p className="text-xl font-bold text-foreground font-arabic tabular-nums">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="ابحث عن منطقة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pr-9 pl-4 py-2 border border-border rounded-lg text-sm font-arabic bg-background focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {/* Zones Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                {['المنطقة', 'المدينة', 'رسوم التوصيل', 'الحد الأدنى للطلب', 'وقت التوصيل', 'الطلبات', 'الحالة', 'إجراءات'].map((h) => (
                  <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground font-arabic">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((zone) => (
                <tr key={zone.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <MapPin size={14} className="text-blue-600" />
                      </div>
                      <span className="font-semibold text-foreground font-arabic">{zone.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-arabic">{zone.city}</td>
                  <td className="px-4 py-3">
                    {editingId === zone.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={editFee}
                          onChange={(e) => setEditFee(e.target.value)}
                          className="w-24 border border-accent rounded px-2 py-1 text-sm focus:outline-none"
                        />
                        <button onClick={() => saveEdit(zone.id)} className="text-emerald-600 hover:text-emerald-700 text-xs font-arabic">حفظ</button>
                      </div>
                    ) : (
                      <span className="font-semibold text-foreground font-arabic tabular-nums">{zone.fee.toLocaleString()} د.ع</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-arabic tabular-nums">{zone.minOrder.toLocaleString()} د.ع</td>
                  <td className="px-4 py-3 text-muted-foreground font-arabic">{zone.estimatedTime}</td>
                  <td className="px-4 py-3 text-foreground font-arabic tabular-nums">{zone.ordersCount}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(zone.id)}
                      className={`inline-flex items-center gap-1 text-xs font-arabic font-semibold px-2.5 py-1 rounded-full transition-colors ${
                        zone.active
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                    >
                      {zone.active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {zone.active ? 'نشطة' : 'معطلة'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(zone)}
                        className="text-muted-foreground hover:text-accent transition-colors"
                        title="تعديل الرسوم"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button className="text-muted-foreground hover:text-red-500 transition-colors" title="حذف">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground font-arabic">لا توجد مناطق مطابقة للبحث</div>
        )}
      </div>
    </div>
  );
}
