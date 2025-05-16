import { useEffect } from "react";
import { isNull, Nullable, RequiredOrNull } from "../../../common/types/common";
import { getVehicleWeightStatusForCLF } from "../helpers/vehicles/configuration/getVehicleWeightStatusForCLF";
import { ConditionalLicensingFeeType } from "../types/ConditionalLicensingFee";
import { PERMIT_TYPES, PermitType } from "../types/PermitType";

export const useVehicleWeights = (
  permitType: PermitType,
  onUpdateLoadedGVW: (updatedLoadedGVW: RequiredOrNull<number>) => void,
  onUpdateNetWeight: (updatedNetWeight: RequiredOrNull<number>) => void,
  selectedVehicleSubtype?: Nullable<string>,
  selectedCLF?: Nullable<ConditionalLicensingFeeType>,
  currentLoadedGVW?: Nullable<number>,
  currentNetWeight?: Nullable<number>,
) => {
  const isNonResidentPermitType = ([
    PERMIT_TYPES.NRSCV,
    PERMIT_TYPES.NRQCV,
  ] as PermitType[]).includes(permitType);

  const { enableLoadedGVW, enableNetWeight } = getVehicleWeightStatusForCLF(
    !selectedVehicleSubtype,
    selectedCLF,
  );

  useEffect(() => {
    if (isNonResidentPermitType) {
      if (!enableLoadedGVW && !isNull(currentLoadedGVW)) {
        onUpdateLoadedGVW(null);
      }
    }
  }, [isNonResidentPermitType, currentLoadedGVW, enableLoadedGVW]);

  useEffect(() => {
    if (isNonResidentPermitType) {
      if (!enableNetWeight && !isNull(currentNetWeight)) {
        onUpdateNetWeight(null);
      }
    }
  }, [isNonResidentPermitType, currentNetWeight, enableNetWeight]);

  return {
    enableLoadedGVW,
    enableNetWeight,
  };
};
