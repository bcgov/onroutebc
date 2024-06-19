import { tros } from "./tros.json";
import { PermitCommodity } from "../types/PermitCommodity";
import { COMMON_DURATION_OPTIONS, COMMON_MIN_DURATION } from "./constants";

export const TROS_INELIGIBLE_POWERUNITS = [...tros.ineligiblePowerUnitSubtypes];
export const TROS_INELIGIBLE_TRAILERS = [...tros.ineligibleTrailerSubtypes];
export const TROS_COMMODITIES: PermitCommodity[] = [...tros.commodities];
export const MANDATORY_TROS_COMMODITIES: PermitCommodity[] = 
  TROS_COMMODITIES.filter(
    (commodity: PermitCommodity) =>
      commodity.condition === "CVSE-1000" || commodity.condition === "CVSE-1070"
  );

export const MIN_TROS_DURATION = COMMON_MIN_DURATION;
export const TROS_DURATION_OPTIONS = [...COMMON_DURATION_OPTIONS];
