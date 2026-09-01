export const notificationTypes = {
  ORDER: "order",
  PAYOUT: "payout",
  COMMISSION: "commission",
  MATCH: "match",
} as const;

export type NotificationType = (typeof notificationTypes)[keyof typeof notificationTypes];
