import { tros } from "./tros.json";
import { Commodities } from "../types/application";

export const TROS_INELIGIBLE_POWERUNITS = [...tros.ineligiblePowerUnitSubtypes];
export const TROS_INELIGIBLE_TRAILERS = [...tros.ineligibleTrailerSubtypes];
export const TROS_COMMODITIES: Commodities[] = [...tros.commodities];
