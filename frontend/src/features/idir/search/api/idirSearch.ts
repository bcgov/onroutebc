import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";
import { httpGETRequest } from "../../../../common/apiManager/httpRequestHandler";
import { PaginatedResponse } from "../../../../common/types/common";
import { Permit } from "../../../permits/types/permit";
import { SearchFields } from "../types/types";

/**
 * Searches the data with options and value entered by the user.
 * @param SearchFields The search parameters.
 * @returns The response from the API.
 */
export const getDataBySearch = (
  { searchEntity, searchByFilter, searchValue }: SearchFields,
  page: number = 0,
): Promise<PaginatedResponse<Permit>> => {
  const searchURL = new URL(`${VEHICLES_URL}/${searchEntity}/ppc/search`);
  searchURL.searchParams.set("searchColumn", searchByFilter);
  searchURL.searchParams.set("searchString", searchValue);
  if (page > 0) {
    searchURL.searchParams.set("page", page.toString());
  }
  return httpGETRequest(searchURL.toString()).then((response) => response.data);
};
