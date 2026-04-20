import { defaultTireSizeOption } from "../constants/defaultAxleUnit";
import { AxleConfiguration, AxleUnit } from "../types/AxleUnit";
import { getDefaultRequiredVal } from "./util";

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

export const convertCentimetreValuesToMetres = (axleUnit: AxleUnit) => {
  return {
    ...axleUnit,
    axleSpread: axleUnit.axleSpread
      ? axleUnit.axleSpread / 100
      : axleUnit.axleSpread,
    interaxleSpacing: axleUnit.interaxleSpacing
      ? axleUnit.interaxleSpacing / 100
      : axleUnit.interaxleSpacing,
  };
};

export const getDefaultAxleConfiguration = (
  axleUnit: AxleUnit,
): AxleConfiguration => {
  return {
    numberOfAxles: getDefaultRequiredVal(0, axleUnit.numberOfAxles),
    axleSpread: getDefaultRequiredVal(undefined, axleUnit.axleSpread),
    interaxleSpacing: getDefaultRequiredVal(
      undefined,
      axleUnit.interaxleSpacing,
    ),
    axleUnitWeight: getDefaultRequiredVal(0, axleUnit.axleUnitWeight),
    numberOfTires: getDefaultRequiredVal(0, axleUnit.numberOfTires),
    tireSize: getDefaultRequiredVal(
      defaultTireSizeOption.size,
      axleUnit.tireSize,
    ),
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

/** Separates interaxleSpacing property into its own axleUnit object, e.g. the opposite behaviour of mergeInteraxleSpacing */
export const unmergeInteraxleSpacingRows = (
  axleConfiguration: AxleUnit[],
  startIndex: number,
) => {
  const unmerged = axleConfiguration.map((axle) => ({ ...axle }));

  for (let i = startIndex; i < unmerged.length; i++) {
    const spacing = getDefaultRequiredVal(null, unmerged[i].interaxleSpacing);
    unmerged.splice(i, 0, { interaxleSpacing: spacing });

    // remove spacing value from the axle row since it now lives in the inserted spacing row
    unmerged[i + 1].interaxleSpacing = null;

    i++; // skip over the axle row we just processed
  }

  return unmerged;
};
