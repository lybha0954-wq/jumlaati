export type DeliveryTaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export interface DeliveryTask {
  id: string;
  orderId: string;
  deliveryUserId: string;
  status: DeliveryTaskStatus;
  address: string;
  city: string;
  fee: number;
  completedAt?: string;
}
