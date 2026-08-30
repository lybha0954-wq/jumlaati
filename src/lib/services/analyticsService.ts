// lib/services/analyticsService.ts
import { createClient } from '@/lib/supabase/server';

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  total_sold: number;
  total_revenue: number;
}

export interface DeliveryPerformance {
  name: string;
  tasks_completed: number;
  total_earned: number;
}

export const analyticsService = {
  // 1. إحصائيات المبيعات اليومية (آخر 30 يوماً)
  async getSalesOverview(days: number = 30): Promise<SalesData[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('created_at, total_price')
      .eq('status', 'مدفوع - جارٍ التجهيز')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });

    if (error || !data) return [];

    // تجميع حسب التاريخ
    const grouped = data.reduce((acc, order) => {
      const date = new Date(order.created_at).toLocaleDateString('ar-SA');
      if (!acc[date]) acc[date] = { revenue: 0, orders: 0 };
      acc[date].revenue += order.total_price;
      acc[date].orders += 1;
      return acc;
    }, {} as Record<string, { revenue: number; orders: number }>);

    return Object.entries(grouped).map(([date, values]) => ({
      date,
      revenue: values.revenue,
      orders: values.orders,
    }));
  },

  // 2. أكثر المنتجات مبيعاً (Top 10)
  async getTopProducts(limit: number = 10): Promise<TopProduct[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('order_items')
      .select('product_id, quantity, price, products(name)')
      .eq('orders.status', 'مدفوع - جارٍ التجهيز')
      .limit(1000); // نأخذ عينة كبيرة

    if (error || !data) return [];

    const productMap = new Map<string, { name: string; total_sold: number; total_revenue: number }>();
    
    data.forEach((item: any) => {
      const product = item.products;
      if (!product) return;
      const existing = productMap.get(item.product_id);
      if (existing) {
        existing.total_sold += item.quantity;
        existing.total_revenue += item.price * item.quantity;
      } else {
        productMap.set(item.product_id, {
          name: product.name,
          total_sold: item.quantity,
          total_revenue: item.price * item.quantity,
        });
      }
    });

    return Array.from(productMap.entries())
      .map(([id, values]) => ({ id, ...values }))
      .sort((a, b) => b.total_sold - a.total_sold)
      .slice(0, limit);
  },

  // 3. أداء مندوبي التوصيل
  async getDeliveryPerformance(): Promise<DeliveryPerformance[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('delivery_tasks')
      .select('delivery_boy_id, status, delivery_fee, profiles(full_name)')
      .eq('status', 'completed');

    if (error || !data) return [];

    const map = new Map<string, { name: string; tasks_completed: number; total_earned: number }>();
    
    data.forEach((task: any) => {
      const profile = task.profiles;
      if (!profile) return;
      const existing = map.get(task.delivery_boy_id);
      if (existing) {
        existing.tasks_completed += 1;
        existing.total_earned += task.delivery_fee || 0;
      } else {
        map.set(task.delivery_boy_id, {
          name: profile.full_name || 'مندوب',
          tasks_completed: 1,
          total_earned: task.delivery_fee || 0,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.tasks_completed - a.tasks_completed);
  },

  // 4. مؤشرات سريعة (البطاقات العلوية)
  async getQuickStats(): Promise<{ totalRevenue: number; totalOrders: number; avgOrderValue: number }> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('total_price')
      .eq('status', 'مدفوع - جارٍ التجهيز');

    if (error || !data) return { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 };

    const totalRevenue = data.reduce((sum, o) => sum + o.total_price, 0);
    const totalOrders = data.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return { totalRevenue, totalOrders, avgOrderValue };
  }
};
