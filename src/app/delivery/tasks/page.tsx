'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Truck, PackageCheck, MapPin, Phone, Clock, DollarSign, ArrowUpRight, CheckCircle2, Navigation, AlertCircle, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface DeliveryTask {
  id: string;
  orderNumber: string;
  supplierName: string;
  supplierAddress: string;
  supplierPhone: string;
  supermarketName: string;
  supermarketAddress: string;
  supermarketPhone: string;
  itemsCount: number;
  totalWeight: string;
  deliveryFee: number;
  orderAmount: number;
  paymentMethod: 'كاش عند الاستلام' | 'مدفوع مسبقاً' | 'آجل على الحساب';
  status: 'available' | 'assigned' | 'picked_up' | 'delivered';
  timeAgo: string;
}

const initialTasks: DeliveryTask[] = [
  {
    id: 'T-101',
    orderNumber: '#ORD-8821',
    supplierName: 'محل جملة البركة للمواد الغذائية',
    supplierAddress: 'بغداد — الشورجة (سوق الصابون)',
    supplierPhone: '07701234567',
    supermarketName: 'سوبرماركت النخيل الذهبي',
    supermarketAddress: 'بغداد — الكرادة (قرب ساحة كهرمانة)',
    supermarketPhone: '07809876543',
    itemsCount: 18,
    totalWeight: '45 كغم (3 كراتين)',
    deliveryFee: 10000,
    orderAmount: 485000,
    paymentMethod: 'كاش عند الاستلام',
    status: 'assigned',
    timeAgo: 'منذ 15 دقيقة',
  },
  {
    id: 'T-102',
    orderNumber: '#ORD-8825',
    supplierName: 'مستودع الفرات لمستلزمات النظافة بالجملة',
    supplierAddress: 'بغداد — جميلة (شارع الكراتين)',
    supplierPhone: '07712345678',
    supermarketName: 'أسواق ومحل بغداد الجديد',
    supermarketAddress: 'بغداد — زيونة (مقابل مجمع الرضا)',
    supermarketPhone: '07812345678',
    itemsCount: 8,
    totalWeight: '20 كغم',
    deliveryFee: 8000,
    orderAmount: 210000,
    paymentMethod: 'مدفوع مسبقاً',
    status: 'picked_up',
    timeAgo: 'منذ 35 دقيقة',
  },
  {
    id: 'T-103',
    orderNumber: '#ORD-8829',
    supplierName: 'مخازن الرافدين للألبان والمشروبات',
    supplierAddress: 'بغداد — الكرادة (كمب سارة)',
    supplierPhone: '07723456789',
    supermarketName: 'سوبرماركت أروقة دجلة',
    supermarketAddress: 'بغداد — الجادرية (شارع الوزراء)',
    supermarketPhone: '07823456789',
    itemsCount: 24,
    totalWeight: '60 كغم',
    deliveryFee: 12000,
    orderAmount: 650000,
    paymentMethod: 'كاش عند الاستلام',
    status: 'available',
    timeAgo: 'منذ 5 دقائق',
  },
  {
    id: 'T-104',
    orderNumber: '#ORD-8815',
    supplierName: 'جملة البصرة للمعلبات والزيوت',
    supplierAddress: 'بغداد — الشورجة (عقد النصارى)',
    supplierPhone: '07734567890',
    supermarketName: 'ميني ماركت الأمانة',
    supermarketAddress: 'بغداد — المنصور (شارع 14 رمضان)',
    supermarketPhone: '07834567890',
    itemsCount: 12,
    totalWeight: '30 كغم',
    deliveryFee: 9000,
    orderAmount: 340000,
    paymentMethod: 'آجل على الحساب',
    status: 'available',
    timeAgo: 'منذ 20 دقيقة',
  },
];

export default function DeliveryTasksPage() {
  const [tasks, setTasks] = useState<DeliveryTask[]>(initialTasks);
  const [filter, setFilter] = useState<'all' | 'available' | 'active' | 'delivered'>('all');

  const updateStatus = (taskId: string, newStatus: DeliveryTask['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    if (newStatus === 'assigned') {
      toast.success('تم قبول مهمة التوصيل بنجاح!', { description: 'توجه الآن إلى محل الجملة لاستلام البضاعة' });
    } else if (newStatus === 'picked_up') {
      toast.info('تم تأكيد استلام البضاعة من تاجر الجملة', { description: 'توجه إلى السوبرماركت للتسليم' });
    } else if (newStatus === 'delivered') {
      toast.success('تم تسليم البضاعة بنجاح وتحصيل العمولة!', { description: 'تمت إضافة أجر التوصيل إلى محفظتك' });
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'available') return t.status === 'available';
    if (filter === 'active') return t.status === 'assigned' || t.status === 'picked_up';
    if (filter === 'delivered') return t.status === 'delivered';
    return true;
  });

  const totalEarningsToday = tasks
    .filter((t) => t.status === 'delivered')
    .reduce((sum, t) => sum + t.deliveryFee, 45000); // 45,000 IQD baseline delivered earlier

  const activeCount = tasks.filter((t) => t.status === 'assigned' || t.status === 'picked_up').length;
  const availableCount = tasks.filter((t) => t.status === 'available').length;

  return (
    <AppLayout activeRoute="/delivery/tasks">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-arabic font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                لوحة المندوب
              </span>
              <h1 className="text-2xl font-bold font-arabic text-foreground">
                طلبات ومهام التوصيل
              </h1>
            </div>
            <p className="text-sm font-arabic text-muted-foreground mt-1">
              استلم طلبيات البضاعة من محلات الجملة ووصلها للسوبرماركت وزوّد أرباحك اليومية
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-card border border-border rounded-xl px-4 py-2 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <DollarSign size={20} />
              </div>
              <div>
                <span className="text-[11px] font-arabic text-muted-foreground block">أرباح اليوم</span>
                <span className="text-base font-bold font-arabic text-foreground tabular-nums">
                  {totalEarningsToday.toLocaleString('ar-IQ')} د.ع
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <Truck size={22} />
            </div>
            <div>
              <span className="text-xs font-arabic text-muted-foreground block">طلبات قيد التوصيل</span>
              <span className="text-xl font-bold font-arabic text-foreground tabular-nums">{activeCount}</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <Clock size={22} />
            </div>
            <div>
              <span className="text-xs font-arabic text-muted-foreground block">طلبات جاهزة للاستلام</span>
              <span className="text-xl font-bold font-arabic text-foreground tabular-nums">{availableCount}</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <PackageCheck size={22} />
            </div>
            <div>
              <span className="text-xs font-arabic text-muted-foreground block">تم تسليمها اليوم</span>
              <span className="text-xl font-bold font-arabic text-foreground tabular-nums">6 طلبيات</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
              <Navigation size={22} />
            </div>
            <div>
              <span className="text-xs font-arabic text-muted-foreground block">منطقة التغطية الحالية</span>
              <span className="text-sm font-bold font-arabic text-foreground truncate block">الرصافة والكرخ</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-muted rounded-xl p-1 max-w-md">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-arabic font-semibold transition-all ${filter === 'all' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            الكل ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-arabic font-semibold transition-all ${filter === 'active' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            جاري تنفيذها ({activeCount})
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-arabic font-semibold transition-all ${filter === 'available' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            متاحة للاستلام ({availableCount})
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-arabic font-semibold transition-all ${filter === 'delivered' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            مكتملة
          </button>
        </div>

        {/* Tasks List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredTasks.map((t) => {
            const isAssigned = t.status === 'assigned';
            const isPickedUp = t.status === 'picked_up';
            const isDelivered = t.status === 'delivered';
            const isAvailable = t.status === 'available';

            return (
              <div
                key={t.id}
                className="bg-card border border-border rounded-2xl p-5 hover:border-border/80 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-muted px-2 py-1 rounded-md text-foreground">
                        {t.orderNumber}
                      </span>
                      <span className="text-xs font-arabic text-muted-foreground flex items-center gap-1">
                        <Clock size={12} />
                        {t.timeAgo}
                      </span>
                    </div>

                    <div className="text-left">
                      <span className="text-xs font-arabic text-muted-foreground block">أجر التوصيل</span>
                      <span className="font-arabic font-bold text-base text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {t.deliveryFee.toLocaleString('ar-IQ')} د.ع
                      </span>
                    </div>
                  </div>

                  {/* Locations: Supplier & Supermarket */}
                  <div className="space-y-3 mb-4">
                    {/* Supplier */}
                    <div className="flex items-start gap-3 bg-muted/30 p-3 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Truck size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-arabic font-bold text-blue-600 dark:text-blue-400">
                            نقطة الاستلام (محل الجملة)
                          </span>
                          <a
                            href={`tel:${t.supplierPhone}`}
                            className="text-xs font-arabic text-muted-foreground hover:text-foreground flex items-center gap-1"
                          >
                            <Phone size={12} />
                            اتصال
                          </a>
                        </div>
                        <h4 className="font-arabic font-bold text-sm text-foreground truncate mt-0.5">
                          {t.supplierName}
                        </h4>
                        <p className="font-arabic text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin size={12} className="flex-shrink-0" />
                          {t.supplierAddress}
                        </p>
                      </div>
                    </div>

                    {/* Supermarket */}
                    <div className="flex items-start gap-3 bg-muted/30 p-3 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <PackageCheck size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-arabic font-bold text-emerald-600 dark:text-emerald-400">
                            نقطة التسليم (السوبرماركت)
                          </span>
                          <a
                            href={`tel:${t.supermarketPhone}`}
                            className="text-xs font-arabic text-muted-foreground hover:text-foreground flex items-center gap-1"
                          >
                            <Phone size={12} />
                            اتصال
                          </a>
                        </div>
                        <h4 className="font-arabic font-bold text-sm text-foreground truncate mt-0.5">
                          {t.supermarketName}
                        </h4>
                        <p className="font-arabic text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin size={12} className="flex-shrink-0" />
                          {t.supermarketAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Specs */}
                  <div className="grid grid-cols-3 gap-2 bg-muted/20 p-2.5 rounded-xl text-center mb-4">
                    <div>
                      <span className="text-[10px] font-arabic text-muted-foreground block">عدد الأصناف</span>
                      <span className="text-xs font-arabic font-bold text-foreground">{t.itemsCount} صنف</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-arabic text-muted-foreground block">الوزن التقديري</span>
                      <span className="text-xs font-arabic font-bold text-foreground">{t.totalWeight}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-arabic text-muted-foreground block">طريقة الدفع</span>
                      <span className="text-xs font-arabic font-bold text-primary truncate block">{t.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Actions depending on status */}
                <div className="pt-3 border-t border-border flex items-center gap-2">
                  {isAvailable && (
                    <button
                      onClick={() => updateStatus(t.id, 'assigned')}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-arabic font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Truck size={15} />
                      قبول مهمة التوصيل ({t.deliveryFee.toLocaleString('ar-IQ')} د.ع)
                    </button>
                  )}

                  {isAssigned && (
                    <button
                      onClick={() => updateStatus(t.id, 'picked_up')}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-arabic font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <PackageCheck size={15} />
                      تأكيد استلام البضاعة من محل الجملة
                    </button>
                  )}

                  {isPickedUp && (
                    <button
                      onClick={() => updateStatus(t.id, 'delivered')}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-arabic font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={15} />
                      تأكيد تسليم الطلبية للسوبرماركت وتحصيل المبلغ
                    </button>
                  )}

                  {isDelivered && (
                    <div className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-arabic font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-500/20">
                      <CheckCircle2 size={15} />
                      تم التسليم بنجاح وتمت إضافة الأجر لمحفظتك
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
