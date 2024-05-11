import { tros } from "./tros.json";
import { PermitCommodity } from "../types/PermitCommodity";
import { BASE_DAYS_IN_YEAR } from "./constants";

export const TROS_INELIGIBLE_POWERUNITS = [...tros.ineligiblePowerUnitSubtypes];
export const TROS_INELIGIBLE_TRAILERS = [...tros.ineligibleTrailerSubtypes];
export const TROS_COMMODITIES: PermitCommodity[] = [...tros.commodities];
export const MANDATORY_TROS_COMMODITIES: PermitCommodity[] = 
  TROS_COMMODITIES.filter(
    (commodity: PermitCommodity) =>
      commodity.condition === "CVSE-1000" || commodity.condition === "CVSE-1070"
  );

export const MIN_TROS_DURATION = 30;
export const TROS_DURATION_OPTIONS = [
  { value: MIN_TROS_DURATION, label: "30 Days" },
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
