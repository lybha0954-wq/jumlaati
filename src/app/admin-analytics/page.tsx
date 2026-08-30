// src/app/admin-analytics/page.tsx
import { createClient } from '@/lib/supabase/server';
import AdminAnalyticsContent from './components/AdminAnalyticsContent';

// جلب البيانات من الخادم (آمن وسريع)
async function getAnalyticsData() {
  const supabase = createClient();

  // 1. إحصائيات سريعة (البطاقات)
  const { data: stats } = await supabase
    .from('transactions')
    .select('total_amount, platform_commission, status, created_at');

  // 2. جلب المعاملات الأخيرة (للجدول)
  const { data: transactions } = await supabase
    .from('transactions')
    .select(`
      id,
      total_amount,
      platform_commission,
      supplier_net,
      delivery_fee,
      status,
      created_at,
      retailer:profiles!transactions_retailer_id_fkey(full_name),
      supplier:profiles!transactions_supplier_id_fkey(full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  // حساب الإحصائيات
  const totalRevenue = stats?.reduce((sum, t) => sum + t.total_amount, 0) || 0;
  const totalCommission = stats?.reduce((sum, t) => sum + t.platform_commission, 0) || 0;
  const totalOrders = stats?.length || 0;
  const completedOrders = stats?.filter(t => t.status === 'completed').length || 0;

  // توزيع الحالات للرسم الدائري
  const statusDistribution = stats?.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return {
    stats: {
      totalRevenue,
      totalCommission,
      totalOrders,
      completedOrders,
      completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
    },
    transactions: transactions || [],
    statusDistribution,
  };
}

export default async function AdminAnalyticsPage() {
  const data = await getAnalyticsData();

  return <AdminAnalyticsContent initialData={data} />;
}
