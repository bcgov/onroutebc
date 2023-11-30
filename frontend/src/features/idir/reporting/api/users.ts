import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";
import { httpGETRequest } from "../../../../common/apiManager/httpRequestHandler";
import { ONE_HOUR } from "../../../../common/constants/constants";
import { ReadUserDtoForReport } from "../types/types";

/**
 * Retrieves the list of permit issuers.
 * @returns An array containing the list of users
 */
export const getPermitIssuers = async (): Promise<
  Array<ReadUserDtoForReport>
> => {
  const url = new URL(`${VEHICLES_URL}/users`);
  url.searchParams.set("permitIssuerPPCUser", `${true}`);
  return httpGETRequest(url.toString()).then((response) => response.data);
};

/**
 * Hook to fetch the permit issuers.
 * @returns A query result object containing the permit issuers.
 */
export const usePermitIssuersQuery = (): UseQueryResult<
  ReadUserDtoForReport[],
  unknown
> => {
  return useQuery({
    queryKey: ["permitIssuers"],
    queryFn: getPermitIssuers,
    keepPreviousData: true,
    staleTime: ONE_HOUR,
    retry: false,
    refetchOnWindowFocus: false, // prevents unnecessary queries
  });
};
