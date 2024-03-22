import { tros } from "./tros.json";
import { PermitCommodity } from "../types/PermitCommodity";

export const TROS_INELIGIBLE_POWERUNITS = [...tros.ineligiblePowerUnitSubtypes];
export const TROS_INELIGIBLE_TRAILERS = [...tros.ineligibleTrailerSubtypes];
export const TROS_COMMODITIES: PermitCommodity[] = [...tros.commodities];
export const MANDATORY_TROS_COMMODITIES: PermitCommodity[] =
  TROS_COMMODITIES.filter(
    (commodity: PermitCommodity) =>
      commodity.condition === "CVSE-1000" ||
      commodity.condition === "CVSE-1070",
  );
