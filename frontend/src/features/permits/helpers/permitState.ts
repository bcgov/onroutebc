import { getDateDiffInDays, now, toLocalDayjs } from "../../../common/helpers/formatDate";
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
  const permitExpiryDate = toLocalDayjs(permit.permitData.expiryDate);
  if (currDate.isBefore(permitStartDate)) {
    return getDateDiffInDays(permitExpiryDate, permitStartDate);
  }
  
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
