import dayjs, { Dayjs } from "dayjs";

import { getDateDiffInDays, getStartOfDate, now, toLocalDayjs } from "../../../common/helpers/formatDate";
import { Permit } from "../types/permit";

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
  const permitStartDate = toLocalDayjs(permit.permitData.startDate);
  const originalEndDate = getOriginalEndDate(permitStartDate, permit.permitData.permitDuration);
  
  if (currDate.isBefore(permitStartDate)) {
    return permit.permitData.permitDuration; // full number of days in the duration
  }
  
  // Active permit (current datetime is between the start date and end date)
  const tomorrow = dayjs(getStartOfDate(currDate)).add(1, "day");
  return getDateDiffInDays(originalEndDate, tomorrow);
};

/**
 * Get the current state of the permit.
 * @param permit Permit data containing start and expiry dates
 * @returns The current state of the permit
 */
export const getPermitState = (permit: Permit): PermitState => {
  // Perform datetime calculations in local datetime
  const currDate = now();
  const permitStartDate = toLocalDayjs(permit.permitData.startDate);
  const permitExpiryDate = toLocalDayjs(permit.permitData.expiryDate);
  
  if (currDate.isAfter(permitExpiryDate) || currDate.isSame(permitExpiryDate)) {
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
 * Gets the original end date based on start date and duration.
 * @param startDate Dayjs object representing start date
 * @param duration Number representing duration period
 * @returns End date based solely on the start date and addition of duration period
 */
const getOriginalEndDate = (startDate: Dayjs, duration: number) => {
  return dayjs(startDate).add(duration, "day");
};

/**
 * Check to see if we need to handle leap year.
 * If the given year is a leap year, and start date is on/before leap year day (Feb 29) and the end date is on/after Feb 29.
 * @param startDate Start date of a permit
 * @param endDate Original end date (startDate + duration of permit)
 * @returns Whether or not we need to handle leap year in calculating expiry date.
 */
const considerLeapYear = (startDate: Dayjs, endDate: Dayjs) => {
  const isEndDateInLeapYear = endDate.isLeapYear();
  const endDateYear = endDate.year();
  return isEndDateInLeapYear &&
    (startDate.isBefore(`${endDateYear}-02-29`, "day") || startDate.isSame(`${endDateYear}-02-29`, "day")) &&
    (endDate.isAfter(`${endDateYear}-02-29`, "day") || endDate.isSame(`${endDateYear}-02-29`, "day"));
};

/**
 * Get the expiry date of a permit given its start date and duration.
 * @param startDate Dayjs object representing start date
 * @param duration Number representing duration period
 */
export const getExpiryDate = (startDate: Dayjs, duration: number) => {
  const originalEndDate = dayjs(getOriginalEndDate(startDate, duration));
  
  if (considerLeapYear(startDate, originalEndDate)) {
    return originalEndDate; // "Include" the end date as part of the duration period
  }

  // "Exclude" the end date from the duration period if not based on leap year condition
  return originalEndDate.subtract(1, "day");
};

/**
 * Returns a boolean to indicate if a permit has expired.
 * @param expiryDate The expiry date of the permit
 * @returns boolean indicating if the permit has expired.
 */
export const hasPermitExpired = (expiryDate: string): boolean => {
  if (!expiryDate) return false;
  return dayjs().isAfter(expiryDate, "date");
};
