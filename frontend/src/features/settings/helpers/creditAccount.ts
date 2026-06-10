
  /**
 * Determine whether or not a user can view/access suspend page/features given their roles.
 * @param userClaims claims that a user have
 * @returns Whether or not the user can view the suspend page/features
 */
  const toSentenceCase = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  /**
 * Determine whether or not a user can view/access suspend page/features given their roles.
 * @param userClaims claims that a user have
 * @returns Whether or not the user can view the suspend page/features
 */
 const formatValue = (value: number | string): string => {
    if (typeof value === "number" || !isNaN(Number(value))) {
      return new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(value));
    } else {
      return toSentenceCase(value);
    }
  };

  /**
 * Determine whether or not a user can view/access suspend page/features given their roles.
 * @param userClaims claims that a user have
 * @returns Whether or not the user can view the suspend page/features
 */
  export const renderValue = (value: number | string): string => {
    if (typeof value === "number" || !isNaN(Number(value))) {
      value = Number(value);
      return `${value < 0 ? "-$" : "$"}${formatValue(Math.abs(value))}`;
    } else {
      return formatValue(value);
    }
  };