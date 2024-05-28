import { useMutation, useQuery } from "@tanstack/react-query";
import { addCreditAccountUser, createCreditAccount, getCreditAccount, removeCreditAccountUsers } from '../apiManager/creditAccount'
import { getCompanyDataBySearch } from "../../idir/search/api/idirSearch";
import { CompanyProfile } from "../../manageProfile/types/manageProfile";
import { useNavigate } from "react-router-dom";
import { ERROR_ROUTES } from "../../../routes/constants";

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
 * @returns Query result of the company credit account information
 */
export const useGetCreditAccountQuery = () => {
  return useQuery({
    queryKey: ["credit-account-information"],
    queryFn: () => getCreditAccount(),
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

/**
 * Hook to add a user to a credit account
 * @returns Result of the add user to credit account action
 */
export const useAddCreditAccountUserMutation = (userData: CompanyProfile) => {
  return useMutation({
    mutationFn: () => addCreditAccountUser(userData),
  });
};


/**
 * Hook to remove a user from a credit account
 * @returns Result of the remove user from credit account action
 */
export const useRemoveCreditAccountUsersMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: removeCreditAccountUsers,
    onError: () => navigate(ERROR_ROUTES.UNEXPECTED),
    onSuccess: () => console.log("Credit account user removed")
  });
};