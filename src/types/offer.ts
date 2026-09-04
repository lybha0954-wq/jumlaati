export interface Offer {
  id: string;
  title: string;
  description: string;
  discount_percent: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface Refund {
  id: string;
  order_id: string;
  requested_by: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}
