import { createClient } from './client';

export async function callRpc<T = any>(
  functionName: string,
  params: Record<string, any> = {}
): Promise<T | null> {
  const supabase = createClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.rpc(functionName, params);
    if (error) {
      console.error(`RPC ${functionName} failed:`, error);
      return null;
    }
    return data as T;
  } catch (e) {
    console.error(`RPC ${functionName} error:`, e);
    return null;
  }
}

// ─── دوال مخصصة ─────────────────────────────────

export const rpc = {
  adminStats: () => callRpc<Record<string, any>>('get_admin_dashboard_stats'),

  commissionTotals: () =>
    callRpc<{ total_commission: number; total_sales: number; total_orders: number }>(
      'get_commission_totals'
    ),

  userDebtSummary: (userId: string) =>
    callRpc<{ total_debt: number; overdue_debt: number; pending_debt: number }>(
      'get_user_debt_summary',
      { user_uuid: userId }
    ),

  supplierStats: (supplierId: string) =>
    callRpc<Record<string, any>>('get_supplier_dashboard_stats', {
      supplier_uuid: supplierId,
    }),

  retailerStats: (retailerId: string) =>
    callRpc<Record<string, any>>('get_retailer_dashboard_stats', {
      retailer_uuid: retailerId,
    }),

  deliveryStats: (deliveryId: string) =>
    callRpc<Record<string, any>>('get_delivery_dashboard_stats', {
      delivery_uuid: deliveryId,
    }),

  monthStats: () =>
    callRpc<{ revenue: number; orders: number; commission: number }>('get_month_stats'),

  topProducts: (limit = 5) =>
    callRpc<Array<{ product_id: string; product_name: string; total_sold: number; revenue: number }>>(
      'get_top_products',
      { limit_count: limit }
    ),

  ordersByStatus: () =>
    callRpc<Array<{ status: string; count: number }>>('get_orders_by_status'),

  revenueLast7Days: () =>
    callRpc<Array<{ day_date: string; revenue: number; orders_count: number }>>(
      'get_revenue_last_7_days'
    ),
};
