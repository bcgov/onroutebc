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
  options: VehicleType[] | undefined,
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
 * Sort Vehicles by Plates and Unit Number alphabetically and immutably
 * @param vehicleType string, either plate or unitNumber
 * @param options array of Vehicles (Power Units and Trailers)
 * @returns an array of sorted vehicles alphabetically
 */
export const sortVehicles = (
  chooseFrom: string,
  options: Vehicle[] | undefined,
) => {
  if (!chooseFrom || !options) return [];

  const sortByPlateOrUnitNumber = (a: Vehicle, b: Vehicle) => {
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

  // We shouldn't change original array, but make an copy and sort on that instead
  const sorted = [...options];
  sorted.sort((a, b) => {
    // If the vehicle types (powerUnit | trailer) are the same, sort by plate or unitnumber
    if (a.vehicleType?.toLowerCase() === b.vehicleType?.toLowerCase()) {
      return sortByPlateOrUnitNumber(a, b);
    }
    // else sort by vehicle type
    return sortByVehicleType(a, b);
  });

  return sorted;
};
