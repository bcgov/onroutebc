import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import {
  AxleCalculationResult,
  POLICY_CHECK_RESULT_TYPES,
} from "../../types/AxleCalculationResult";
import { PERMIT_TYPES, PermitType } from "../../types/PermitType";

/**
 * Determines whether or not permit policy violations can be overriden.
 * @param violations Policy violations for a given permit
 * @param isStaffUser Whether or not user is staff
 * @param permitType Permit type
 * @returns Whether or not policy violations should be overriden for a permit
 */
export const shouldOverridePolicyViolations = (
  violations: {
    [key: string]: string;
  },
  axleCalculationResults: AxleCalculationResult,
  isStaffUser: boolean,
  permitType: PermitType,
) => {
  const violationFieldReferences = Object.keys(violations);

  const failedAxleCalculationResults = getDefaultRequiredVal(
    [],
    axleCalculationResults?.results.filter(
      ({ result }) => result === POLICY_CHECK_RESULT_TYPES.FAIL,
    ),
  );

  // No violations, no failed axle calulations or a non-zero overload number would trivially override
  if (
    violationFieldReferences.length === 0 &&
    failedAxleCalculationResults.length === 0 &&
    axleCalculationResults.overload > 0
  )
    return true;

  // If isn't staff user, then policy violations should NOT be overriden
  if (!isStaffUser) return false;

  // For given permit type, check to see if policy violations should be overriden
  if (permitType === PERMIT_TYPES.NRQCV || permitType === PERMIT_TYPES.NRSCV) {
    // For non-resident permit types, if there are violations for either
    // net weight or loaded GVW, those violations shouldn't be overriden (even for staff)
    return (
      !violationFieldReferences.includes(
        "permitData.vehicleConfiguration.loadedGVW",
      ) &&
      !violationFieldReferences.includes(
        "permitData.vehicleConfiguration.netWeight",
      )
    );
    return (
      !violationFieldReferences.includes(
        "permitData.vehicleConfiguration.loadedGVW",
      ) &&
      !violationFieldReferences.includes(
        "permitData.vehicleConfiguration.netWeight",
      )
    );
  }

  // For all other scenarios, policy violations can be overriden for staff
  return true;
};
