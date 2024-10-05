import { Nullable } from "../../../common/types/common";

export const PERMIT_CATEGORIES = {
  TERM: "TERM",
  TRIP: "TRIP",
  NRES: "NRES",
  MFUP: "MFUP",
} as const;

export type PermitCategory =
  (typeof PERMIT_CATEGORIES)[keyof typeof PERMIT_CATEGORIES];

/**
 * Returns the name/description of the permit category.
 * @param permitCategory String (if any) that represents the permit category
 * @returns Name/description of the permit category, or empty string if no mapping exists for permit category
 */
export const getPermitCategoryName = (permitCategory?: Nullable<string>) => {
  switch (permitCategory) {
    case PERMIT_CATEGORIES.TERM:
      return "Term";
    case PERMIT_CATEGORIES.TRIP:
      return "Single Trip";
    case PERMIT_CATEGORIES.NRES:
      return "Non-resident";
    case PERMIT_CATEGORIES.MFUP:
      return "Motive Fuel User Permit";
    default:
      return "";
  }
};

/**
 * Gets display text for permit category.
 * @param permitCategory Permit category (eg. TERM, TRIP, etc)
 * @returns display text for the permit category
 */
export const permitCategoryDisplayText = (
  permitCategory?: Nullable<string>,
) => {
  switch (permitCategory) {
    case PERMIT_CATEGORIES.TERM:
      return "Term";
    case PERMIT_CATEGORIES.TRIP:
      return "Single Trip";
    case PERMIT_CATEGORIES.NRES:
      return "Non-resident";
    case PERMIT_CATEGORIES.MFUP:
      return "Motive Fuel User Permit";
    default:
      return getPermitCategoryName(permitCategory);
  }
};

/**
 * Determines whether or not a string represents a valid permit category.
 * @param permitCategory string representing permit category value, if it exists (eg. tros, trow, etc)
 * @returns true if string is a valid permit category, or false otherwise
 */
export const isPermitCategoryValid = (permitCategory?: Nullable<string>) => {
  return (
    permitCategory &&
    (Object.values(PERMIT_CATEGORIES) as string[]).includes(
      permitCategory.toUpperCase(),
    )
  );
};
