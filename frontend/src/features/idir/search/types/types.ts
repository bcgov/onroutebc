/**
 * The entity searched for.
 */
export const SEARCH_ENTITIES = {
  PERMIT: "permits",
  COMPANY: "companies",
  APPLICATION: "applications",
} as const;

export type SearchEntity =
  (typeof SEARCH_ENTITIES)[keyof typeof SEARCH_ENTITIES];

/**
 * The search by filter.
 */
export const SEARCH_BY_FILTERS = {
  PERMIT_NUMBER: "permitNumber",
  PLATE_NUMBER: "plate",
  COMPANY_NAME: "companyName",
  ONROUTEBC_CLIENT_NUMBER: "onRouteBCClientNumber",
  APPLICATION_NUMBER: "applicationNumber",
  VIN: "vin",
} as const;

export type SearchByFilter =
  (typeof SEARCH_BY_FILTERS)[keyof typeof SEARCH_BY_FILTERS];

/**
 * The Search values from the form.
 */
export type SearchFields = {
  searchEntity: SearchEntity;
  searchByFilter: SearchByFilter;
  /**
   * The value entered by the user for searching.
   */
  searchString: string;
};
