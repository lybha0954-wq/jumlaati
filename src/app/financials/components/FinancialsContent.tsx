'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, DollarSign, Percent, ShoppingBag, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CURRENCY, COMMISSION_RATE } from '@/lib/commissionStore';

import { createClient } from '@/lib/supabase/client';

interface MonthlyData {
  month: string;
  revenue: number;
  commission: number;
  orders: number;
}

const MONTH_NAMES = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

export default function FinancialsContent() {
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [topSuppliers, setTopSuppliers] = useState<{ name: string; commission: number; orders: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    try {
      const now = new Date();
      const year = now.getFullYear();

      // Fetch orders grouped by month
      const { data: ordersData } = await supabase
        .from('orders')
        .select('total, commission, placed_at, status')
        .gte('placed_at', `${year}-01-01`)
        .neq('status', 'cancelled');

      const orders = ordersData ?? [];

      // Build monthly buckets
      const buckets: Record<number, MonthlyData> = {};
      for (let m = 0; m < 12; m++) {
        buckets[m] = { month: MONTH_NAMES[m], revenue: 0, commission: 0, orders: 0 };
      }
      orders.forEach((o: any) => {
        let m = new Date(o.placed_at).getMonth();
        buckets[m].revenue += o.total ?? 0;
        buckets[m].commission += o.commission ?? (o.total ?? 0) * COMMISSION_RATE;
        buckets[m].orders += 1;
      });

      // Only show months up to current month
      const currentMonth = now.getMonth();
      const filled = Object.values(buckets).slice(0, currentMonth + 1).filter((d) => d.orders > 0 || d.revenue > 0);
      setMonthlyData(filled.length > 0 ? filled : Object.values(buckets).slice(0, 6));

      // Top suppliers by commission from commissions table
      const { data: commData } = await supabase
        .from('commissions')
        .select('retailer_name, commission, order_total');

      const supplierMap: Record<string, { commission: number; orders: number }> = {};
      (commData ?? []).forEach((c: any) => {
        const name = c.retailer_name ?? 'غير محدد';
        if (!supplierMap[name]) supplierMap[name] = { commission: 0, orders: 0 };
        supplierMap[name].commission += c.commission ?? 0;
        supplierMap[name].orders += 1;
      });

      const sorted = Object.entries(supplierMap)
        .map(([name, v]) => ({ name, ...v }))
        .sort((a, b) => b.commission - a.commission)
        .slice(0, 5);
      setTopSuppliers(sorted);
      setLastUpdated(new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }));
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const totalRevenue = monthlyData.reduce((s, d) => s + d.revenue, 0);
  const totalCommission = monthlyData.reduce((s, d) => s + d.commission, 0);
  const totalOrders = monthlyData.reduce((s, d) => s + d.orders, 0);
  const avgCommissionRate = totalRevenue > 0 ? ((totalCommission / totalRevenue) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">الحسابات المالية والتقارير</h1>
          <p className="text-sm text-muted-foreground font-arabic mt-0.5">
            ملخص أرباح المنصة والعمولات المقبوضة
            {lastUpdated && <span className="mr-2 text-xs text-accent">· آخر تحديث: {lastUpdated}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            title="تحديث البيانات"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          {(['month', 'quarter', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-arabic font-semibold transition-colors ${
                period === p ? 'bg-accent text-white' : 'bg-muted/40 text-muted-foreground hover:bg-muted'
              }`}
            >
              {p === 'month' ? 'شهري' : p === 'quarter' ? 'ربع سنوي' : 'سنوي'}
            </button>
          ))}
        </div>
      </div>

      {/* Live commission notice */}
      {totalOrders > 0 && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <p className="font-arabic text-sm text-emerald-700">
            إجمالي عمولات المنصة:{' '}
            <span className="font-bold">{totalCommission.toLocaleString('ar-IQ')} {CURRENCY}</span>{' '}
            من <span className="font-bold">{totalOrders}</span> طلب (نسبة {(COMMISSION_RATE * 100).toFixed(0)}٪)
          </p>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي المبيعات', value: totalRevenue > 0 ? `${(totalRevenue / 1000000).toFixed(1)}م` : '—', unit: CURRENCY, trend: '+١٢٪', up: true, bg: 'bg-blue-50 border-blue-200', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', icon: ShoppingBag },
          { label: 'عمولات المنصة', value: totalCommission > 0 ? `${(totalCommission / 1000000).toFixed(2)}م` : '—', unit: CURRENCY, trend: totalOrders > 0 ? `${totalOrders} طلب` : '+٨٪', up: true, bg: 'bg-emerald-50 border-emerald-200', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', icon: DollarSign },
          { label: 'معدل العمولة', value: `${avgCommissionRate}٪`, unit: '', trend: 'ثابت', up: true, bg: 'bg-violet-50 border-violet-200', iconBg: 'bg-violet-100', iconColor: 'text-violet-600', icon: Percent },
          { label: 'إجمالي الطلبات', value: totalOrders, unit: 'طلب', trend: '+٢٣٪', up: true, bg: 'bg-amber-50 border-amber-200', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', icon: TrendingUp },
        ].map((kpi, i) => {
          const KpiIcon = kpi.icon;
          return (
            <div key={i} className={`rounded-xl border p-4 ${kpi.bg}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground font-arabic leading-tight">{kpi.label}</p>
                <div className={`rounded-lg p-1.5 ${kpi.iconBg}`}>
                  <KpiIcon size={14} className={kpi.iconColor} />
                </div>
              </div>
              <p className="text-xl font-bold text-foreground font-arabic tabular-nums">
                {kpi.value}
                {kpi.unit && <span className="text-xs font-normal text-muted-foreground mr-1">{kpi.unit}</span>}
              </p>
              <div className={`flex items-center gap-1 mt-1 text-xs font-arabic font-medium ${kpi.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.trend}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue & Commission Area Chart */}
        <div className="xl:col-span-2 bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-bold text-foreground font-arabic mb-4">المبيعات والعمولات الشهرية</h2>
          {loading ? (
            <div className="flex items-center justify-center h-[220px]">
              <div className="w-7 h-7 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="comGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'inherit' }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}م`} />
                <Tooltip formatter={(v: number) => `${v.toLocaleString()} ${CURRENCY}`} />
                <Area type="monotone" dataKey="revenue" name="المبيعات" stroke="#3b82f6" fill="url(#revGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="commission" name="العمولات" stroke="#10b981" fill="url(#comGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Commissions */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-bold text-foreground font-arabic mb-4">أعلى الموردين عمولةً</h2>
          {topSuppliers.length === 0 ? (
            <p className="font-arabic text-sm text-muted-foreground text-center py-8">لا توجد بيانات بعد</p>
          ) : (
            <div className="space-y-3">
              {topSuppliers.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-arabic">
                    <span className="text-foreground font-medium truncate max-w-[140px]">{item.name}</span>
                    <span className="text-emerald-600 font-semibold tabular-nums">{(item.commission / 1000).toFixed(0)}ك {CURRENCY}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${topSuppliers[0].commission > 0 ? (item.commission / topSuppliers[0].commission) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-base font-bold text-foreground font-arabic">التفصيل الشهري</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {['الشهر', 'إجمالي المبيعات', 'عمولة المنصة', 'عدد الطلبات', 'معدل العمولة'].map((h) => (
                  <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground font-arabic">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {monthlyData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center font-arabic text-muted-foreground text-sm">لا توجد بيانات</td>
                </tr>
              ) : (
                monthlyData.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-semibold text-foreground font-arabic">{row.month}</td>
                    <td className="px-4 py-3 text-foreground font-arabic tabular-nums">{row.revenue.toLocaleString()} {CURRENCY}</td>
                    <td className="px-4 py-3 text-emerald-600 font-semibold font-arabic tabular-nums">{row.commission.toLocaleString()} {CURRENCY}</td>
                    <td className="px-4 py-3 text-foreground font-arabic tabular-nums">{row.orders}</td>
                    <td className="px-4 py-3 text-violet-600 font-semibold font-arabic tabular-nums">
                      {row.revenue > 0 ? ((row.commission / row.revenue) * 100).toFixed(1) : '0.0'}٪
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
