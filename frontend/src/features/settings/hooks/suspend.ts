import { useMutation, useQuery } from "@tanstack/react-query";

import { getSuspensionHistory, suspendCompany } from "../apiManager/suspend";

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
  return useMutation({
    mutationFn: suspendCompany,
  });
};
