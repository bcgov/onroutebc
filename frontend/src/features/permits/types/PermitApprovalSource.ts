export const PERMIT_APPROVAL_SOURCES = {
  AUTO: "AUTO",
  PPC: "PPC",
  TPS: "TPS",
} as const;

export type PermitApprovalSource =
  (typeof PERMIT_APPROVAL_SOURCES)[keyof typeof PERMIT_APPROVAL_SOURCES];
