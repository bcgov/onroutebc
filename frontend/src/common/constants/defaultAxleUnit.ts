import { AxleUnit } from "../types/AxleUnit";

export const defaultTireSizeOption = {
  name: '279.4 (11")',
  size: 279,
};

export const DEFAULT_AXLE_UNIT: AxleUnit = {
  numberOfAxles: 1,
  numberOfTires: null,
  tireSize: defaultTireSizeOption.size,
  axleSpread: null,
  axleUnitWeight: null,
};
