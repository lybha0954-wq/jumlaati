export interface Commission {
  id: string;
  orderId: string;
  retailerId: string;
  amount: number;
  status: "pending" | "paid";
  createdAt: string;
}
