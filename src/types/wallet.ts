export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  updated_at: string;
}

export interface PointsTransaction {
  id: string;
  user_id: string;
  order_id: string;
  points: number;
  type: 'earn' | 'redeem';
  created_at: string;
}
