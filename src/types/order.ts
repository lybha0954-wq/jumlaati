export type OrderStatus = 'reviewing' | 'delivering' | 'completed' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';
export interface OrderSummary {
  id: string;
  orderNumber: string;
  placedAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  buyerName: string;
  buyerStoreName: string;
  buyerPhone: string;
  deliveryCity: string;
  itemsCount: number;
}
