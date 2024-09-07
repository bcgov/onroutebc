export const CaseStatusType = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  IN_PROGRESS: 'IN_PROGRESS',
} as const;

export type CaseStatusType =
  (typeof CaseStatusType)[keyof typeof CaseStatusType];

export const ApplicationQueueStatus = {
  PENDING_REVIEW: 'PENDING_REVIEW',
  IN_REVIEW: 'IN_REVIEW',
  CLOSED: 'CLOSED',
} as const;

export type ApplicationQueueStatus =
  (typeof ApplicationQueueStatus)[keyof typeof ApplicationQueueStatus];

export const ACTIVE_APPLICATION_QUEUE_STATUS: readonly ApplicationQueueStatus[] =
  [ApplicationQueueStatus.PENDING_REVIEW, ApplicationQueueStatus.IN_REVIEW];
