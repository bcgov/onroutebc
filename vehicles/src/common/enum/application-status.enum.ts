export enum ApplicationStatus {
  APPROVED = 'APPROVED',
  AUTO_APPROVED = 'AUTO_APPROVED',
  CANCELLED = 'CANCELLED',
  IN_PROGRESS = 'IN_PROGRESS',
  REJECTED = 'REJECTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  WAITING_PAYMENT = 'WAITING_PAYMENT',
  PAYMENT_COMPLETE = 'PAYMENT_COMPLETE',
  ISSUED = 'ISSUED',
  SUPERSEDED = 'SUPERSEDED',
  REVOKED = 'REVOKED',
  VOIDED = 'VOIDED',
  DELETED = 'DELETED',
}

/**
 * Apllication statuses to be considered for Application In Progress (AIP) from IDIR User POV.
 */
export const idirUserAIPStatus: Readonly<ApplicationStatus[]> = [
  ApplicationStatus.IN_PROGRESS,
  ApplicationStatus.WAITING_PAYMENT,
  ApplicationStatus.CANCELLED,
  ApplicationStatus.UNDER_REVIEW,
];

/**
 * Apllication statuses to be considered for Application In Progress (AIP) from CV Client POV.
 */
export const cvClientAIPStatus: Readonly<ApplicationStatus[]> = [
  ApplicationStatus.IN_PROGRESS,
  ApplicationStatus.WAITING_PAYMENT,
  ApplicationStatus.UNDER_REVIEW,
];

export const deleteCvClientAIP: Readonly<ApplicationStatus> =
  ApplicationStatus.CANCELLED;

export const deleteIdirAIP: Readonly<ApplicationStatus> =
  ApplicationStatus.DELETED;
