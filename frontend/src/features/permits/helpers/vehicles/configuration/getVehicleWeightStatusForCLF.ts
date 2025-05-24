import { Nullable } from "../../../../../common/types/common";
import {
  CONDITIONAL_LICENSING_FEE_TYPES,
  ConditionalLicensingFeeType,
} from "../../../types/ConditionalLicensingFee";

/**
 * Determines the enabling status of vehicle weight for a permit given a chosen CLF.
 * @param isVehicleSubtypeEmpty Whether or not chosen vehicle subtype is empty for permit
 * @param clf Given conditional licensing fee type
 * @returns Whether or not to enable Loaded GVW and Net Weight of a permit
 */
export const getVehicleWeightStatusForCLF = (
  isVehicleSubtypeEmpty: boolean,
  clf?: Nullable<ConditionalLicensingFeeType>,
) => {
  if (isVehicleSubtypeEmpty)
    return {
      enableLoadedGVW: false,
      enableNetWeight: false,
    };
  
  switch (clf) {
    case CONDITIONAL_LICENSING_FEE_TYPES.INDUSTRIAL_X_PLATE_TYPE_FEE_RATE:
    case CONDITIONAL_LICENSING_FEE_TYPES.CONDITIONAL_LICENSING_FEE_RATE:
    case CONDITIONAL_LICENSING_FEE_TYPES.NONE:
      return {
        enableLoadedGVW: true,
        enableNetWeight: false,
      };
    case CONDITIONAL_LICENSING_FEE_TYPES.FARM_VEHICLE_FEE_RATE:
      return {
        enableLoadedGVW: false,
        enableNetWeight: true,
      };
    case CONDITIONAL_LICENSING_FEE_TYPES.FARM_TRACTOR_FEE_RATE:
    default:
      return {
        enableLoadedGVW: false,
        enableNetWeight: false,
      };
  }
};
