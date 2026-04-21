import { AxleUnit } from "../types/AxleUnit";

export const DEFAULT_TIRE_SIZE_OPTION = {
  name: '279.4 (11")',
  size: 279,
};

export const DEFAULT_AXLE_UNIT: AxleUnit = {
  numberOfAxles: 1,
  numberOfTires: null,
  tireSize: DEFAULT_TIRE_SIZE_OPTION.size,
  axleSpread: null,
  axleUnitWeight: null,
};
