import { useEffect } from "react";
import { Nullable } from "../../../common/types/common";
import { getVehicleWeightStatusForCLF } from "../helpers/vehicles/configuration/getVehicleWeightStatusForCLF";
import { ConditionalLicensingFeeType } from "../types/ConditionalLicensingFee";
import { PermitType } from "../types/PermitType";
import { getUpdatedVehicleWeights } from "../helpers/vehicles/configuration/getUpdatedVehicleWeights";

export const useVehicleWeights = (
  permitType: PermitType,
  onUpdateLoadedGVW: (updatedLoadedGVW: Nullable<number>) => void,
  onUpdateNetWeight: (updatedNetWeight: Nullable<number>) => void,
  selectedVehicleSubtype?: Nullable<string>,
  selectedCLF?: Nullable<ConditionalLicensingFeeType>,
  currentLoadedGVW?: Nullable<number>,
  currentNetWeight?: Nullable<number>,
) => {
  const { enableLoadedGVW, enableNetWeight } = getVehicleWeightStatusForCLF(
    !selectedVehicleSubtype,
    selectedCLF,
  );

  const { updatedLoadedGVW, updatedNetWeight } = getUpdatedVehicleWeights(
    permitType,
    enableLoadedGVW,
    enableNetWeight,
    currentLoadedGVW,
    currentNetWeight,
  );

  useEffect(() => {
    if (currentLoadedGVW !== updatedLoadedGVW) {
      onUpdateLoadedGVW(updatedLoadedGVW);
    }
  }, [currentLoadedGVW, updatedLoadedGVW]);

  useEffect(() => {
    if (currentNetWeight !== updatedNetWeight) {
      onUpdateNetWeight(updatedNetWeight);
    }
  }, [currentNetWeight, updatedNetWeight]);

  return {
    enableLoadedGVW,
    enableNetWeight,
  };
};
