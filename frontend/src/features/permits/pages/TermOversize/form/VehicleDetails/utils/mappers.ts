import {
  PowerUnit,
  Trailer,
  VehicleTypes,
} from "../../../../../../manageVehicles/types/managevehicles";

/**
 * This helper function is used to get the vehicle object that matches the vin prop
 * If there are multiple vehicles with the same vin, then return the first vehicle
 * @param vehicles list of vehicles
 * @param vin string used as a key to find the existing vehicle
 * @returns a PowerUnit or Trailer object, or undefined
 */
export const getExistingVehicle = (
  vehicles: VehicleTypes[] | undefined,
  vin: string
): PowerUnit | Trailer | undefined => {
  if (!vehicles) return undefined;

  const existingVehicles = vehicles.filter((item) => {
    return item.vin === vin;
  });

  if (!existingVehicles) return undefined;

  return existingVehicles[0];
};
