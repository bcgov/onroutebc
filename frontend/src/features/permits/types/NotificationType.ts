export const NOTIFICATION_TYPES = {
  PERMIT: "PERMIT",
  RECEIPT: "RECEIPT",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];
