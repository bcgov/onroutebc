import { useQuery } from "@tanstack/react-query";
import { httpGETRequest } from "../apiManager/httpRequestHandler";
import { VEHICLES_URL } from "../apiManager/endpoints/endpoints";

/**
 * Fetch the FeatureFlags from the API
 * @returns JSON string data of the Feature Flags as response, or null if fetch failed
 */
export const getFeatureFlags = async () : 
  Promise<Record<string, string>> => {
    const url = `${VEHICLES_URL}/feature-flags`;
    return httpGETRequest(url).then((response) => response.data);
};

/**
 * A custom react query hook that fetches the feature flags.
 * @returns List of feature flags
 */
export const useFeatureFlagsQuery = () => {
    return useQuery({
        queryKey: ["featureFlags"],
        queryFn: () => getFeatureFlags(),
        staleTime: Infinity,
        refetchInterval: false,
        refetchOnWindowFocus: false, // prevent unnecessary multiple queries on page showing up in foreground
    });
};
  