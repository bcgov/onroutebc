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

const sortByPlateOrUnitNumber = (a: Vehicle, b: Vehicle, chooseFrom: string) => {
  if (chooseFrom === "plate") {
    return a.plate > b.plate ? 1 : -1;
  }
  return (a.unitNumber || -1) > (b.unitNumber || -1) ? 1 : -1;
};

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
      return sortByPlateOrUnitNumber(a, b, chooseFrom);
    }
    // else sort by vehicle type
    return sortByVehicleType(a, b);
  });

  return sortedVehicles;
};
