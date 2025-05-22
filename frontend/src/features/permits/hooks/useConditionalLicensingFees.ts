import { useEffect, useMemo } from "react";

import { Nullable, RequiredOrNull } from "../../../common/types/common";
import { getAvailableCLFs } from "../helpers/conditionalLicensingFee/getAvailableCLFs";
import { ConditionalLicensingFeeType } from "../types/ConditionalLicensingFee";
import { PermitType } from "../types/PermitType";
import { getUpdatedCLF } from "../helpers/conditionalLicensingFee/getUpdatedCLF";

export const useConditionalLicensingFees = (
  permitType: PermitType,
  onUpdateCLF: (updatedCLF: RequiredOrNull<ConditionalLicensingFeeType>) => void,
  selectedCLF?: Nullable<ConditionalLicensingFeeType>,
  vehicleSubtype?: Nullable<string>,
) => {
  const availableCLFs = useMemo(
    () => getAvailableCLFs(vehicleSubtype),
    [vehicleSubtype],
  );

  const updatedCLF = getUpdatedCLF(
    permitType,
    availableCLFs,
    selectedCLF,
  );

  // Change the selected CLF based on changes to list of available CLFs
  useEffect(() => {
    if (selectedCLF !== updatedCLF) {
      onUpdateCLF(updatedCLF);
    }
  }, [selectedCLF, updatedCLF]);

  return {
    availableCLFs,
  };
};
