import { getDefaultRequiredVal } from "../../../common/helpers/util";
import { Nullable, RequiredOrNull } from "../../../common/types/common";
import { PermittedCommodity } from "../types/PermittedCommodity";
import { PERMIT_TYPES, PermitType } from "../types/PermitType";

/**
 * Get default permitted commodity data for an application/permit, or null if not applicable.
 * @param permitType Permit type
 * @param commodityTypes List of selectable commodity types
 * @param permittedCommodity Permitted commodity data if it already exists
 * @returns Default permitted commodity data, or null
 */
export const getDefaultPermittedCommodity = (
  permitType: PermitType,
  commodityTypes: string[],
  permittedCommodity?: Nullable<PermittedCommodity>,
): RequiredOrNull<PermittedCommodity> => {
  if (permitType !== PERMIT_TYPES.STOS) return null;

  const defaultCommodityType = commodityTypes.length > 0 ? commodityTypes[0] : "";
  return {
    commodityType: getDefaultRequiredVal(
      defaultCommodityType,
      permittedCommodity?.commodityType,
    ),
    loadDescription: getDefaultRequiredVal(
      "",
      permittedCommodity?.loadDescription,
    ),
  };
};