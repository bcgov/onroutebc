import { useEffect } from "react";

import { PermitVehicleDetails } from "../types/PermitVehicleDetails";
import { PowerUnit, Trailer } from "../../manageVehicles/types/Vehicle";
import { LOADetail } from "../../settings/types/SpecialAuthorization";
import { getUpdatedVehicleDetailsForLOAs } from "../helpers/permitLOA";

export const usePermitVehicleForLOAs = (
  vehicleFormData: PermitVehicleDetails,
  vehicleOptions: (PowerUnit | Trailer)[],
  selectedLOAs: LOADetail[],
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
    onClearVehicle,
  ]);

  return {
    filteredVehicleOptions,
  };
};
