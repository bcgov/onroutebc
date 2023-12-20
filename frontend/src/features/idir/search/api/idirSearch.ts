import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";
import { httpGETRequest } from "../../../../common/apiManager/httpRequestHandler";
import {
  PaginatedResponse,
  PaginationOptions,
} from "../../../../common/types/common";
import { Permit } from "../../../permits/types/permit";
import { SearchFields } from "../types/types";

/**
 * Searches the data with options and value entered by the user.
 * @param SearchFields The search parameters.
 * @returns The response from the API.
 */
export const getDataBySearch = (
  { searchEntity, searchByFilter, searchValue }: SearchFields,
  { page = 0, take = 10 }: PaginationOptions,
): Promise<PaginatedResponse<Permit>> => {
  const searchURL = new URL(`${VEHICLES_URL}/${searchEntity}/ppc/search`);
  searchURL.searchParams.set("searchColumn", searchByFilter);
  searchURL.searchParams.set("searchString", searchValue);
  searchURL.searchParams.set("page", (page + 1).toString());
  searchURL.searchParams.set("take", take.toString());
  return httpGETRequest(searchURL.toString()).then((response) => response.data);
};
