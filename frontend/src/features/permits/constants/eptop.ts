import { PermitCondition } from "../types/PermitCondition";

export const EPTOP_CONDITIONS: PermitCondition[] = [];
export const MANDATORY_EPTOP_CONDITIONS: PermitCondition[] = [];

export const MIN_EPTOP_DURATION = 1;
export const MAX_EPTOP_CV_DURATION = 7;
export const MAX_EPTOP_STAFF_DURATION = 7;
export const EPTOP_DURATION_INTERVAL_DAYS = 1;

export const EPTOP_CV_DURATION_OPTIONS = [
  { value: MIN_EPTOP_DURATION, label: "1 Day" },
  { value: 2, label: "2 Days" },
  { value: 3, label: "3 Days" },
  { value: 4, label: "4 Days" },
  { value: 5, label: "5 Days" },
  { value: 6, label: "6 Days" },
  { value: MAX_EPTOP_CV_DURATION, label: "7 Days" },
];

export const EPTOP_STAFF_DURATION_OPTIONS = [
  { value: MIN_EPTOP_DURATION, label: "1 Day" },
  { value: 2, label: "2 Days" },
  { value: 3, label: "3 Days" },
  { value: 4, label: "4 Days" },
  { value: 5, label: "5 Days" },
  { value: 6, label: "6 Days" },
  { value: MAX_EPTOP_STAFF_DURATION, label: "7 Days" },
];
