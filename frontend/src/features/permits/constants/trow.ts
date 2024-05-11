import { trow } from "./trow.json";
import { PermitCommodity } from "../types/PermitCommodity";
import { BASE_DAYS_IN_YEAR } from "./constants";

export const TROW_INELIGIBLE_POWERUNITS = [...trow.ineligiblePowerUnitSubtypes];
export const TROW_INELIGIBLE_TRAILERS = [...trow.ineligibleTrailerSubtypes];
export const TROW_COMMODITIES: PermitCommodity[] = [...trow.commodities];
export const MANDATORY_TROW_COMMODITIES: PermitCommodity[] = [...TROW_COMMODITIES];
export const MIN_TROW_DURATION = 30;
export const TROW_DURATION_OPTIONS = [
  { value: MIN_TROW_DURATION, label: "30 Days" },
  { value: 60, label: "60 Days" },
  { value: 90, label: "90 Days" },
  { value: 120, label: "120 Days" },
  { value: 150, label: "150 Days" },
  { value: 180, label: "180 Days" },
  { value: 210, label: "210 Days" },
  { value: 240, label: "240 Days" },
  { value: 270, label: "270 Days" },
  { value: 300, label: "300 Days" },
  { value: 330, label: "330 Days" },
  { value: BASE_DAYS_IN_YEAR, label: "1 Year" },
];
