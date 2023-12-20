import dayjs, { Dayjs } from "dayjs";

import { Permit } from "../types/permit";
import {
  getDateDiffInDays,
  getEndOfDate,
  getStartOfDate,
  now,
  toLocalDayjs,
} from "../../../common/helpers/formatDate";

// Enum indicating the state of a permit
export const PERMIT_STATES = {
  ISSUED: "ISSUED",
  ACTIVE: "ACTIVE",
  EXPIRES_IN_30: "EXPIRES_IN_30",
  EXPIRED: "EXPIRED",
} as const;

export type PermitState = typeof PERMIT_STATES[keyof typeof PERMIT_STATES];

/**
 * Get the number of days left before a permit expires.
 * @param permit Permit data containing its start and expiry date
 * @returns Number of days left before the permit expires.
 */
export const daysLeftBeforeExpiry = (permit: Permit) => {
  // Perform datetime calculations in local datetime
  const currDate = now();
  const permitStartDate = getStartOfDate(toLocalDayjs(permit.permitData.startDate));
  const permitExpiryDate = getExpiryDate(permitStartDate, permit.permitData.permitDuration);
  
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
  const permitStartDate = getStartOfDate(toLocalDayjs(permit.permitData.startDate));
  const permitExpiryDate = getExpiryDate(permitStartDate, permit.permitData.permitDuration);
  
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
