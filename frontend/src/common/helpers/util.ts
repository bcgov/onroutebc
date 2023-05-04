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
          return value;
        }
        return [
          key,
          typeof value === "object" ? removeEmptyValues(value) : value,
        ];
      })
  );
};
