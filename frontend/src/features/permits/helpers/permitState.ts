import dayjs, { Dayjs } from "dayjs";

import { Permit, PermitsActionResponse } from "../types/permit";
import {
  getDateDiffInDays,
  getEndOfDate,
  getStartOfDate,
  now,
  toLocalDayjs,
} from "../../../common/helpers/formatDate";
import { Nullable } from "../../../common/types/common";
import { removeEmptyIdsFromPermitsActionResponse } from "./mappers";

// Enum indicating the state of a permit
export const PERMIT_STATES = {
  ISSUED: "ISSUED",
  ACTIVE: "ACTIVE",
  EXPIRES_IN_30: "EXPIRES_IN_30",
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
    permit.permitData.permitDuration,
  );

  if (currDate.isBefore(permitStartDate)) {
    return permit.permitData.permitDuration; // full number of days in the duration
  }

  // Active permit (current datetime is between the start date and end date)
  const tomorrow = dayjs(getStartOfDate(currDate)).add(1, "day");
  return getDateDiffInDays(permitExpiryDate, tomorrow);
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
    permit.permitData.permitDuration,
  );

  if (currDate.isAfter(permitExpiryDate)) {
    return PERMIT_STATES.EXPIRED;
  }

  const daysLeft = daysLeftBeforeExpiry(permit);
  if (daysLeft < 30) {
    return PERMIT_STATES.EXPIRES_IN_30;
  }

  if (currDate.isAfter(permitStartDate) || currDate.isSame(permitStartDate)) {
    return PERMIT_STATES.ACTIVE;
  }

  return PERMIT_STATES.ISSUED;
};

/**
 * Get the expiry date of a permit given its start date and duration.
 * @param startDate Dayjs object representing start date
 * @param duration Number representing duration period
 */
export const getExpiryDate = (startDate: Dayjs, duration: number) => {
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
export const hasPermitsActionFailed = (res: Nullable<PermitsActionResponse>) => {
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
