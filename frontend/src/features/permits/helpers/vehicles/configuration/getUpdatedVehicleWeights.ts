import { Nullable } from "../../../../../common/types/common";
import { PERMIT_TYPES, PermitType } from "../../../types/PermitType";

/**
 * Get updated values for loaded GVW and net weight.
 * @param permitType Permit type
 * @param enableLoadedGVW Whether or not loaded GVW is enabled
 * @param enableNetWeight Whether or not net weight is enabled
 * @param currentLoadedGVW Current value for loaded GVW
 * @param currentNetWeight Current value for net weight
 * @returns Updated values for loaded GVW and net weight
 */
export const getUpdatedVehicleWeights = (
  permitType: PermitType,
  enableLoadedGVW: boolean,
  enableNetWeight: boolean,
  currentLoadedGVW?: Nullable<number>,
  currentNetWeight?: Nullable<number>,
) => {
  const isNonResidentPermitType = ([
    PERMIT_TYPES.NRSCV,
    PERMIT_TYPES.NRQCV,
  ] as PermitType[]).includes(permitType);

  if (!isNonResidentPermitType) {
    return {
      updatedLoadedGVW: null,
      updatedNetWeight: null,
    };
  }

  return {
    updatedLoadedGVW: !enableLoadedGVW ? null : currentLoadedGVW,
    updatedNetWeight: !enableNetWeight ? null : currentNetWeight,
  };
};
