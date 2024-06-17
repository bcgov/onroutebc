import { useMutation, useQuery } from "@tanstack/react-query";
import { addCreditAccountUser, createCreditAccount, getCreditAccount, removeCreditAccountUsers, holdCreditAccount, closeCreditAccount, getCreditAccountHistory } from '../apiManager/creditAccount'
import { getCompanyDataBySearch } from "../../idir/search/api/idirSearch";
import { useNavigate } from "react-router-dom";
import { ERROR_ROUTES } from "../../../routes/constants";
import { CreditAccountUser } from "../types/creditAccount";

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
    queryKey: ["company-information", { clientNumber }],
    queryFn: () => getCompanyDataBySearch({ 
      searchEntity: "companies", searchByFilter: "onRouteBCClientNumber", searchString: clientNumber 
    }, {
      page: 0, take: 1
    }),
    enabled: clientNumber !== ""
  });
};

/**
 * Hook to add a user to a credit account
 * @returns Result of the add user to credit account action
 */
export const useAddCreditAccountUserMutation = (userData: CreditAccountUser) => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => addCreditAccountUser(userData),
    onError: () => navigate(ERROR_ROUTES.UNEXPECTED)
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
    onError: () => navigate(ERROR_ROUTES.UNEXPECTED)
  });
};

/**
 * Hook to hold/unhold a credit account.
 * @returns Result of the hold credit account action
 */
export const useHoldCreditAccountMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: holdCreditAccount,
    onError: () => navigate(ERROR_ROUTES.UNEXPECTED)
  });
};

/**
 * Hook to close/reopen a credit account.
 * @returns Result of the close credit account action
 */
export const useCloseCreditAccountMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: closeCreditAccount,
    onError: () => navigate(ERROR_ROUTES.UNEXPECTED)
  });
};

/**
 * Hook to fetch the company hold/close history list.
 * @returns Query result of the company hold/close history list
 */
export const useCreditAccountHistoryQuery = () => {
  return useQuery({
    queryKey: ["creditAccountHistory"],
    queryFn: () => getCreditAccountHistory(),
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
};