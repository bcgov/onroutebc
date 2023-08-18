import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";
import { httpGETRequest } from "../../../../common/apiManager/httpRequestHandler";
import { PaginatedResponse } from "../../../../common/types/common";
import { ReadPermitDto } from "../../../permits/types/permit";
import { SearchFields } from "../types/types";

/**
 * Searches the data with options and value entered by the user.
 * @param SearchFields The search parameters.
 * @returns The response from the API.
 */
export const getDataBySearch = ({
  searchEntity,
  searchByFilter,
  searchValue,
}: SearchFields): Promise<PaginatedResponse<ReadPermitDto>> => {
  const url = `${VEHICLES_URL}/${searchEntity}/ppc/search?searchColumn=${searchByFilter}&searchString=${searchValue}`;
  return httpGETRequest(url).then((response) => response.data);
};
