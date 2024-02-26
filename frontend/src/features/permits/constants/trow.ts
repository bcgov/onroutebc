import { Commodities } from "../types/application";
import { trow } from "./trow.json";

export const TROW_INELIGIBLE_POWERUNITS = [...trow.ineligiblePowerUnitSubtypes];
export const TROW_INELIGIBLE_TRAILERS = [...trow.ineligibleTrailerSubtypes];
export const TROW_COMMODITIES: Commodities[] = [...trow.commodities];
