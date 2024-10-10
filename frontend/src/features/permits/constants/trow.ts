import { trow } from "./trow.json";
import { PermitCondition } from "../types/PermitCondition";
import {
  BASE_DAYS_IN_YEAR,
  COMMON_DURATION_OPTIONS,
  COMMON_MIN_DURATION, 
  TERM_DURATION_INTERVAL_DAYS,
} from "./constants";

export const TROW_INELIGIBLE_POWERUNITS = [...trow.ineligiblePowerUnitSubtypes];
export const TROW_INELIGIBLE_TRAILERS = [...trow.ineligibleTrailerSubtypes];
export const TROW_CONDITIONS: PermitCondition[] = [...trow.conditions];
export const MANDATORY_TROW_CONDITIONS: PermitCondition[] = [...TROW_CONDITIONS];
export const MIN_TROW_DURATION = COMMON_MIN_DURATION;
export const MAX_TROW_DURATION = BASE_DAYS_IN_YEAR;
export const TROW_DURATION_OPTIONS = [...COMMON_DURATION_OPTIONS];
export const TROW_DURATION_INTERVAL_DAYS = TERM_DURATION_INTERVAL_DAYS;
