import { PermitLOA } from "../../types/PermitLOA";
import {
  PowerUnit,
  Trailer,
  VEHICLE_TYPES,
  Vehicle,
} from "../../../manageVehicles/types/Vehicle";

/**
 * A helper method that filters only allowed vehicles from dropdown lists.
 * @param vehicles List of all vehicles (both eligible and ineligible)
 * @param eligibleSubtypes Set of eligible vehicle subtypes
 * @param loas LOAs that potentially allow certain non-allowable vehicle types/subtypes to be used
 * @param restrictions Restriction rules that each vehicle must meet
 * @returns List of only allowed vehicles
 */
export const getAllowedVehicles = (
  vehicles: Vehicle[],
  eligibleSubtypes: Set<string>,
  loas: PermitLOA[],
  restrictions: ((vehicle: Vehicle) => boolean)[],
) => {
  return vehicles.filter((vehicle) => {
    if (vehicle.vehicleType === VEHICLE_TYPES.TRAILER) {
      const trailer = vehicle as Trailer;
      return loas.some(loa => (
        trailer.vehicleType === loa.vehicleType
        && trailer.trailerTypeCode === loa.vehicleSubtype
      )) || (
        eligibleSubtypes.has(trailer.trailerTypeCode)
          && restrictions.every(restriction => restriction(trailer))
      );
    }

    const powerUnit = vehicle as PowerUnit;
    return loas.some(loa => (
      powerUnit.vehicleType === loa.vehicleType
      && powerUnit.powerUnitTypeCode === loa.vehicleSubtype
    )) || (
      eligibleSubtypes.has(powerUnit.powerUnitTypeCode)
        && restrictions.every(restriction => restriction(powerUnit))
    );
  });
};
