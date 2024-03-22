import { trow } from "./trow.json";
import { PermitCommodity } from "../types/PermitCommodity";

export const TROW_INELIGIBLE_POWERUNITS = [...trow.ineligiblePowerUnitSubtypes];
export const TROW_INELIGIBLE_TRAILERS = [...trow.ineligibleTrailerSubtypes];
export const TROW_COMMODITIES: PermitCommodity[] = [...trow.commodities];
export const MANDATORY_TROW_COMMODITIES: PermitCommodity[] = [
  ...TROW_COMMODITIES,
];
