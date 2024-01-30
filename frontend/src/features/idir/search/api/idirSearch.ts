import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";
import { httpGETRequest } from "../../../../common/apiManager/httpRequestHandler";
import {
  PaginatedResponse,
  PaginationOptions,
} from "../../../../common/types/common";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile";
import { Permit } from "../../../permits/types/permit";
import { SEARCH_ENTITIES, SearchEntity, SearchFields } from "../types/types";

const getSearchURLbyEntity = (searchEntity: SearchEntity): string | URL => {
  let url = "";
  switch (searchEntity) {
    case SEARCH_ENTITIES.APPLICATION:
    case SEARCH_ENTITIES.PERMIT:
      url = `${VEHICLES_URL}/${searchEntity}`;
      break;
    case SEARCH_ENTITIES.COMPANY:
      url = `${VEHICLES_URL}/${searchEntity}/paginated`;
      break;
  }
  return url;
};

/**
 * Searches the data with options and value entered by the user.
 * @param SearchFields The search parameters.
 * @returns The response from the API.
 */
export const getPermitDataBySearch = (
  { searchEntity, searchByFilter, searchString }: SearchFields,
  { page = 0, take = 10 }: PaginationOptions,
): Promise<PaginatedResponse<Permit>> => {
  const searchURL = new URL(getSearchURLbyEntity(searchEntity));
  searchURL.searchParams.set("searchColumn", searchByFilter);
  searchURL.searchParams.set("searchString", searchString);

  // API pagination index starts at 1. Hence page + 1.
  searchURL.searchParams.set("page", (page + 1).toString());
  searchURL.searchParams.set("take", take.toString());
  return httpGETRequest(searchURL.toString()).then((response) => response.data);
};

/**
 * Searches the data with options and value entered by the user.
 * @param SearchFields The search parameters.
 * @returns The response from the API.
 */
export const getCompanyDataBySearch = (
  { searchEntity, searchByFilter, searchString }: SearchFields,
  { page = 0, take = 10 }: PaginationOptions,
): Promise<PaginatedResponse<CompanyProfile>> => {
  const searchURL = new URL(getSearchURLbyEntity(searchEntity));
  if (searchByFilter === 'companyName')
    searchURL.searchParams.set("legalName", searchString);
  else
    searchURL.searchParams.set("clientNumber", searchString);

  // API pagination index starts at 1. Hence page + 1.
  searchURL.searchParams.set("page", (page + 1).toString());
  searchURL.searchParams.set("take", take.toString());
  return httpGETRequest(searchURL.toString()).then((response) => response.data);
};
