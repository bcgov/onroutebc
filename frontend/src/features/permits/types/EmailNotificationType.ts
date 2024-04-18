export const EMAIL_NOTIFICATION_TYPES = {
  PERMIT: "EMAIL_PERMIT",
  RECEIPT: "EMAIL_RECEIPT",
} as const;

export type EmailNotificationType = typeof EMAIL_NOTIFICATION_TYPES[keyof typeof EMAIL_NOTIFICATION_TYPES];
