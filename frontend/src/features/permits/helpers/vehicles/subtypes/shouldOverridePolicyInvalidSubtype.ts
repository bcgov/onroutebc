import { Nullable } from "../../../../../common/types/common";
import { PermitLOA } from "../../../types/PermitLOA";

/**
 * Determines whether or not a vehicle subtype considered invalid by policy engine
 * is in fact valid (eg. due to LOA).
 * @param policyViolations Policy engine violations, with key being name of invalid field
 * @param vehicleSubtype Current vehicle subtype in the form
 * @param selectedLOAs Currently selected LOAs, if any
 * @returns true if vehicle subtype is indeed valid, false otherwise
 */
export const shouldOverridePolicyInvalidSubtype = (
  policyViolations: Record<string, string>,
  vehicleSubtype: string,
  selectedLOAs?: Nullable<PermitLOA[]>,
) => {
  // By default, if policy violations don't include subtype,
  // it's safe to assume that subtype is valid and hence should let it pass
  if (!Object.keys(policyViolations).includes("permitData.vehicleDetails.vehicleSubType"))
    return true;

  // If no LOAs were selected, then an invalid subtype stays invalid
  if (!selectedLOAs || selectedLOAs.length === 0) return false;

  return selectedLOAs[0].vehicleSubType === vehicleSubtype;
};
