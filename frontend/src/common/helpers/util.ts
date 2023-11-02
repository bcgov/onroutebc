/**
 * Remove all the null, undefined and empty fields (including arrays).
 * @param obj The object to remove empty values from.
 * @returns An Object with only valid values.
 *
 * @see https://bobbyhadz.com/blog/javascript-remove-null-values-from-object
 */
export const removeEmptyValues = (obj: object): object => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_key, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value != null && value !== "";
      })
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return [key, value];
        }
        return [
          key,
          typeof value === "object" ? removeEmptyValues(value) : value,
        ];
      })
  );
};

/**
 * Replace undefined and empty fields with null (including arrays).
 * 
 * The function takes an obj parameter, which can be any JavaScript object.
 * If the object is an array, it calls the replaceEmptyWithNull function recursively on each item in the array and returns the resulting array.
 * If the object is an object (i.e., not an array and not null), it uses Object.entries to get an array of [key, value] pairs for each property in the object. It then reduces that array into a new object with the same keys, but with each value replaced by the result of calling replaceEmptyWithNull on it.
 * If the object is not an array and not an object, it checks whether the value is undefined or an empty string (''). If it is, it returns null. Otherwise, it returns the original value.

 * @param obj The object to replace empty values from.
 * @returns An Object with only valid values
 *
 * @see https://dev.to/typescripttv/what-is-the-difference-between-null-and-undefined-5h76
 */
export const replaceEmptyValuesWithNull = (obj: object): object | null => {
  if (Array.isArray(obj)) {
    return obj.map((item) => replaceEmptyValuesWithNull(item));
  } 
  else if (typeof obj === 'object' && obj !== null) {
    // acc is a shorthand name for the accumulator object that's being built up by the reduce function
    return Object.entries(obj).reduce((acc : any, [key, value]) => {
      acc[key] = replaceEmptyValuesWithNull(value);
      return acc;
    }, {});
  } 
  else {
    return obj === undefined || obj === '' ? null : obj;
  }
}

/**
 * Apply a function to an input value only when the input is non-nullable/undefined.
 * 
 * Eg. applyWhenNotNullable(someFn, "abc", "") === someFn("abc")
 * 
 * Eg. applyWhenNotNullable(someFn, null, 123) === 123
 * 
 * @param applyFn Function to apply when inputVal is non-nullable
 * @param inputVal Potentially nullable/undefined input value
 * @param explicitDefaultVal Explicit (optional) default value to return when input is nullable
 * 
 * @returns Result of applyFn, or explicitDefaultVal 
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const applyWhenNotNullable = <T>(applyFn: (val: T) => any, inputVal?: T | null, explicitDefaultVal?: any) => {
  return inputVal != null ? applyFn(inputVal) : explicitDefaultVal;
};

/**
 * Get the first non-null/undefined value from a list of provided values (ordered from nullable to non-nullable).
 * 
 * Eg. getDefaultNullableVal(undefined, 0) === 0
 * 
 * Eg. getDefaultNullableVal(undefined, null, null) === undefined
 * 
 * @param defaultVals List of provided possibly nullable values (ordered from nullable to non-nullable)
 * 
 * @returns The first non-nullable value from defaultVals, or undefined if there are no non-nullable values.
 */
export const getDefaultNullableVal = <T>(...defaultVals: (T | null | undefined)[]): T | undefined => {
  return defaultVals.find(val => val != null) ?? undefined;
};

/**
 * Get the first non-nullable value from a list of provided values (ordered from nullable to non-nullable).
 * 
 * Eg. getDefaultRequiredVal(0, undefined, null) === 0
 * 
 * Eg. getDefaultRequiredVal("", null, undefined, "somestr") === "somestr"
 * 
 * @param fallbackDefault Required non-nullable default value to return if all other provided default values are null/undefined
 * @param defaultVals List of provided possibly nullable values (ordered from nullable to non-nullable)
 * 
 * @returns The first non-nullable value from defaultVals, or fallbackDefault if there are no non-nullable values.
 */
export const getDefaultRequiredVal = <T>(fallbackDefault: T, ...defaultVals: (T | null | undefined)[]): T => {
  return defaultVals.find(val => val != null) ?? fallbackDefault;
};

/**
 * Check if two nullable values are different.
 * @param val1 First nullable value to be compared
 * @param val2 Second nullable value to be compared
 * @returns boolean value indicating if values are different.
 */
export const areValuesDifferent = <T>(val1?: T | null, val2?: T | null): boolean => {
  if (!val1 && !val2) return false; // both empty === equal

  if (
    (val1 && !val2) 
    || (!val1 && val2) 
    || (val1 && val2 && val1 !== val2)
  ) {
    return true; // one empty, or both non-empty but different === different
  }

  return false; // values are equal otherwise
};
