// src/app/admin-commissions/page.tsx
import { createClient } from '@/lib/supabase/server';
import AdminCommissionsContent from './components/AdminCommissionsContent';

async function getCommissionData() {
  const supabase = createClient();

  // 1. جلب جميع طلبات العمولات (بجميع أنواعها)
  const { data: requests } = await supabase
    .from('commission_requests')
    .select(`
      id,
      type,
      status,
      requester_id,
      target_id,
      commission_percentage,
      commission_amount,
      description,
      created_at,
      updated_at,
      requester:profiles!commission_requests_requester_id_fkey(full_name, role, phone),
      target:profiles!commission_requests_target_id_fkey(full_name, role, phone)
    `)
    .order('created_at', { ascending: false });

  // 2. إحصائيات سريعة
  const totalRequests = requests?.length || 0;
  const pendingRequests = requests?.filter(r => r.status === 'pending').length || 0;
  const totalCommissions = requests?.reduce((sum, r) => sum + (r.commission_amount || 0), 0) || 0;
  const completedRequests = requests?.filter(r => r.status === 'completed').length || 0;

  // 3. توزيع الطلبات حسب النوع
  const typeDistribution = requests?.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return {
    requests: requests || [],
    stats: {
      totalRequests,
      pendingRequests,
      totalCommissions,
      completedRequests,
      completionRate: totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0,
    },
    typeDistribution,
  };
}

export default async function AdminCommissionsPage() {
  const data = await getCommissionData();
  return <AdminCommissionsContent initialData={data} />;
}
