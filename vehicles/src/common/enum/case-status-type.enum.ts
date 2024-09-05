export const CaseStatusType = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  IN_PROGRESS: 'IN_PROGRESS',
} as const;

export type CaseStatusType =
  (typeof CaseStatusType)[keyof typeof CaseStatusType];
