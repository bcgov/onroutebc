import { Nullable } from "../../../../common/types/common";
import { CONDITIONAL_LICENSING_FEE_TYPES, ConditionalLicensingFeeType } from "../../types/ConditionalLicensingFee";
import { PERMIT_TYPES, PermitType } from "../../types/PermitType";

/**
 * Get updated conditional licensing fee type that should be selected for a permit.
 * @param permitType Permit type
 * @param availableCLFs List of available conditional licensing fee types that can be chosen
 * @param selectedCLF Currently selected conditional licensing fee type for the permit
 * @returns Updated conditional licensing fee type that should be selected
 */
export const getUpdatedCLF = (
  permitType: PermitType,
  availableCLFs: ConditionalLicensingFeeType[],
  selectedCLF?: Nullable<ConditionalLicensingFeeType>,
) => {
  if (!([
    PERMIT_TYPES.NRSCV,
    PERMIT_TYPES.NRQCV,
  ] as PermitType[]).includes(permitType)) {
    return null;
  }

  if (availableCLFs.length === 0) {
    // When there are no available CLFs to select, the default CLF would be "none"
    return CONDITIONAL_LICENSING_FEE_TYPES.NONE;
  }
  
  if (!selectedCLF) {
    // Upon initialization of the form, and there are no currently selected CLF yet,
    // the default selection should be the first available CLF
    return availableCLFs[0];
  }
  
  // When there are available CLFs that can be selected, and the selected CLF
  // is not one of the available CLFs, default the selection to become the first available CLF
  return !availableCLFs.includes(selectedCLF) ? availableCLFs[0] : selectedCLF;
};
