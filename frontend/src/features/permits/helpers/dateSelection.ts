import { MIN_TROS_DURATION, TROS_DURATION_OPTIONS } from "../constants/tros";
import { MIN_TROW_DURATION, TROW_DURATION_OPTIONS } from "../constants/trow";
import { PERMIT_TYPES, PermitType } from "../types/PermitType";

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
