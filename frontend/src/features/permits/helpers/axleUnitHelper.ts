import { getDefaultRequiredVal } from "../../../common/helpers/util";
import { DEFAULT_TIRE_SIZE_OPTION } from "../constants/constants";
import { AxleConfiguration, AxleUnit } from "../types/AxleUnit";

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
      DEFAULT_TIRE_SIZE_OPTION.size,
      axleUnit.tireSize,
    ),
    vehicleIndex: getDefaultRequiredVal(undefined, axleUnit.vehicleIndex),
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

/** Validates an axle configuration array */
export const validateAxleConfiguration = (
  axleConfiguration: AxleUnit[],
): boolean => {
  return axleConfiguration.every((axleUnit, index) => {
    const hasRequiredFields =
      axleUnit.numberOfAxles !== null &&
      axleUnit.numberOfTires !== null &&
      axleUnit.tireSize !== null &&
      axleUnit.axleUnitWeight !== null;

    // axleSpread is required unless numberOfAxles === 1
    const hasAxleSpread =
      getDefaultRequiredVal(0, axleUnit.numberOfAxles) <= 1 ||
      axleUnit.axleSpread !== null;

    // interaxleSpacing is required for all but the first axle unit (i.e. the first axle unit of the power unit)
    const hasInteraxleSpacing =
      index === 0 || axleUnit.interaxleSpacing !== null;

    return hasRequiredFields && hasAxleSpread && hasInteraxleSpacing;
  });
};
