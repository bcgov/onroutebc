export enum ApplicationStatus {
  APPROVED = 'APPROVED',
  AUTO_APPROVED = 'AUTO_APPROVED',
  CANCELLED = 'CANCELLED',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_CART = 'IN_CART',
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
 * Application statuses to be considered for Application In Progress (AIP) at time of issuance.
 */
export const ACTIVE_APPLICATION_STATUS_FOR_ISSUANCE: ReadonlyArray<ApplicationStatus> =
  [
    ApplicationStatus.IN_PROGRESS,
    ApplicationStatus.WAITING_PAYMENT,
    ApplicationStatus.IN_CART,
  ];

/**
 * Application statuses to be considered for Application In Progress (AIP) Tab for Cv Client Users.
 */
export const CVCLIENT_ACTIVE_APPLICATION_STATUS: ReadonlyArray<ApplicationStatus> =
  [ApplicationStatus.IN_PROGRESS, ApplicationStatus.WAITING_PAYMENT];

/**
 * Application statuses to be considered for Application In Progress (AIP) Tab for Staff Users.
 */
export const IDIR_ACTIVE_APPLICATION_STATUS: ReadonlyArray<ApplicationStatus> =
  [
    ApplicationStatus.IN_PROGRESS,
    ApplicationStatus.WAITING_PAYMENT,
    //ApplicationStatus.CANCELLED, //! Discovery Pending
  ];
