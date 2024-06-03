import { BASE_DAYS_IN_YEAR, TERM_DURATION_INTERVAL_DAYS } from "../constants/constants";
import { PERMIT_TYPES, PermitType } from "../types/PermitType";
import {
  MAX_TROS_DURATION,
  MIN_TROS_DURATION,
  TROS_DURATION_INTERVAL_DAYS,
  TROS_DURATION_OPTIONS,
} from "../constants/tros";

import {
  MAX_TROW_DURATION,
  MIN_TROW_DURATION,
  TROW_DURATION_INTERVAL_DAYS,
  TROW_DURATION_OPTIONS,
} from "../constants/trow";

/**
 * Get list of selectable duration options for a given permit type.
 * @param permitType Permit type to get duration options for
 * @returns List of selectable duration options for the given permit type
 */
export const durationOptionsForPermitType = (permitType: PermitType) => {
  if (permitType === PERMIT_TYPES.TROS) return TROS_DURATION_OPTIONS;
  if (permitType === PERMIT_TYPES.TROW) return TROW_DURATION_OPTIONS;
  return [];
};

/**
 * Get the minimum allowable duration for a given permit type.
 * @param permitType Permit type to get min duration for
 * @returns Mininum allowable duration for the permit type
 */
export const minDurationForPermitType = (permitType: PermitType) => {
  if (permitType === PERMIT_TYPES.TROS) return MIN_TROS_DURATION;
  if (permitType === PERMIT_TYPES.TROW) return MIN_TROW_DURATION;
  return 0;
};

/**
 * Get the maximum allowable duration for a given permit type.
 * @param permitType Permit type to get max duration for
 * @returns Maxinum allowable duration for the permit type
 */
export const maxDurationForPermitType = (permitType: PermitType) => {
  if (permitType === PERMIT_TYPES.TROS) return MAX_TROS_DURATION;
  if (permitType === PERMIT_TYPES.TROW) return MAX_TROW_DURATION;
  return BASE_DAYS_IN_YEAR;
};

/**
 * Get the duration interval (in days) for a given permit type.
 * @param permitType Permit type to get duration interval for
 * @returns Number of days as duration interval for the permit type.
 */
export const getDurationIntervalDays  = (permitType: PermitType) => {
  switch (permitType) {
    case PERMIT_TYPES.TROW:
      return TROW_DURATION_INTERVAL_DAYS;
    case PERMIT_TYPES.TROS:
      return TROS_DURATION_INTERVAL_DAYS;
    default:
      return TERM_DURATION_INTERVAL_DAYS; // This needs to be updated once more permit types are added
  }
};
