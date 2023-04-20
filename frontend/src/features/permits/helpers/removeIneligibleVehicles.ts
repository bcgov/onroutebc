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
  ineligibleTrailers: VehicleType[]
) => {
  let ineligibleList: VehicleType[];
  if (vehicleType === "powerUnit") ineligibleList = ineligiblePowerUnits;
  if (vehicleType === "trailer") ineligibleList = ineligibleTrailers;

  vehicles.forEach((item, index) => {
    ineligibleList.forEach((x) => {
      if (item.typeCode === x.typeCode) vehicles.splice(index, 1);
    });
  });

  return vehicles;
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
  ineligibleTrailers: VehicleType[]
) => {
  vehicles.forEach((item, index) => {
    if (item.vehicleType === "powerUnit") {
      const powerUnit = item as PowerUnit;
      ineligiblePowerUnits.forEach((x) => {
        if (powerUnit.powerUnitTypeCode === x.typeCode)
          vehicles.splice(index, 1);
      });
    } else if (item.vehicleType === "trailer") {
      const trailer = item as Trailer;
      ineligibleTrailers.forEach((x) => {
        if (trailer.trailerTypeCode === x.typeCode) vehicles.splice(index, 1);
      });
    }
  });

  return vehicles;
};
