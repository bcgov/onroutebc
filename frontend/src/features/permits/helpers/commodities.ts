import {
  MANDATORY_TROS_COMMODITIES,
  TROS_COMMODITIES,
} from "../constants/tros";
import {
  MANDATORY_TROW_COMMODITIES,
  TROW_COMMODITIES,
} from "../constants/trow";
import { PermitCommodity } from "../types/PermitCommodity";
import { PERMIT_TYPES, PermitType } from "../types/PermitType";

/**
 * Get mandatory commodities that must be selected for a permit type.
 * @param permitType Permit type to get the commodities for
 * @returns Mandatory commodities that will be automatically selected
 */
export const getMandatoryCommodities = (permitType: PermitType) => {
  switch (permitType) {
    case PERMIT_TYPES.TROW:
      return MANDATORY_TROW_COMMODITIES;
    case PERMIT_TYPES.TROS:
      return MANDATORY_TROS_COMMODITIES;
    default:
      return [];
  }
};

const getCommoditiesByPermitType = (permitType: PermitType) => {
  switch (permitType) {
    case PERMIT_TYPES.TROW:
      return TROW_COMMODITIES;
    case PERMIT_TYPES.TROS:
      return TROS_COMMODITIES;
    default:
      return [];
  }
};

const isCommodityMandatory = (
  commodity: PermitCommodity,
  mandatoryCommodities: PermitCommodity[],
) => {
  return mandatoryCommodities
    .map((mandatoryCommodity) => mandatoryCommodity.condition)
    .includes(commodity.condition);
};

/**
 * Get default commodities (in their initial states) for a permit/application form.
 * @param permitType Permit type to get the commodities for
 * @returns Default commodities for a given permit type
 */
export const getDefaultCommodities = (permitType: PermitType) => {
  const mandatoryCommodities = getMandatoryCommodities(permitType);

  return getCommoditiesByPermitType(permitType).map((commodity) => ({
    ...commodity,
    // must-select options are checked and disabled (for toggling) by default
    checked: isCommodityMandatory(commodity, mandatoryCommodities),
    disabled: isCommodityMandatory(commodity, mandatoryCommodities),
  }));
};
