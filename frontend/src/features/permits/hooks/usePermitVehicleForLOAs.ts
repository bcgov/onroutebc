import { useEffect } from "react";

import { PermitVehicleDetails } from "../types/PermitVehicleDetails";
import { PowerUnit, Trailer } from "../../manageVehicles/types/Vehicle";
import { getUpdatedVehicleDetailsForLOAs } from "../helpers/permitLOA";
import { PermitLOA } from "../types/PermitLOA";

export const usePermitVehicleForLOAs = (
  vehicleFormData: PermitVehicleDetails,
  vehicleOptions: (PowerUnit | Trailer)[],
  selectedLOAs: PermitLOA[],
  ineligiblePowerUnitSubtypes: string[],
  ineligibleTrailerSubtypes: string[],
  onClearVehicle: () => void,
) => {
  // Check to see if vehicle details is still valid after LOA has been deselected
  const {
    filteredVehicleOptions,
    updatedVehicle,
  } = getUpdatedVehicleDetailsForLOAs(
    selectedLOAs,
    vehicleOptions,
    vehicleFormData,
    ineligiblePowerUnitSubtypes,
    ineligibleTrailerSubtypes,
  );

  const vehicleIdInForm = vehicleFormData.vehicleId;
  const updatedVehicleId = updatedVehicle.vehicleId;
  useEffect(() => {
    // If vehicle originally selected exists but the updated vehicle is cleared, clear the vehicle
    if (vehicleIdInForm && !updatedVehicleId) {
      onClearVehicle();
    }
  }, [
    vehicleIdInForm,
    updatedVehicleId,
  ]);

  return {
    filteredVehicleOptions,
  };
};
