'use client';
import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, MapPin, Phone, Building2, Calendar } from 'lucide-react';
import Modal from '@/components/ui/Modal';

interface Applicant {
  id: string;
  name: string;
  type: 'supplier' | 'retailer';
  owner: string;
  phone: string;
  city: string;
  category: string;
  registeredAt: string;
  status: 'pending';
}

const pendingSuppliers: Applicant[] = [
  { id: 'sup-1', name: 'شركة الفرات للمواد الغذائية', type: 'supplier', owner: 'كريم عبد الله', phone: '07701234567', city: 'بغداد', category: 'مواد غذائية جافة', registeredAt: '٢٠٢٦/٠٨/٠٣', status: 'pending' },
  { id: 'sup-2', name: 'مستودع النخيل للتوزيع', type: 'supplier', owner: 'سامر الموسوي', phone: '07809876543', city: 'البصرة', category: 'مشروبات ومياه', registeredAt: '٢٠٢٦/٠٨/٠٢', status: 'pending' },
  { id: 'sup-3', name: 'مجمع الرافدين التجاري', type: 'supplier', owner: 'لؤي حسين', phone: '07711122334', city: 'الموصل', category: 'منتجات الألبان', registeredAt: '٢٠٢٦/٠٨/٠١', status: 'pending' },
  { id: 'sup-4', name: 'شركة بابل للتوزيع', type: 'supplier', owner: 'علي الشمري', phone: '07801234321', city: 'كربلاء', category: 'حلويات وسكاكر', registeredAt: '٢٠٢٦/٠٧/٣١', status: 'pending' },
];

const pendingRetailers: Applicant[] = [
  { id: 'ret-1', name: 'سوبرماركت الأمل', type: 'retailer', owner: 'حسن البقالي', phone: '07712345678', city: 'بغداد - الكرادة', category: 'سوبرماركت', registeredAt: '٢٠٢٦/٠٨/٠٣', status: 'pending' },
  { id: 'ret-2', name: 'بقالة الزهراء', type: 'retailer', owner: 'أم محمد', phone: '07801122334', city: 'بغداد - الأعظمية', category: 'بقالة', registeredAt: '٢٠٢٦/٠٨/٠٢', status: 'pending' },
  { id: 'ret-3', name: 'مول الفردوس', type: 'retailer', owner: 'طارق العبيدي', phone: '07711223344', city: 'النجف', category: 'هايبرماركت', registeredAt: '٢٠٢٦/٠٨/٠١', status: 'pending' },
  { id: 'ret-4', name: 'دكان أبو علي', type: 'retailer', owner: 'علي كاظم', phone: '07809988776', city: 'كركوك', category: 'بقالة', registeredAt: '٢٠٢٦/٠٧/٣٠', status: 'pending' },
  { id: 'ret-5', name: 'سوبرماركت الوفاء', type: 'retailer', owner: 'نور الدين', phone: '07712233445', city: 'الحلة', category: 'سوبرماركت', registeredAt: '٢٠٢٦/٠٧/٢٩', status: 'pending' },
];

interface PendingApprovalsProps {
  activeTab: 'suppliers' | 'retailers';
  onTabChange: (tab: 'suppliers' | 'retailers') => void;
}

export default function PendingApprovals({ activeTab, onTabChange }: PendingApprovalsProps) {
  const [items, setItems] = useState({ suppliers: pendingSuppliers, retailers: pendingRetailers });
  const [viewItem, setViewItem] = useState<Applicant | null>(null);
  const [rejectItem, setRejectItem] = useState<Applicant | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionedIds, setActionedIds] = useState<Record<string, 'approved' | 'rejected'>>({});

  const currentList = activeTab === 'suppliers' ? items.suppliers : items.retailers;

  const handleApprove = (item: Applicant) => {
    setActionedIds((prev) => ({ ...prev, [item.id]: 'approved' }));
    setTimeout(() => {
      setItems((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((i) => i.id !== item.id),
      }));
      setActionedIds((prev) => { const n = { ...prev }; delete n[item.id]; return n; });
    }, 800);
  };

  const handleRejectConfirm = () => {
    if (!rejectItem) return;
    setActionedIds((prev) => ({ ...prev, [rejectItem.id]: 'rejected' }));
    setTimeout(() => {
      setItems((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((i) => i.id !== rejectItem.id),
      }));
      setActionedIds((prev) => { const n = { ...prev }; delete n[rejectItem.id]; return n; });
      setRejectItem(null);
      setRejectReason('');
    }, 800);
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-arabic font-bold text-base text-foreground">طلبات التسجيل المعلقة</h2>
          <p className="text-xs text-muted-foreground font-arabic mt-0.5">مراجعة وقبول أو رفض الطلبات الجديدة</p>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => onTabChange('suppliers')}
            className={`px-3 py-1.5 rounded-md text-xs font-arabic font-semibold transition-all ${
              activeTab === 'suppliers' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            الموردون
            <span className="mr-1.5 bg-red-100 text-red-600 text-xs rounded-full px-1.5 py-0.5 font-bold">
              {items.suppliers.length}
            </span>
          </button>
          <button
            onClick={() => onTabChange('retailers')}
            className={`px-3 py-1.5 rounded-md text-xs font-arabic font-semibold transition-all ${
              activeTab === 'retailers' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            المحلات
            <span className="mr-1.5 bg-red-100 text-red-600 text-xs rounded-full px-1.5 py-0.5 font-bold">
              {items.retailers.length}
            </span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {currentList.length === 0 ? (
          <div className="py-16 text-center">
            <CheckCircle size={40} className="text-emerald-400 mx-auto mb-3" />
            <p className="font-arabic text-muted-foreground text-sm">لا توجد طلبات معلقة</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-right px-4 py-3 font-arabic font-semibold text-muted-foreground text-xs">الاسم</th>
                <th className="text-right px-4 py-3 font-arabic font-semibold text-muted-foreground text-xs">المالك</th>
                <th className="text-right px-4 py-3 font-arabic font-semibold text-muted-foreground text-xs hidden md:table-cell">المدينة</th>
                <th className="text-right px-4 py-3 font-arabic font-semibold text-muted-foreground text-xs hidden lg:table-cell">التصنيف</th>
                <th className="text-right px-4 py-3 font-arabic font-semibold text-muted-foreground text-xs hidden lg:table-cell">تاريخ التسجيل</th>
                <th className="text-center px-4 py-3 font-arabic font-semibold text-muted-foreground text-xs">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentList.map((item) => {
                const actioned = actionedIds[item.id];
                return (
                  <tr
                    key={item.id}
                    className={`transition-all ${
                      actioned === 'approved' ? 'bg-emerald-50' :
                      actioned === 'rejected'? 'bg-red-50' : 'hover:bg-muted/30'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Building2 size={14} className="text-primary" />
                        </div>
                        <span className="font-arabic font-medium text-foreground text-sm">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Phone size={12} className="text-muted-foreground" />
                        <div>
                          <p className="font-arabic text-sm text-foreground">{item.owner}</p>
                          <p className="text-xs text-muted-foreground tabular-nums">{item.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin size={12} />
                        <span className="font-arabic text-sm">{item.city}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-arabic font-semibold px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar size={12} />
                        <span className="font-arabic text-xs">{item.registeredAt}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewItem(item)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleApprove(item)}
                          disabled={!!actioned}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors text-xs font-arabic font-semibold disabled:opacity-50"
                        >
                          <CheckCircle size={13} />
                          {actioned === 'approved' ? 'تمت الموافقة' : 'قبول'}
                        </button>
                        <button
                          onClick={() => { setRejectItem(item); setRejectReason(''); }}
                          disabled={!!actioned}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors text-xs font-arabic font-semibold disabled:opacity-50"
                        >
                          <XCircle size={13} />
                          {actioned === 'rejected' ? 'تم الرفض' : 'رفض'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* View Detail Modal */}
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="تفاصيل طلب التسجيل" size="md">
        {viewItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 size={22} className="text-primary" />
              </div>
              <div>
                <h3 className="font-arabic font-bold text-foreground">{viewItem.name}</h3>
                <p className="text-xs text-muted-foreground font-arabic">{viewItem.type === 'supplier' ? 'مورد' : 'محل تجاري'} — {viewItem.category}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'المالك', value: viewItem.owner },
                { label: 'رقم الهاتف', value: viewItem.phone },
                { label: 'المدينة', value: viewItem.city },
                { label: 'تاريخ التسجيل', value: viewItem.registeredAt },
              ].map((row) => (
                <div key={row.label} className="bg-muted/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground font-arabic mb-1">{row.label}</p>
                  <p className="font-arabic font-semibold text-foreground text-sm">{row.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => { handleApprove(viewItem); setViewItem(null); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 text-white font-arabic font-semibold text-sm hover:bg-emerald-600 transition-colors"
              >
                <CheckCircle size={16} /> قبول الطلب
              </button>
              <button
                onClick={() => { setRejectItem(viewItem); setViewItem(null); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 text-white font-arabic font-semibold text-sm hover:bg-red-600 transition-colors"
              >
                <XCircle size={16} /> رفض الطلب
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Reason Modal */}
      <Modal
        open={!!rejectItem}
        onClose={() => setRejectItem(null)}
        title="سبب الرفض"
        size="sm"
        footer={
          <div className="flex gap-2">
            <button
              onClick={handleRejectConfirm}
              className="flex-1 py-2 rounded-lg bg-red-500 text-white font-arabic font-semibold text-sm hover:bg-red-600 transition-colors"
            >
              تأكيد الرفض
            </button>
            <button
              onClick={() => setRejectItem(null)}
              className="flex-1 py-2 rounded-lg bg-muted text-foreground font-arabic font-semibold text-sm hover:bg-muted/80 transition-colors"
            >
              إلغاء
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="font-arabic text-sm text-muted-foreground">
            أدخل سبب رفض طلب <span className="font-semibold text-foreground">{rejectItem?.name}</span>
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="اكتب سبب الرفض هنا..."
            rows={4}
            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-arabic text-foreground bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </Modal>
    </div>
  );
}
