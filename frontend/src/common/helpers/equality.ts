import { Nullable } from "../types/common";

/**
 * Check if two nullable values are different.
 * @param val1 First nullable value to be compared
 * @param val2 Second nullable value to be compared
 * @returns boolean value indicating if values are different.
 */
export const areValuesDifferent = <T>(
  val1?: Nullable<T>,
  val2?: Nullable<T>,
): boolean => {
  if (!val1 && !val2) return false; // both empty === equal

  if ((val1 && !val2) || (!val1 && val2) || (val1 && val2 && val1 !== val2)) {
    return true; // one empty, or both non-empty but different
  }

  return false; // values are equal otherwise
};

/**
 * Determine whether or not two arrays, each with only unique primitive values, have the same values.
 * @param arr1 First array consisting of only non-duplicate primitive values
 * @param arr2 Second array consisting of only non-duplicate primitive values
 * @returns Whether or not the two arrays have the same values
 */
export const doUniqueArraysHaveSameItems = <T extends (number | string)>(
  arr1: T[],
  arr2: T[],
) => {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  for (const val of set1) {
    if (!set2.has(val)) return false;
  }

  for (const val of set2) {
    if (!set1.has(val)) return false;
  }
  
  return true;
};
