import dayjs, { Dayjs } from "dayjs";

import { LOADetail } from "../../settings/types/SpecialAuthorization";
import { PermitType } from "../types/PermitType";
import { getEndOfDate, toLocalDayjs } from "../../../common/helpers/formatDate";

/**
 * Filter valid LOAs for a given permit type.
 * @param loas LOAs to filter
 * @param permitType The permit type that the LOA can be applicable for
 * @returns LOAs that can be applicable for the given permit type
 */
export const filterLOAsForPermitType = (
  loas: LOADetail[],
  permitType: PermitType,
) => {
  return loas.filter(loa => loa.loaPermitType.includes(permitType));
};

/**
 * Filter non-expired LOAs that do not expire before the start date of a permit. 
 * @param loas LOAs to filter
 * @param permitStart The start date of the permit
 * @returns LOAs that do not expire before the start date of the permit
 */
export const filterNonExpiredLOAs = (
  loas: LOADetail[],
  permitStart: Dayjs,
) => {
  return loas.filter(loa => (
    !loa.expiryDate
      || !permitStart.isAfter(
        getEndOfDate(toLocalDayjs(loa.expiryDate)),
      )
  ));
};


/**
 * Get the most recent expiry date for a list of LOAs.
 * @param loas LOAs with or without expiry dates
 * @returns The most recent expiry date for all the LOAs, or null if none of the LOAs expire
 */
export const getMostRecentExpiryFromLOAs = (loas: LOADetail[]) => {
  const expiringLOAs = loas.filter(loa => Boolean(loa.expiryDate));
  if (expiringLOAs.length === 0) return null;

  const firstLOAExpiryDate = getEndOfDate(dayjs(expiringLOAs[0].expiryDate));
  return expiringLOAs.map(loa => loa.expiryDate)
    .reduce((prevExpiry, currExpiry) => {
      const prevExpiryDate = getEndOfDate(dayjs(prevExpiry));
      const currExpiryDate = getEndOfDate(dayjs(currExpiry));
      return prevExpiryDate.isAfter(currExpiryDate) ? currExpiryDate : prevExpiryDate;
    }, firstLOAExpiryDate);
};
