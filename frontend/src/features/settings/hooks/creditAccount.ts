import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCreditAccountUser,
  createCreditAccount,
  getCreditAccount,
  removeCreditAccountUsers,
  getCreditAccountUsers,
  updateCreditAccountStatus,
  getCompanyCreditAccount,
} from "../apiManager/creditAccount";
import { getCompanyDataBySearch } from "../../idir/search/api/idirSearch";
import { useNavigate } from "react-router-dom";
import { ERROR_ROUTES } from "../../../routes/constants";
import { SnackBarContext } from "../../../App";
import { useContext } from "react";
import {
  CreditAccountStatusType,
  UPDATE_STATUS_ACTIONS,
  UpdateStatusData,
} from "../types/creditAccount";
import { getCompanyIdFromSession } from "../../../common/apiManager/httpRequestHandler";
import { SnackbarAlertType } from "../../../common/components/snackbar/CustomSnackBar";
import { CompanyProfile } from "../../manageProfile/types/manageProfile";

/**
 * Hook to fetch the company credit account details for the active user.
 * @returns Query result of the company credit account details
 */
export const useGetCreditAccountQuery = () => {
  return useQuery({
    queryKey: ["credit-account", { companyId: getCompanyIdFromSession() }],
    queryFn: getCreditAccount,
  });
};

/**
 * Hook to fetch the associated credit account details for the given company.
 * @returns Query result of the company associated credit account details
 */
export const useGetCompanyCreditAccountQuery = (companyId: number) => {
  return useQuery({
    queryKey: ["credit-account", { companyId }],
    queryFn: () => getCompanyCreditAccount(companyId),
  });
};

/**
 * Hook to fetch the company credit account details.
 * @returns Query result of the company credit account details
 */
export const useGetCreditAccountUsersQuery = (creditAccountId: number) => {
  return useQuery({
    queryKey: [
      "credit-account",
      { companyId: getCompanyIdFromSession() },
      "users",
    ],
    queryFn: () => getCreditAccountUsers(creditAccountId),
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
    staleTime: 0,
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
      queryClient.setQueryData(
        ["credit-account", { companyId: getCompanyIdFromSession() }],
        response.data,
      );
      setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: "Credit Account Added",
        alertType: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["credit-account", { companyId: getCompanyIdFromSession() }],
      });
    },
    onError: () => navigate(ERROR_ROUTES.UNEXPECTED),
  });
};

/**
 * Hook to add a user to a credit account
 * @returns Result of the add user to credit account action
 */
export const useAddCreditAccountUserMutation = () => {
  const { setSnackBar } = useContext(SnackBarContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { creditAccountId: number; userData: CompanyProfile }) =>
      addCreditAccountUser(data),
    onSuccess: () => {
      setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        alertType: "success",
        message: "Account User Added",
      });

      queryClient.invalidateQueries({
        queryKey: ["credit-account", { companyId: getCompanyIdFromSession() }],
      });
    },
    onError: () => navigate(ERROR_ROUTES.UNEXPECTED),
  });
};

/**
 * Hook to remove a user from a credit account
 * @returns Result of the remove user from credit account action
 */
export const useRemoveCreditAccountUsersMutation = () => {
  const navigate = useNavigate();
  const { setSnackBar } = useContext(SnackBarContext);

  return useMutation({
    mutationFn: (data: { creditAccountId: number; companyIds: number[] }) =>
      removeCreditAccountUsers(data),
    onSuccess: () => {
      setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: "Account User(s) Removed",
        alertType: "info",
      });
    },
    onError: () => {
      navigate(ERROR_ROUTES.UNEXPECTED);
    },
  });
};

/**
 * Hook to hold/unhold a credit account.
 * @returns Result of the hold credit account action
 */
export const useUpdateCreditAccountStatusMutation = () => {
  const navigate = useNavigate();
  const { setSnackBar } = useContext(SnackBarContext);

  return useMutation({
    mutationFn: (data: {
      creditAccountId: number;
      updateStatusData: UpdateStatusData;
    }) => {
      const {
        creditAccountId,
        updateStatusData: { updateStatusAction, reason },
      } = data;

      let status: CreditAccountStatusType;

      switch (updateStatusAction) {
        case UPDATE_STATUS_ACTIONS.HOLD_CREDIT_ACCOUNT:
          status = "ONHOLD";
          break;
        case UPDATE_STATUS_ACTIONS.CLOSE_CREDIT_ACCOUNT:
          status = "CLOSED";
          break;
        case UPDATE_STATUS_ACTIONS.UNHOLD_CREDIT_ACCOUNT:
          status = "ACTIVE";
          break;
        case UPDATE_STATUS_ACTIONS.REOPEN_CREDIT_ACCOUNT:
          status = "ACTIVE";
          break;
        default:
          status = "ACTIVE";
          break;
      }
      return updateCreditAccountStatus({ creditAccountId, status, reason });
    },
    onSuccess: (
      _data,
      variables: {
        creditAccountId: number;
        updateStatusData: UpdateStatusData;
      },
    ) => {
      const updateStatusAction = variables.updateStatusData.updateStatusAction;

      let alertType: SnackbarAlertType;
      let message: string;

      switch (updateStatusAction) {
        case UPDATE_STATUS_ACTIONS.HOLD_CREDIT_ACCOUNT:
          alertType = "info";
          message = "Credit Account On Hold";
          break;
        case UPDATE_STATUS_ACTIONS.CLOSE_CREDIT_ACCOUNT:
          alertType = "info";
          message = "Credit Account Closed";
          break;
        case UPDATE_STATUS_ACTIONS.UNHOLD_CREDIT_ACCOUNT:
          alertType = "success";
          message = "Hold Removed";
          break;
        case UPDATE_STATUS_ACTIONS.REOPEN_CREDIT_ACCOUNT:
          alertType = "success";
          message = "Credit Account Reopened";
          break;
        default:
          alertType = "success";
          message = "Credit Account Active";
      }

      setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        alertType: alertType,
        message: message,
      });
    },
    onError: () => {
      navigate(ERROR_ROUTES.UNEXPECTED);
    },
  });
};
