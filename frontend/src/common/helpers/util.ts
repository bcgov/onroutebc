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
 * @returns An Object with only valid values.
 *
 * @see https://dev.to/typescripttv/what-is-the-difference-between-null-and-undefined-5h76
 */
export const replaceEmptyValuesWithNull = (obj: object): any => {
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