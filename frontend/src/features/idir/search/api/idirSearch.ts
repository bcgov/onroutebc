import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";
import { httpGETRequest } from "../../../../common/apiManager/httpRequestHandler";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile";
import { PermitListItem } from "../../../permits/types/permit";
import { SEARCH_BY_FILTERS, SearchFields } from "../types/types";
import {
  PaginatedResponse,
  PaginationOptions,
} from "../../../../common/types/common";
import {
  normalizeClientNumber,
  normalizePermitNumber,
  normalizePlateNumber,
} from "../helpers/SearchNormaliser";

/**
 * Searches the data with options and value entered by the user.
 * @param SearchFields The search parameters.
 * @returns The response from the API.
 */
export const getPermitDataBySearch = (
  { searchEntity, searchByFilter, searchString }: SearchFields,
  { page = 0, take = 10 }: PaginationOptions,
  expired?: boolean,
): Promise<PaginatedResponse<PermitListItem>> => {
  const searchURL = new URL(`${VEHICLES_URL}/${searchEntity}`);
  searchURL.searchParams.set("searchColumn", searchByFilter);
  if (searchByFilter === SEARCH_BY_FILTERS.PLATE_NUMBER) {
    searchURL.searchParams.set("searchString", normalizePlateNumber(searchString));
  } else if (searchByFilter === SEARCH_BY_FILTERS.PERMIT_NUMBER) {
    searchURL.searchParams.set("searchString", normalizePermitNumber(searchString));
  } else {
    searchURL.searchParams.set("searchString", searchString);
  }
  if (expired !== undefined) {
    searchURL.searchParams.set("expired", expired.toString());
  }

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
  const searchURL = new URL(`${VEHICLES_URL}/${searchEntity}`);
  if (searchByFilter === SEARCH_BY_FILTERS.COMPANY_NAME) {
    searchURL.searchParams.set("companyName", searchString);
  } else {
    searchURL.searchParams.set("clientNumber", normalizeClientNumber(searchString));
  }
  // API pagination index starts at 1. Hence page + 1.
  searchURL.searchParams.set("page", (page + 1).toString());
  searchURL.searchParams.set("take", take.toString());
  return httpGETRequest(searchURL.toString()).then((response) => response.data);
};
