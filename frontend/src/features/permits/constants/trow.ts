import { trow } from "./trow.json";
import { PermitCommodity } from "../types/PermitCommodity";
import {
  COMMON_DURATION_OPTIONS,
  COMMON_MIN_DURATION, 
  TERM_DURATION_INTERVAL_DAYS,
} from "./constants";

export const TROW_INELIGIBLE_POWERUNITS = [...trow.ineligiblePowerUnitSubtypes];
export const TROW_INELIGIBLE_TRAILERS = [...trow.ineligibleTrailerSubtypes];
export const TROW_COMMODITIES: PermitCommodity[] = [...trow.commodities];
export const MANDATORY_TROW_COMMODITIES: PermitCommodity[] = [...TROW_COMMODITIES];
export const MIN_TROW_DURATION = COMMON_MIN_DURATION;
export const TROW_DURATION_OPTIONS = [...COMMON_DURATION_OPTIONS];
export const TROW_DURATION_INTERVAL_DAYS = TERM_DURATION_INTERVAL_DAYS;
