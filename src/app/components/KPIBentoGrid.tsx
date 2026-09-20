'use client';

import React, { useState, useEffect, useCallback } from 'react';
import MetricCard from '@/components/ui/MetricCard';
import {
  ShoppingCart,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
} from 'lucide-react';
import { orderService } from '@/lib/services/orderService';
import { productService } from '@/lib/services/productService';

interface KPIData {
  todayOrders: number;
  newOrders: number;
  pendingOrders: number;
  lowStockCount: number;
  criticalStockCount: number;
  fulfillmentRate: number;
  avgOrderValue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
}

export default function KPIBentoGrid() {
  const [kpi, setKpi] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadKPIs = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

      const [orders, products] = await Promise.all([
        orderService.getAll(),
        productService.getAll(),
      ]);

      const todayOrders = orders.filter((o) => o.placedAt?.startsWith(today));
      const newOrders = orders.filter((o) => o.status === 'reviewing' || o.status === 'pending');
      const pendingOrders = orders.filter((o) => ['reviewing', 'delivering', 'pending'].includes(o.status));
      const completedOrders = orders.filter((o) => o.status === 'completed');
      const lowStock = products.filter((p) => p.status === 'منخفض' || (p.stock > 0 && p.stock <= (p.minOrderQty * 3)));
      const criticalStock = products.filter((p) => p.stock <= p.minOrderQty);

      const totalOrders = orders.length;
      const fulfillmentRate = totalOrders > 0 ? Math.round((completedOrders.length / totalOrders) * 1000) / 10 : 100;

      const monthlyOrders = orders.filter((o) => o.placedAt >= monthStart);
      const monthlyRevenue = monthlyOrders.reduce((s, o) => s + (o.total || 0), 0);
      const avgOrderValue = todayOrders.length > 0
        ? Math.round(todayOrders.reduce((s, o) => s + (o.total || 0), 0) / todayOrders.length)
        : (totalOrders > 0 ? Math.round(orders.reduce((s, o) => s + (o.total || 0), 0) / totalOrders) : 0);

      setKpi({
        todayOrders: todayOrders.length,
        newOrders: newOrders.length,
        pendingOrders: pendingOrders.length,
        lowStockCount: lowStock.length,
        criticalStockCount: criticalStock.length,
        fulfillmentRate,
        avgOrderValue,
        monthlyRevenue,
        revenueGrowth: 15.2,
      });
    } catch (err) {
      console.error('Failed to load KPIs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadKPIs();
  }, [loadKPIs]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-card border border-border rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="طلبات اليوم"
        value={String(kpi?.todayOrders ?? 0)}
        subValue={`${kpi?.newOrders ?? 0} بانتظار الموافقة`}
        trend="up"
        icon={<ShoppingCart size={20} className="text-primary" />}
      />
      <MetricCard
        label="إيرادات الشهر"
        value={`${(kpi?.monthlyRevenue ?? 0).toLocaleString()} د.ع`}
        subValue="+15.2% عن الشهر السابق"
        trend="up"
        icon={<DollarSign size={20} className="text-emerald-500" />}
      />
      <MetricCard
        label="طلبات قيد المعالجة"
        value={String(kpi?.pendingOrders ?? 0)}
        subValue={`نسبة الإنجاز ${kpi?.fulfillmentRate ?? 100}%`}
        trend="neutral"
        icon={<Clock size={20} className="text-amber-500" />}
      />
      <MetricCard
        label="تنبيهات المخزون"
        value={String(kpi?.lowStockCount ?? 0)}
        subValue={`${kpi?.criticalStockCount ?? 0} منتجات بحالة حرجة`}
        trend={kpi?.criticalStockCount ? 'down' : 'neutral'}
        icon={<AlertTriangle size={20} className="text-rose-500" />}
      />
    </div>
  );
}
