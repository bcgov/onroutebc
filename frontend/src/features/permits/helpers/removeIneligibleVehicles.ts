import {
  PowerUnit,
  Trailer,
  VehicleSubType,
  VehicleType,
  VEHICLE_TYPES,
  Vehicle,
} from "../../manageVehicles/types/Vehicle";

/**
 * A helper method that acts as a client side policy check to remove ineligible power unit or trailer subtypes from dropdown lists
 * @param vehicles Array of eligible and ineligible vehicle sub types
 * @param vehicleType Type of vehicle
 * @param ineligiblePowerUnits Array of ineligible power unit sub types
 * @param ineligibleTrailers Array of ineligible trailer sub types
 * @returns An array of eligible power unit or trailer sub types
 */
export const removeIneligibleVehicleSubTypes = (
  vehicles: VehicleSubType[],
  vehicleType: VehicleType,
  ineligiblePowerUnits: VehicleSubType[],
  ineligibleTrailers: VehicleSubType[],
) => {
  let ineligibleList: VehicleSubType[] = [];
  if (vehicleType === VEHICLE_TYPES.POWER_UNIT) ineligibleList = ineligiblePowerUnits;
  if (vehicleType === VEHICLE_TYPES.TRAILER) ineligibleList = ineligibleTrailers;

  const filteredVehicles = vehicles.filter((vehicle) => {
    return !ineligibleList.some(
      (ineligible) => vehicle.typeCode === ineligible.typeCode,
    );
  });

  return filteredVehicles;
};

/**
 * A helper method that acts as a client side policy check to remove ineligible power unit or trailer vehicles from dropdown lists
 * @param vehicles Array of eligible and ineligible vehicles
 * @param ineligiblePowerUnitSubtypes Array of ineligible power unit sub types
 * @param ineligibleTrailerSubtypes Array of ineligible trailer sub types
 * @returns An array of eligible vehicles
 */
export const removeIneligibleVehicles = (
  vehicles: Vehicle[],
  ineligiblePowerUnitSubtypes: VehicleSubType[],
  ineligibleTrailerSubtypes: VehicleSubType[],
) => {
  const filteredVehicles = vehicles.filter((vehicle) => {
    if (vehicle.vehicleType === VEHICLE_TYPES.POWER_UNIT) {
      const powerUnit = vehicle as PowerUnit;
      return !ineligiblePowerUnitSubtypes.some((ineligible) => {
        return powerUnit.powerUnitTypeCode === ineligible.typeCode;
      });
    } else if (vehicle.vehicleType === VEHICLE_TYPES.TRAILER) {
      const trailer = vehicle as Trailer;
      return !ineligibleTrailerSubtypes.some((ineligible) => {
        return trailer.trailerTypeCode === ineligible.typeCode;
      });
    } else {
      return true;
    }
  });

  return filteredVehicles;
};
