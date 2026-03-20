import dayjs, { Dayjs } from "dayjs";

import { isQuarterlyPermit, PERMIT_TYPES, PermitType } from "../types/PermitType";
import { getExpiryDate } from "./permitState";
import { getMostRecentExpiryFromLOAs } from "./permitLOA";
import { PermitLOA } from "../types/PermitLOA";
import { getStartOfQuarter } from "../../../common/helpers/formatDate";
import {
  MAX_TROS_DURATION,
  MIN_TROS_DURATION,
  TROS_DURATION_INTERVAL_DAYS,
  TROS_DURATION_OPTIONS,
} from "../constants/tros";

import {
  BASE_DAYS_IN_YEAR,
  MAX_ALLOWED_FUTURE_DAYS_CV,
  MAX_ALLOWED_FUTURE_DAYS_STAFF,
  TERM_DURATION_INTERVAL_DAYS,
} from "../constants/constants";

import {
  MAX_TROW_DURATION,
  MIN_TROW_DURATION,
  TROW_DURATION_INTERVAL_DAYS,
  TROW_DURATION_OPTIONS,
} from "../constants/trow";

import {
  MAX_STOS_CV_DURATION,
  MAX_STOS_STAFF_DURATION,
  MIN_STOS_DURATION,
  STOS_CV_DURATION_OPTIONS,
  STOS_DURATION_INTERVAL_DAYS,
  STOS_STAFF_DURATION_OPTIONS,
} from "../constants/stos";

import {
  MAX_STFR_DURATION,
  MIN_STFR_DURATION,
  STFR_DURATION_INTERVAL_DAYS,
  STFR_DURATION_OPTIONS,
} from "../constants/stfr";

import {
  MAX_MFP_DURATION,
  MFP_DURATION_INTERVAL_DAYS,
  MFP_DURATION_OPTIONS,
  MIN_MFP_DURATION,
} from "../constants/mfp";

import {
  MAX_NRSCV_DURATION,
  MIN_NRSCV_DURATION,
  NRSCV_DURATION_INTERVAL_DAYS,
  NRSCV_DURATION_OPTIONS,
} from "../constants/nrscv";

/**
 * Get list of selectable duration options for a given permit type.
 * @param permitType Permit type to get duration options for
 * @param isStaff Whether or not the user who manages the permit is staff
 * @returns List of selectable duration options for the given permit type
 */
export const durationOptionsForPermitType = (
  permitType: PermitType,
  isStaff: boolean,
) => {
  switch (permitType) {
    case PERMIT_TYPES.STFR:
      return STFR_DURATION_OPTIONS;
    case PERMIT_TYPES.NRSCV:
      return NRSCV_DURATION_OPTIONS;
    case PERMIT_TYPES.MFP:
      return MFP_DURATION_OPTIONS;
    case PERMIT_TYPES.STOS:
      return isStaff ? STOS_STAFF_DURATION_OPTIONS : STOS_CV_DURATION_OPTIONS;
    case PERMIT_TYPES.TROW:
      return TROW_DURATION_OPTIONS;
    case PERMIT_TYPES.TROS:
      return TROS_DURATION_OPTIONS;
    case PERMIT_TYPES.QRFR:
    case PERMIT_TYPES.NRQCV:
    default:
      return [];
  }
};

/**
 * Get the minimum allowable duration for a given permit type.
 * @param permitType Permit type to get min duration for
 * @returns Mininum allowable duration for the permit type
 */
export const minDurationForPermitType = (permitType: PermitType) => {
  switch (permitType) {
    case PERMIT_TYPES.STFR:
      return MIN_STFR_DURATION;
    case PERMIT_TYPES.NRSCV:
      return MIN_NRSCV_DURATION;
    case PERMIT_TYPES.MFP:
      return MIN_MFP_DURATION;
    case PERMIT_TYPES.STOS:
      return MIN_STOS_DURATION;
    case PERMIT_TYPES.TROW:
      return MIN_TROW_DURATION;
    case PERMIT_TYPES.TROS:
      return MIN_TROS_DURATION;
    case PERMIT_TYPES.QRFR:
    case PERMIT_TYPES.NRQCV:
    default:
      return 0;
  }
};

/**
 * Get the maximum allowable duration for a given permit type.
 * @param permitType Permit type to get max duration for
 * @param isStaff Whether or not the user who manages the permit is staff
 * @returns Maximum allowable duration for the permit type
 */
export const maxDurationForPermitType = (
  permitType: PermitType,
  isStaff: boolean,
) => {
  switch (permitType) {
    case PERMIT_TYPES.STFR:
      return MAX_STFR_DURATION;
    case PERMIT_TYPES.NRSCV:
      return MAX_NRSCV_DURATION;
    case PERMIT_TYPES.MFP:
      return MAX_MFP_DURATION;
    case PERMIT_TYPES.STOS:
      return isStaff ? MAX_STOS_STAFF_DURATION : MAX_STOS_CV_DURATION;
    case PERMIT_TYPES.TROW:
      return MAX_TROW_DURATION;
    case PERMIT_TYPES.TROS:
      return MAX_TROS_DURATION;
    default:
      return BASE_DAYS_IN_YEAR;
  }
};

/**
 * Get the duration interval (in days) for a given permit type.
 * @param permitType Permit type to get duration interval for
 * @returns Number of days as duration interval for the permit type.
 */
export const getDurationIntervalDays = (permitType: PermitType) => {
  switch (permitType) {
    case PERMIT_TYPES.STFR:
      return STFR_DURATION_INTERVAL_DAYS;
    case PERMIT_TYPES.NRSCV:
      return NRSCV_DURATION_INTERVAL_DAYS;
    case PERMIT_TYPES.MFP:
      return MFP_DURATION_INTERVAL_DAYS;
    case PERMIT_TYPES.STOS:
      return STOS_DURATION_INTERVAL_DAYS;
    case PERMIT_TYPES.TROW:
      return TROW_DURATION_INTERVAL_DAYS;
    case PERMIT_TYPES.TROS:
      return TROS_DURATION_INTERVAL_DAYS;
    default:
      return TERM_DURATION_INTERVAL_DAYS; // This needs to be updated once more permit types are added
  }
};

/**
 * Get the minimum permit expiry date.
 * @param permitType Permit type
 * @param startDate Expected start date of the permit
 * @returns The earliest date that the permit will expire on
 */
export const getMinPermitExpiryDate = (
  permitType: PermitType,
  startDate: Dayjs,
) => {
  const minDuration = minDurationForPermitType(permitType);
  return getExpiryDate(
    startDate,
    isQuarterlyPermit(permitType),
    minDuration,
  );
};

/**
 * Get max allowed future start date for a permit.
 * @param currentDate Current date
 * @param isStaff Whether or not user working with the permit is staff
 * @returns Max allowed future start date for the permit
 */
export const getMaxAllowedPermitFutureStartDate = (
  currentDate: Dayjs,
  isStaff: boolean,
) => {
  // If user isn't staff, the max future date can only be 14 days from current date
  if (!isStaff) return dayjs(currentDate).add(MAX_ALLOWED_FUTURE_DAYS_CV, "day");

  // Otherwise (user is staff), then regardless of application or amendment context
  // The max future date can be up to 60 days from current date
  return dayjs(currentDate).add(MAX_ALLOWED_FUTURE_DAYS_STAFF, "day");
};

/**
 * Get min allowed past start date for a permit.
 * @param permitType Permit type
 * @param permitStartDate Selected permit start date
 * @param currentDate Current date
 * @param isStaff Whether the user working with the permit is staff
 * @param isAmend Whether the permit is used in an amendment context
 * @returns Min allowed past start date for permit, or undefined if no such limit
 */
export const getMinAllowedPermitPastStartDate = (
  permitType: PermitType,
  permitStartDate: Dayjs,
  currentDate: Dayjs,
  isStaff: boolean,
  isAmend: boolean,
) => {
  // If user is not staff, limit the min permit start date to be current date
  if (!isStaff) return currentDate;

  // If permit isn't of a quarterly permit type, or if the permit type is quarterly
  // but it isn't being used in the amendment context, then the past start date can be
  // any date in the past (for staff)
  if (!isQuarterlyPermit(permitType) || !isAmend) return undefined;

  // For quarterly permits being amended, the earliest start date is the beginning of the
  // quarter based on the permit's start date when it was issued
  return getStartOfQuarter(permitStartDate);
};

/**
 * Get available duration options for a permit based on selected LOAs and start date.
 * @param fullDurationOptions Full duration select options for a permit
 * @param selectedLOAs Selected LOAs for a permit
 * @param startDate Start date for a permit
 * @returns Updated available duration select options
 */
export const getAvailableDurationOptions = (
  fullDurationOptions: {
    value: number;
    label: string;
  }[],
  selectedLOAs: PermitLOA[],
  startDate: Dayjs,
) => {
  const mostRecentLOAExpiry = getMostRecentExpiryFromLOAs(selectedLOAs);
  if (!mostRecentLOAExpiry) return fullDurationOptions;

  return fullDurationOptions.filter(
    ({ value: durationDays }) =>
      !mostRecentLOAExpiry.isBefore(
        getExpiryDate(
          startDate,
          false, // only non-quarterly permits have duration options
          durationDays,
        ),
      ),
  );
};

/**
 * Update permit duration if durations options change.
 * Selected duration must be between min allowable permit duration and max available duration in the options.
 * @param permitType Permit type
 * @param currentDuration Currently selected duration for the permit
 * @param durationOptions Available list of selectable duration options for the permit
 * @returns Current permit duration if valid, or updated duration if no longer valid
 */
export const handleUpdateDurationIfNeeded = (
  permitType: PermitType,
  currentDuration: number,
  durationOptions: {
    value: number;
    label: string;
  }[],
) => {
  const minAllowableDuration = minDurationForPermitType(permitType);
  const maxDurationInOptions = Math.max(
    ...durationOptions.map((durationOption) => durationOption.value),
  );

  if (currentDuration > maxDurationInOptions) {
    if (maxDurationInOptions < minAllowableDuration) {
      return minAllowableDuration;
    }
    return maxDurationInOptions;
  }

  return currentDuration;
};

/**
 * Determine if start date or expiry date of permit application are in the past
 * @param startDate Start date of the permit
 * @param expiryDate Expiry date of the permit
 * @returns True if either startDate or expiryDate are in the past
 */
export const isPermitStartOrExpiryDateInPast = (
  startDate: Dayjs,
  expiryDate: Dayjs,
) => {
  return (
    dayjs().isAfter(startDate, "day") || dayjs().isAfter(expiryDate, "day")
  );
};
