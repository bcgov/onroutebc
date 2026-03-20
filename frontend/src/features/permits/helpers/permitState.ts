import dayjs, { Dayjs } from "dayjs";

import { Permit, PermitsActionResponse } from "../types/permit";
import { Nullable } from "../../../common/types/common";
import { removeEmptyIdsFromPermitsActionResponse } from "./mappers";
import { minDurationForPermitType } from "./dateSelection";
import { BASE_DAYS_IN_YEAR } from "../constants/constants";
import { isQuarterlyPermit } from "../types/PermitType";
import {
  getDateDiffInDays,
  getEndOfDate,
  getEndOfQuarter,
  getStartOfDate,
  now,
  toLocalDayjs,
} from "../../../common/helpers/formatDate";

// Enum indicating the state of a permit
export const PERMIT_STATES = {
  ISSUED: "ISSUED",
  ACTIVE: "ACTIVE",
  EXPIRES_SOON: "EXPIRES_SOON", // Expiring within min duration for given permit (eg. <30 days left for term permit)
  EXPIRED: "EXPIRED",
} as const;

export type PermitState = (typeof PERMIT_STATES)[keyof typeof PERMIT_STATES];

/**
 * Get the number of days left before a permit expires.
 * @param permit Permit data containing its start and expiry date
 * @returns Number of days left before the permit expires.
 */
export const daysLeftBeforeExpiry = (permit: Permit) => {
  // Perform datetime calculations in local datetime
  const currDate = now();
  const permitStartDate = getStartOfDate(
    toLocalDayjs(permit.permitData.startDate),
  );

  const permitExpiryDate = getExpiryDate(
    permitStartDate,
    isQuarterlyPermit(permit.permitType),
    permit.permitData.permitDuration,
  );

  if (currDate.isBefore(permitStartDate)) {
    return permit.permitData.permitDuration; // full number of days in the duration
  }

  // Active permit (current datetime is between the start date and end date)
  return getDateDiffInDays(permitExpiryDate, currDate);
};

/**
 * Get the current state of the permit.
 * @param permit Permit data containing start and expiry dates
 * @returns The current state of the permit
 */
export const getPermitState = (permit: Permit): PermitState => {
  // Perform datetime calculations in local datetime
  const currDate = now();
  const permitStartDate = getStartOfDate(
    toLocalDayjs(permit.permitData.startDate),
  );

  const permitExpiryDate = getExpiryDate(
    permitStartDate,
    isQuarterlyPermit(permit.permitType),
    permit.permitData.permitDuration,
  );

  if (currDate.isAfter(permitExpiryDate)) {
    return PERMIT_STATES.EXPIRED;
  }

  const daysLeft = daysLeftBeforeExpiry(permit);
  if (daysLeft < minDurationForPermitType(permit.permitType)) {
    return PERMIT_STATES.EXPIRES_SOON;
  }

  if (currDate.isAfter(permitStartDate) || currDate.isSame(permitStartDate)) {
    return PERMIT_STATES.ACTIVE;
  }

  return PERMIT_STATES.ISSUED;
};

/**
 * Get the expiry date of a permit given its start date and duration.
 * @param startDate Dayjs object representing start date
 * @param isQuarterly Whether or not the permit is a quarterly permit
 * @param duration Number representing duration period
 * @returns Dayjs object representing the exact expiry date
 */
export const getExpiryDate = (startDate: Dayjs, isQuarterly: boolean, duration: number) => {
  if (isQuarterly) return getEndOfQuarter(startDate);

  if (duration === BASE_DAYS_IN_YEAR) {
    // This is when user selects "1 year", and the library will take handle the leap year situation
    return getEndOfDate(dayjs(startDate).add(1, "year").subtract(1, "day"));
  }

  return getEndOfDate(dayjs(startDate).add(duration - 1, "day"));
};

/**
 * Returns a boolean to indicate if a permit has expired.
 * @param expiryDate The expiry date of the permit
 * @returns boolean indicating if the permit has expired.
 */
export const hasPermitExpired = (expiryDate: string): boolean => {
  if (!expiryDate) return false;
  return now().isAfter(getEndOfDate(expiryDate));
};

/**
 * Returns a boolean to indicate if an action for permit(s) has failed.
 * @param res Response data of the permits action
 * @returns boolean indicating if the action failed.
 */
export const hasPermitsActionFailed = (
  res: Nullable<PermitsActionResponse>,
) => {
  // Response of undefined doesn't indicate that action has failed (could be loading)
  if (typeof res === "undefined") return false;

  // Response of null is explicitly set upon failure
  if (!res) return true;

  const filteredRes = removeEmptyIdsFromPermitsActionResponse(res);
  if (filteredRes.success.length === 0 && filteredRes.failure.length === 0) {
    // No permits were affected by the action, so it's not a failure.
    return false;
  }

  // At least some of the permits have succeeded or failed
  return filteredRes.failure.length > 0 || filteredRes.success.length === 0;
};

/**
 * Check if the permit id is numeric.
 * @param permitId string that represents a permit id, if it exists
 * @returns Whether or not the provided permit id is numeric.
 */
export const isPermitIdNumeric = (permitId?: Nullable<string>) => {
  if (!permitId) return false;
  if (permitId.trim() === "") return false;
  return !isNaN(Number(permitId.trim()));
};
