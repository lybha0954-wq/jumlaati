'use client';
import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingBag, Store, Percent, Truck } from 'lucide-react';
export default function AdminKPIRow() {
  const [totalCommission, setTotalCommission] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [storeCount, setStoreCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  useEffect(() => {
    financialService?.getTotals()?.then(({ totalCommission: tc, totalSales: ts, totalOrders: to }) => {
      setTotalCommission(tc);
      setTotalSales(ts);
      setTotalOrders(to);
    })?.catch(() => {});

    storeService?.getAll()?.then((stores) => setStoreCount(stores?.length))?.catch(() => {});
    supplierService?.getAll()?.then((sups) => setSupplierCount(sups?.filter((s) => s?.isActive)?.length))?.catch(() => {});
    orderService?.getIncomingOrders()?.then((orders) => {
      setPendingOrders(orders?.filter((o) => o?.status === 'reviewing')?.length);
    })?.catch(() => {});
  }, []);

  const kpis = [
    {
      id: 'kpi-sales',
      label: 'إجمالي المبيعات',
      value: totalSales?.toLocaleString('ar-IQ'),
      unit: CURRENCY,
      trend: '+١٢٪',
      trendUp: true,
      icon: ShoppingBag,
      bg: 'bg-blue-50 border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      id: 'kpi-commission',
      label: 'عمولات المنصة',
      value: totalCommission?.toLocaleString('ar-IQ'),
      unit: CURRENCY,
      trend: '+٨٪',
      trendUp: true,
      icon: Percent,
      bg: 'bg-emerald-50 border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      id: 'kpi-suppliers',
      label: 'الموردون النشطون',
      value: supplierCount?.toString(),
      unit: '',
      trend: '+٣ هذا الشهر',
      trendUp: true,
      icon: Truck,
      bg: 'bg-violet-50 border-violet-200',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
    },
    {
      id: 'kpi-retailers',
      label: 'المحلات المسجلة',
      value: storeCount?.toString(),
      unit: '',
      trend: '+١٧ هذا الشهر',
      trendUp: true,
      icon: Store,
      bg: 'bg-amber-50 border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      id: 'kpi-pending',
      label: 'طلبات قيد المراجعة',
      value: pendingOrders?.toString(),
      unit: '',
      trend: 'تحتاج موافقة',
      trendUp: false,
      icon: Users,
      bg: 'bg-red-50 border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      id: 'kpi-orders',
      label: 'الطلبات الكلية',
      value: totalOrders?.toLocaleString('ar-IQ'),
      unit: '',
      trend: '+٢٣٪',
      trendUp: true,
      icon: TrendingUp,
      bg: 'bg-slate-50 border-slate-200',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis?.map((kpi) => {
        const KpiIcon = kpi?.icon;
        return (
          <div key={kpi?.id} className={`rounded-xl border p-4 ${kpi?.bg} transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-muted-foreground font-arabic leading-tight">{kpi?.label}</p>
              <div className={`rounded-lg p-1.5 ${kpi?.iconBg}`}>
                <KpiIcon size={15} className={kpi?.iconColor} />
              </div>
            </div>
            <p className="text-xl font-bold text-foreground tabular-nums font-arabic">
              {kpi?.value}
              {kpi?.unit && <span className="text-xs font-normal text-muted-foreground mr-1">{kpi?.unit}</span>}
            </p>
            <p className={`text-xs mt-1 font-arabic font-medium ${kpi?.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
              {kpi?.trend}
            </p>
          </div>
        );
      })}
    </div>
  );
}
