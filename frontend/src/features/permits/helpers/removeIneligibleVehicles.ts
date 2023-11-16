import {
  PowerUnit,
  Trailer,
  Vehicle,
  VehicleType,
} from "../../manageVehicles/types/managevehicles";

/**
 * A helper method that acts as a client side policy check to remove ineligible power unit or trailer subtypes from dropdown lists
 * @param vehicles Array of eligible and ineligible vehicle sub types
 * @param vehicleType String which is either "powerUnit" or "trailer"
 * @param ineligiblePowerUnits Array of ineligible power unit sub types
 * @param ineligibleTrailers Array of ineligible trailer sub types
 * @returns An array of eligible power unit or trailer sub types
 */
export const removeIneligibleVehicleSubTypes = (
  vehicles: VehicleType[],
  vehicleType: "powerUnit" | "trailer",
  ineligiblePowerUnits: VehicleType[],
  ineligibleTrailers: VehicleType[],
) => {
  let ineligibleList: VehicleType[] = [];
  if (vehicleType === "powerUnit") ineligibleList = ineligiblePowerUnits;
  if (vehicleType === "trailer") ineligibleList = ineligibleTrailers;

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
 * @param ineligiblePowerUnits Array of ineligible power unit sub types
 * @param ineligibleTrailers Array of ineligible trailer sub types
 * @returns An array of eligible vehicles
 */
export const removeIneligibleVehicles = (
  vehicles: Vehicle[],
  ineligiblePowerUnits: VehicleType[],
  ineligibleTrailers: VehicleType[],
) => {
  const filteredVehicles = vehicles.filter((vehicle) => {
    if (vehicle.vehicleType === "powerUnit") {
      const powerUnit = vehicle as PowerUnit;
      return !ineligiblePowerUnits.some((ineligible) => {
        return powerUnit.powerUnitTypeCode === ineligible.typeCode;
      });
    } else if (vehicle.vehicleType === "trailer") {
      const trailer = vehicle as Trailer;
      return !ineligibleTrailers.some((ineligible) => {
        return trailer.trailerTypeCode === ineligible.typeCode;
      });
    } else {
      return true;
    }
  });

  return filteredVehicles;
};
