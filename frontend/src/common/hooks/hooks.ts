import { useQuery } from "@tanstack/react-query";
import { httpGETRequest } from "../apiManager/httpRequestHandler";
import { VEHICLES_URL } from "../apiManager/endpoints/endpoints";

/**
 * Fetch payment information by transaction id.
 * @returns PaymentTransaction data as response, or null if fetch failed
 */
export const getFeatureFlags = async () : 
  Promise<Record<string, string>> => {
    const url = `${VEHICLES_URL}/feature-flags`;
    return httpGETRequest(url).then((response) => response.data);
};

/**
 * A custom react query hook that fetches applications in progress.
 * @returns List of applications in progress
 */
export const useFeatureFlagsQuery = () => {
    return useQuery({
        queryKey: ["featureFlags"],
        queryFn: () => getFeatureFlags(),
        refetchOnWindowFocus: false, // prevent unnecessary multiple queries on page showing up in foreground
    });
};
  