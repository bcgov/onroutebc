import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCreditAccountUser,
  createCreditAccount,
  getCreditAccount,
  removeCreditAccountUsers,
  holdCreditAccount,
  closeCreditAccount,
  getCreditAccountHistory,
  getCreditAccountUsers,
} from "../apiManager/creditAccount";
import { getCompanyDataBySearch } from "../../idir/search/api/idirSearch";
import { useNavigate } from "react-router-dom";
import { ERROR_ROUTES } from "../../../routes/constants";
import { SnackBarContext } from "../../../App";
import { useContext } from "react";
import { CreditAccountUser } from "../types/creditAccount";

/**
 * Hook to fetch the company credit account details.
 * @returns Query result of the company credit account details
 */
export const useGetCreditAccountQuery = () => {
  return useQuery({
    queryKey: ["credit-account"],
    queryFn: () => getCreditAccount(),
  });
};

/**
 * Hook to fetch the company credit account details.
 * @returns Query result of the company credit account details
 */
export const useGetCreditAccountUsersQuery = (creditAccountId: number) => {
  return useQuery({
    queryKey: ["credit-account", { creditAccountId }, "users"],
    queryFn: () => getCreditAccountUsers(creditAccountId),
  });
};

export const useGetCreditAccountWithUsersQuery = () => {
  const creditAccount = useGetCreditAccountQuery();
  const creditAccountUsers = useGetCreditAccountUsersQuery(
    // @ts-expect-error temporary solution to getting credit account users whilst the getCreditAccount endpoint is being built
    creditAccount?.data?.creditAccountId,
  );
  return { creditAccount, creditAccountUsers };
};

/**
 * Hook to fetch the company hold/close history list.
 * @returns Query result of the company hold/close history list
 */
export const useCreditAccountHistoryQuery = () => {
  return useQuery({
    queryKey: ["credit-account", "history"],
    queryFn: () => getCreditAccountHistory(),
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
    queryFn: () =>
      getCompanyDataBySearch(
        {
          searchEntity: "companies",
          searchByFilter: "onRouteBCClientNumber",
          searchString: clientNumber,
        },
        {
          page: 0,
          take: 1,
        },
      ),
    enabled: clientNumber !== "",
  });
};

/**
 * Hook to create a credit account.
 * @returns Result of the create credit account action
 */
export const useCreateCreditAccountMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setSnackBar } = useContext(SnackBarContext);

  return useMutation({
    mutationFn: createCreditAccount,
    onSuccess: (response) => {
      queryClient.setQueryData(["credit-account"], response.data);
      setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: "Credit Account Added",
        alertType: "success",
      });
    },
    onError: () => navigate(ERROR_ROUTES.UNEXPECTED),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["credit-account"] });
    },
  });
};

/**
 * Hook to add a user to a credit account
 * @returns Result of the add user to credit account action
 */
export const useAddCreditAccountUserMutation = () => {
  const navigate = useNavigate();
  const { setSnackBar } = useContext(SnackBarContext);

  return useMutation({
    mutationFn: addCreditAccountUser,
    onSuccess: () => {
      setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        alertType: "success",
        message: "Account User Added",
      });
    },
    onError: () => {
      navigate(ERROR_ROUTES.UNEXPECTED);
    },
  });
};

/**
 * Hook to remove a user from a credit account
 * @returns Result of the remove user from credit account action
 */
export const useRemoveCreditAccountUsersMutation = (data: {
  creditAccountId: number;
  companyIds: number[];
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setSnackBar } = useContext(SnackBarContext);
  const { creditAccountId, companyIds } = data;

  return useMutation({
    mutationFn: () => removeCreditAccountUsers(data),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["credit-account", { creditAccountId }, "users"],
      });

      const snapshot = queryClient.getQueryData([
        "credit-account",
        { creditAccountId },
        "users",
      ]);

      queryClient.setQueryData(
        ["credit-account", { creditAccountId }, "users"],
        (prevCreditAccountUsers: CreditAccountUser[]) =>
          prevCreditAccountUsers
            ? prevCreditAccountUsers.filter(
                (user) => !companyIds.includes(user.companyId),
              )
            : [],
      );
      // queryClient.setQueryData(
      //   ["credit-account"],
      //   (prevCreditAccount: CreditAccountData) =>
      //     prevCreditAccount
      //       ? {
      //           ...prevCreditAccount,
      //           creditAccountUsers: [
      //             prevCreditAccount.creditAccountUsers.filter(
      //               (user) => !companyIds.includes(user.companyId),
      //             ),
      //           ],
      //         }
      //       : undefined,
      // );

      return () => {
        queryClient.setQueryData(
          ["credit-account", { creditAccountId }, "users"],
          snapshot,
        );
      };
    },
    onSuccess: () => {
      setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: "Account User(s) Removed",
        alertType: "info",
      });
    },
    onError: (_error, _variables, rollback) => {
      rollback?.();
      navigate(ERROR_ROUTES.UNEXPECTED);
    },
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: ["credit-account", { creditAccountId }, "users"],
      });
    },
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
    onError: () => navigate(ERROR_ROUTES.UNEXPECTED),
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
    onError: () => navigate(ERROR_ROUTES.UNEXPECTED),
  });
};
