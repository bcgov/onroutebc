import { useEffect } from "react";
import { useMemoizedArray } from "../../../common/hooks/useMemoizedArray";
import { Nullable } from "../../../common/types/common";
import { getAvailableCLFs } from "../helpers/conditionalLicensingFee/getAvailableCLFs";
import { CONDITIONAL_LICENSING_FEE_TYPES, ConditionalLicensingFeeType } from "../types/ConditionalLicensingFee";
import { PERMIT_TYPES, PermitType } from "../types/PermitType";

export const useConditionalLicensingFees = (
  permitType: PermitType,
  onUpdateCLF: (updatedCLF: ConditionalLicensingFeeType) => void,
  selectedCLF?: Nullable<ConditionalLicensingFeeType>,
  vehicleSubtype?: Nullable<string>,
) => {
  const availableCLFs = useMemoizedArray(
    getAvailableCLFs(vehicleSubtype),
    clf => clf,
    (clf1, clf2) => clf1 === clf2,
  );

  // Change the selected CLF based on changes to list of available CLFs
  useEffect(() => {
    if (([
      PERMIT_TYPES.NRSCV,
      PERMIT_TYPES.NRQCV,
    ] as PermitType[]).includes(permitType)) {
      if (availableCLFs.length === 0 && selectedCLF !== CONDITIONAL_LICENSING_FEE_TYPES.NONE) {
        // When there are no available CLFs to select, the default CLF would be "none"
        onUpdateCLF(CONDITIONAL_LICENSING_FEE_TYPES.NONE);
      } else if (!selectedCLF) {
        // Upon initialization of the form, and there are no currently selected CLF yet,
        // the default selection should be the first available CLF
        onUpdateCLF(availableCLFs[0]);
      } else if (!availableCLFs.includes(selectedCLF)) {
        // When there are available CLFs that can be selected, and the selected CLF
        // is not one of the available CLFs, default the selection to become the first available CLF
        onUpdateCLF(availableCLFs[0]);
      }
    }
  }, [permitType, selectedCLF, availableCLFs]);

  return {
    availableCLFs,
  };
};
