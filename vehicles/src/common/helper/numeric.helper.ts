import { Nullable } from "../types/common";

export const formatNumber = (value?: Nullable<number>, decimalPlaces?: number) => {
  if ((value === undefined) || (!value && value == null)) return undefined;

  return value.toLocaleString(
    "en-CA",
    {
      minimumFractionDigits: decimalPlaces ?? 0,
      maximumFractionDigits: decimalPlaces ?? 0,
    },
  );
};
