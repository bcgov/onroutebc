import { Nullable } from "../../types/common";
import { getDefaultRequiredVal } from "../util";

export const formatNumber = (
  value?: Nullable<number>,
  decimalPlaces?: number,
) => {
  if (value == null) return undefined;

  const fractionDigits = getDefaultRequiredVal(0, decimalPlaces);

  return value.toLocaleString("en-CA", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};
