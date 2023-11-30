import { useQuery } from "@tanstack/react-query";
import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";
import { httpGETRequest } from "../../../../common/apiManager/httpRequestHandler";
import { ONE_HOUR } from "../../../../common/constants/constants";

/**
 *
 */
export type ReadUserDto = {
  userGUID: string;
  userName: string;
};

/**
 *
 * @returns
 */
export const getPermitIssuers = async (): Promise<Array<ReadUserDto>> => {
  const url = new URL(`${VEHICLES_URL}/users`);
  url.searchParams.set("permitIssuerPPCUser", `${true}`);
  return httpGETRequest(url.toString()).then((response) => response.data);
};

/**
 * Fetches a list of vehicle subtypes for PowerUnit vehicles.
 * @returns List of vehicle subtypes for PowerUnit vehicles
 */
export const usePermitIssuersQuery = () => {
  return useQuery({
    queryKey: ["permitIssuers"],
    queryFn: getPermitIssuers,
    keepPreviousData: true,
    staleTime: ONE_HOUR,
    retry: false,
    refetchOnWindowFocus: false, // prevents unnecessary queries
  });
};
