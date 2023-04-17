import { VehicleType } from "../../manageVehicles/types/managevehicles";

/**
 * Maps the typeCode (Example: GRADERS) to the TrailerType or PowerUnitType object, then return that object
 * @param typeCode
 * @param vehicleType
 * @param powerUnitTypes
 * @param trailerTypes
 * @returns A Vehicle Sub type object
 */
export const mapTypeCodeToObject = (
  typeCode: string,
  vehicleType: string,
  powerUnitTypes: VehicleType[] | undefined,
  trailerTypes: VehicleType[] | undefined
) => {
  let typeObject = undefined;

  if (powerUnitTypes && vehicleType === "powerUnit") {
    typeObject = powerUnitTypes.find((v) => {
      return v.typeCode == typeCode;
    });
  } else if (trailerTypes && vehicleType === "trailer") {
    typeObject = trailerTypes.find((v) => {
      return v.typeCode == typeCode;
    });
  }

  return typeObject;
};
