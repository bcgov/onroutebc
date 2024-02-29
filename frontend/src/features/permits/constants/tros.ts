import { tros } from "./tros.json";
import { Commodities } from "../types/application";

export const TROS_INELIGIBLE_POWERUNITS = [...tros.ineligiblePowerUnitSubtypes];
export const TROS_INELIGIBLE_TRAILERS = [...tros.ineligibleTrailerSubtypes];
export const TROS_COMMODITIES: Commodities[] = [...tros.commodities];
export const MANDATORY_TROS_COMMODITIES: Commodities[] = 
  TROS_COMMODITIES.filter(
    (commodity: Commodities) =>
      commodity.condition === "CVSE-1000" || commodity.condition === "CVSE-1070"
  );
