export const PERMIT_ACTION_TYPES = {
  RESEND: "resend",
  VIEW_RECEIPT: "viewReceipt",
  AMEND: "amend",
  VOID_REVOKE: "voidRevoke",
  COPY: "copy",
} as const;

export type PermitActionType =
  (typeof PERMIT_ACTION_TYPES)[keyof typeof PERMIT_ACTION_TYPES];
