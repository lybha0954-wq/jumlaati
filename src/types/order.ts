export type OrderStatus =
  | "pending"
  | "accepted"
  | "shipped"
  | "picked_up"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "unpaid" | "partial" | "paid" | "refunded";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  delivery_fee: number;
  commission: number | null;
  total_amount: number;
  buyer_name: string | null;
  delivery_address: string | null;
  notes: string | null;
  retailer_id: string | null;
  supplier_id: string | null;
  delivery_id: string | null;
  created_at: string;
  updated_at: string;
}
