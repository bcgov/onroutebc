import { PermitVehicleConfiguration } from "../../../../../../types/PermitVehicleConfiguration";
import { PermitVehicleDetails } from "../../../../../../types/PermitVehicleDetails";
import {
  AxleCalculationResult,
  AxleGroupPolicyCheckResult,
  POLICY_CHECK_ID_TYPES,
} from "../../../../../../types/AxleCalculationResult";


// TODO - Probably need to make this a tiny bit more generic, from just like validTruckTractor to valid vehicle type?
// Left somewhat lightweight for now to get the point across for initial ASW PR.
export const validTruckTractor = (): {
  vehicleFormData: PermitVehicleDetails;
  vehicleConfiguration: PermitVehicleConfiguration;
} => ({
  vehicleFormData: {
    vehicleId: "101",
    vin: "654321",
    plate: "D654321",
    make: "Custom",
    year: 2010,
    countryCode: "CA",
    provinceCode: "BC",
    vehicleType: "powerUnit",
    vehicleSubType: "TRKTRAC",
    licensedGVW: 40000,
  },
  vehicleConfiguration: {
    axleConfiguration: [
      {
        numberOfAxles: 1,
        axleUnitWeight: 6700,
        numberOfTires: 2,
        tireSize: 355,
      },
      { interaxleSpacing: 3.5 },
      {
        numberOfAxles: 2,
        axleSpread: 1.6,
        axleUnitWeight: 12000,
        numberOfTires: 4,
        tireSize: 330,
      },
    ],
    trailers: [],
  },
});

// A response with no violations; totals are placeholders, not calculated weights.
export const emptySuccessfulCalculation = (): AxleCalculationResult => ({
  results: [],
  totalGCVW: 0,
  overload: 0,
  overloadDetails: [],
});

/**
 * This is mocking a failure, basically, so we can just make sure that rendering or 
 * work as expected. The important thing here is that even if this specific STOW
 * eval would change, the test is still fine! The test FORCES a failure for a specific
 * test and then make sure it renders, so our tests are not overly coupled with 
 * specific Policy Engine eval behaviour.
 */
export const legalInteraxleSpacingFailure = ({
  axleUnit = 2,
  message = `Interaxle spacing for Axle Unit ${axleUnit} is outside the legal range.`,
}: {
  axleUnit?: number;
  message?: string;
} = {}): AxleGroupPolicyCheckResult => ({
  id: POLICY_CHECK_ID_TYPES.LEGAL_INTERAXLE_SPACING,
  result: "fail",
  message,
  axleUnit,
  startAxleUnit: axleUnit,
  endAxleUnit: axleUnit,
});
