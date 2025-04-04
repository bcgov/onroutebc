import { getDefaultRequiredVal } from "../../../common/helpers/util";
import { useMemoizedObject } from "../../../common/hooks/useMemoizedObject";
import { PermitVehicleDetails } from "../types/PermitVehicleDetails";

/**
 * Get a memoized permit vehicle details object, based on its field values rather than by reference.
 * @param vehicle Permit vehicle details
 * @returns Memoized permit vehicle details
 */
export const useMemoizedPermitVehicle = (vehicle: PermitVehicleDetails) => {
  return useMemoizedObject(
    vehicle,
    (v1, v2) => {
      return getDefaultRequiredVal("", v1.vehicleId) === getDefaultRequiredVal("", v2.vehicleId)
        && v1.countryCode === v2.countryCode
        && getDefaultRequiredVal(0, v1.licensedGVW) === getDefaultRequiredVal(0, v2.licensedGVW)
        && v1.make === v2.make
        && v1.plate === v2.plate
        && v1.provinceCode === v2.provinceCode
        && v1.vehicleType === v2.vehicleType
        && v1.vehicleSubType === v2.vehicleSubType
        && v1.vin === v2.vin
        && v1.year === v2.year;
    },
  );
};
