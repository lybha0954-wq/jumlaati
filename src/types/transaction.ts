export type TransactionStatus = 'paid' | 'partial' | 'pending' | 'overdue' | 'cancelled';
export interface Transaction {
  id: string;
  transactionNumber: string;
  retailerId?: string;
  supplierId?: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: TransactionStatus;
  createdAt: string;
}
