/**
 * Remove all the null and undefined fields.
 * @param obj The object to remove empty values from.
 * @returns An Object with only valid values.
 *
 * @see https://bobbyhadz.com/blog/javascript-remove-null-values-from-object
 */
export const removeEmptyValues = (obj: Object): Object => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, value]) => value != null && value !== "" && value.length > 0)
      .map(([key, value]) => [
        key,
        value === Object(value) ? removeEmptyValues(value) : value,
      ])
  );
};
