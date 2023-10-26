import { useQuery } from "@tanstack/react-query";
import { httpGETRequest } from "../../../../common/apiManager/httpRequestHandler";
import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";

/**
 * Gets the power unit types.
 * @returns Array<PowerUnitType>
 */
export const getIDIRUsers = async (): Promise<Array<string>> => {
  return httpGETRequest(`${VEHICLES_URL}/idir-users`).then(
    (response) => response.data
  );
};

/**
 * Fetches a list of vehicle subtypes for PowerUnit vehicles.
 * @returns List of vehicle subtypes for PowerUnit vehicles
 */
export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["idirUsers"],
    queryFn: getIDIRUsers,
    retry: false,
    refetchOnWindowFocus: false, // prevents unnecessary queries
  });
};
