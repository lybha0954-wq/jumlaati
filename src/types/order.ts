export type OrderStatus = "reviewing" | "delivering" | "completed" | "cancelled";
export type PaymentStatus = "paid" | "pending" | "overdue";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  unit_price: number;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total: number;
  commission: number | null;
  store_id: string | null;
  buyer_name: string | null;
  delivery_address: string | null;
  retailer_profile_id: string | null;
  supplier_profile_id: string | null;
  delivery_profile_id: string | null;
  created_at: string;
}
