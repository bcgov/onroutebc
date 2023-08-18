/**
 * The entity searched for.
 */
export enum SearchEntity {
  PERMIT = "permit",
  COMPANY = "company",
  APPLICATION = "application",
}

/**
 * The search by filter.
 */
export enum SearchByFilter {
  PERMIT_NUMBER = "permitNumber",
  PLATE_NUMBER = "plate",
  COMPANY_NAME = "companyName",
  ONROUTEBC_CLIENT_NUMBER = "onRouteBCClientNumber",
  APPLICATION_NUMBER = "applicationNumber",
}

/**
 * The Search values from the form.
 */
export type SearchFields = {
  searchEntity: SearchEntity;
  searchByFilter: SearchByFilter;
  searchValue: string;
};
