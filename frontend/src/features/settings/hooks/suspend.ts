import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getSuspensionHistory, suspendCompany } from "../apiManager/suspend";
import { SuspendData } from "../types/suspend";

/**
 * Hook to fetch the company suspension history list.
 * @param companyId Company id of the company to get suspension history for
 * @returns Query result of the company suspension history list
 */
export const useSuspensionHistoryQuery = (companyId: number) => {
  return useQuery({
    queryKey: ["suspensionHistory"],
    queryFn: () => getSuspensionHistory(companyId),
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to suspend/unsuspend a company.
 * @returns Result of the suspension action
 */
export const useSuspendCompanyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (suspendData: {
      companyId: number;
      data: SuspendData;
    }) => {
      const response = await suspendCompany(suspendData);
      if (response.status === 200 || response.status === 201) {
        queryClient.invalidateQueries({
          queryKey: ["suspensionHistory"],
        });
      }

      return {
        status: response.status,
      };
    },
  });
};
