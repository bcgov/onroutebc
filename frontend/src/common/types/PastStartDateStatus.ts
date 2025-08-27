export const PAST_START_DATE_STATUSES = {
  ALLOWED: "ALLOWED",
  WARNING: "WARNING",
  FAIL: "FAIL",
} as const;

export type PastStartDateStatus =
  (typeof PAST_START_DATE_STATUSES)[keyof typeof PAST_START_DATE_STATUSES];
