import { useMutation, useQuery } from "@tanstack/react-query";
import { createCreditAccount, getCreditAccount } from '../apiManager/creditAccount'
import { getCompanyDataBySearch } from "../../idir/search/api/idirSearch";

/**
 * Hook to create a credit account.
 * @returns Result of the create credit account action
 */
export const useCreateCreditAccountMutation = () => {
    return useMutation({
      mutationFn: createCreditAccount,
    });
  };

/**
 * Hook to fetch the company credit account information.
 * @param companyId Company id of the company to get credit account information for
 * @returns Query result of the company credit account information
 */
export const useGetCreditAccountQuery = (companyId: number) => {
  return useQuery({
    queryKey: ["credit-account-information"],
    queryFn: () => getCreditAccount(companyId),
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch the user information.
 * @param clientNumber Id of the user to get information for
 * @returns Query result of the user information
 */
export const useGetCompanyQuery = (clientNumber: string) => {
  return useQuery({
    queryKey: ["company-information"],
    queryFn: () => getCompanyDataBySearch({ 
      searchEntity: "companies", searchByFilter: "onRouteBCClientNumber", searchString: clientNumber 
    }, {
      page: 0, take: 1
    }),
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
};