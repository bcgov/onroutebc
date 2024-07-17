/**
 * Evaluates the given predicate and returns the value if the predicate is true or the value is not null, otherwise returns undefined.
 *
 * @param {T} value - The value to be returned if the predicate evaluates to true or the value is not null.
 * @param {() => boolean} [predicate] - An optional function that returns a boolean indicating whether the value should be substituted.
 * @returns {T | undefined} - The value if predicate evaluates to true or the value is not null, otherwise undefined.
 */
export const undefinedSubstitution = <T>(
  value: T,
  predicate?: () => boolean,
): T | undefined => {
  let result: T | undefined;

  if (predicate) {
    result = predicate() ? value : undefined;
  } else {
    result = value !== null ? value : undefined;
  }

  return result;
};
