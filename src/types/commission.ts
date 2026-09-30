export type CommissionStatus = "pending" | "paid" | "cancelled";

export interface Commission {
  id: string;
  order_id: string;
  commission: number;
  retailer_id: string | null;
  supplier_id: string | null;
  status: CommissionStatus;
  created_at: string;
}
