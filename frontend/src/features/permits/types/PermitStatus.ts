export const PERMIT_STATUSES = {
  APPROVED: "APPROVED",
  AUTO_APPROVED: "AUTO_APPROVED",
  CANCELLED: "CANCELLED",
  IN_PROGRESS: "IN_PROGRESS",
  REJECTED: "REJECTED",
  UNDER_REVIEW: "UNDER_REVIEW",
  WAITING_APPROVAL: "WAITING_APPROVAL",
  WAITING_PAYMENT: "WAITING_PAYMENT",
  ISSUED: "ISSUED",
  SUPERSEDED: "SUPERSEDED",
  REVOKED: "REVOKED",
  VOIDED: "VOIDED",
} as const;

export const PERMIT_EXPIRED = "EXPIRED";

export type PermitStatus =
  (typeof PERMIT_STATUSES)[keyof typeof PERMIT_STATUSES];

export const isPermitInactive = (permitStatus?: string) => {
  return (
    permitStatus === PERMIT_STATUSES.VOIDED ||
    permitStatus === PERMIT_STATUSES.REVOKED ||
    permitStatus === PERMIT_STATUSES.SUPERSEDED
  );
};
