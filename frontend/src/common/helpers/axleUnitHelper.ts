import { AxleUnit } from "../types/AxleUnit";

export const convertMetreValuesToCentimetres = (axleUnit: AxleUnit) => {
  return {
    ...axleUnit,
    axleSpread: axleUnit.axleSpread
      ? Math.round(axleUnit.axleSpread * 100)
      : axleUnit.axleSpread,
    interaxleSpacing: axleUnit.interaxleSpacing
      ? Math.round(axleUnit.interaxleSpacing * 100)
      : axleUnit.interaxleSpacing,
  };
};

/** Removes individual interaxle spacing objects and merges their value into the next axleConfiguration object */
export const mergeInteraxleSpacing = (
  axleConfiguration: AxleUnit[],
  startIndex: number,
) => {
  const merged = [...axleConfiguration];
  for (let i = startIndex; i < merged.length - 1; i++) {
    merged[i + 1].interaxleSpacing = merged[i].interaxleSpacing;
    merged.splice(i, 1);
  }

  return merged;
};
