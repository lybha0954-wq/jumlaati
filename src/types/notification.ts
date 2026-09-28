export type NotificationType = "order" | "payout" | "commission" | "match" | "system";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
}
