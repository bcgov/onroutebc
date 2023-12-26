import { Optional } from "../../../common/types/common";
import {
  VehicleType,
  Vehicle,
} from "../../manageVehicles/types/managevehicles";

/**
 * Sort Power Unit or Trailer Types alphabetically and immutably
 * @param vehicleType string, either powerUnit or trailer
 * @param options array of Vehicle Types
 * @returns an array of sorted vehicle types alphabetically
 */
export const sortVehicleSubTypes = (
  vehicleType: string,
  options: Optional<VehicleType[]>,
) => {
  if (!vehicleType || !options) return [];
  const sorted = [...options]; // make copy of original array (original shouldn't be changed)
  sorted.sort((a, b) => {
    if (a.type?.toLowerCase() === b.type?.toLowerCase()) {
      return a.typeCode > b.typeCode ? 1 : -1;
    }
    if (a.type && b.type) return a.type > b.type ? 1 : -1;
    return 0;
  });
  return sorted;
};

/**
 * @param a Vehicle a
 * @param b Vehicle b
 * @returns 1 or -1 depending on whether a's plate > b's plate
 */
const sortByPlate = (a: Vehicle, b: Vehicle) => {
  return a.plate > b.plate ? 1 : -1;
};

/**
 * @param a Vehicle a
 * @param b Vehicle b
 * @returns 1 or -1 depending on whether a's unitNumber > b's unitNumber
 */
const sortByUnitNumber = (a: Vehicle, b: Vehicle) => {
  return (a.unitNumber || -1) > (b.unitNumber || -1) ? 1 : -1;
};

/**
 * @param a Vehicle a
 * @param b Vehicle b
 * @returns 1 or -1 depending on whether a's vehicleType > b's vehicleType
 */
const sortByVehicleType = (a: Vehicle, b: Vehicle) => {
  if (a.vehicleType && b.vehicleType) {
    return a.vehicleType > b.vehicleType ? 1 : -1;
  }
  return 0;
};

/**
 * Sort Vehicles by Plates and Unit Number alphabetically and immutably
 * @param vehicleType string, either plate or unitNumber
 * @param options array of Vehicles (Power Units and Trailers)
 * @returns an array of sorted vehicles alphabetically
 */
export const sortVehicles = (
  chooseFrom: string,
  options: Optional<Vehicle[]>,
) => {
  if (!chooseFrom || !options) return [];

  const sortedVehicles = options.toSorted((a, b) => {
    // If the vehicle types (powerUnit | trailer) are the same, sort by plate or unitnumber
    if (a.vehicleType?.toLowerCase() === b.vehicleType?.toLowerCase()) {
      if (chooseFrom === "plate") {
        return sortByPlate(a, b);
      }
      return sortByUnitNumber(a, b);
    }
    // else sort by vehicle type
    return sortByVehicleType(a, b);
  });

  return sortedVehicles;
};
