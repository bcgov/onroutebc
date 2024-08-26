import { tros } from "./tros.json";
import { PermitCondition } from "../types/PermitCondition";
import {
  BASE_DAYS_IN_YEAR,
  COMMON_DURATION_OPTIONS,
  COMMON_MIN_DURATION,
  TERM_DURATION_INTERVAL_DAYS,
} from "./constants";

export const TROS_INELIGIBLE_POWERUNITS = [...tros.ineligiblePowerUnitSubtypes];
export const TROS_INELIGIBLE_TRAILERS = [...tros.ineligibleTrailerSubtypes];
export const TROS_CONDITIONS: PermitCondition[] = [...tros.conditions];
export const MANDATORY_TROS_CONDITIONS: PermitCondition[] = 
  TROS_CONDITIONS.filter(
    ({ condition }: PermitCondition) =>
      condition === "CVSE-1000" || condition === "CVSE-1070"
  );

export const MIN_TROS_DURATION = COMMON_MIN_DURATION;
export const MAX_TROS_DURATION = BASE_DAYS_IN_YEAR;
export const TROS_DURATION_OPTIONS = [...COMMON_DURATION_OPTIONS];
export const TROS_DURATION_INTERVAL_DAYS = TERM_DURATION_INTERVAL_DAYS;
