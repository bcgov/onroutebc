import {
  CreditAccountData,
  CreditAccountLimitType,
  CreditAccountStatusType,
} from "../types/creditAccount";
import { CREDIT_ACCOUNT_API_ROUTES } from "../apiManager/endpoints/endpoints";
import {
  httpDELETERequest,
  httpGETRequest,
  httpPOSTRequest,
  httpPUTRequest,
} from "../../../common/apiManager/httpRequestHandler";
import { CompanyProfile } from "../../manageProfile/types/manageProfile";

/**
 * Backend request to create a credit account.
 * @param creditAccountData Information about the credit account action for the company
 * @returns Result of the credit account action, or error on fail
 */
export const createCreditAccount = async (
  creditLimit: CreditAccountLimitType,
) => {
  return await httpPOSTRequest(
    CREDIT_ACCOUNT_API_ROUTES.CREATE_CREDIT_ACCOUNT(),
    { creditLimit },
  );
};

/**
 * Get credit account information for the active company
 * @returns Credit account information for the active company
 */
export const getCreditAccount = async (): Promise<CreditAccountData> => {
  const response = await httpGETRequest(
    CREDIT_ACCOUNT_API_ROUTES.GET_CREDIT_ACCOUNT(),
  );
  return response.data;
};

/**
 * Get associated credit account information for any given company
 * @param companyId Identifier of the company whose associated credit account data you wish to retrieve
 * @returns Credit account information for the given company
 */
export const getCompanyCreditAccount = async (companyId: number) => {
  const response = await httpGETRequest(
    CREDIT_ACCOUNT_API_ROUTES.GET_COMPANY_CREDIT_ACCOUNT(companyId),
  );
  return response.data;
};

/**
 * Get credit account users for the given credit account ID
 * @param creditAccountId Identifier of the credit account to retrieve
 * @returns List of credit account users for the credit account
 */
export const getCreditAccountUsers = async (creditAccountId: number) => {
  const response = await httpGETRequest(
    CREDIT_ACCOUNT_API_ROUTES.GET_CREDIT_ACCOUNT_USERS(creditAccountId),
  );
  return response.data;
};

/**
 * Add a user to credit account
 * @param creditAccountId Id of the credit account we wish to add a user to
 * @param userData Id of the company who is being added to the credit account
 * @returns companyProfile
 */
export const addCreditAccountUser = async (data: {
  creditAccountId: number;
  userData: CompanyProfile;
}) => {
  const { creditAccountId, userData } = data;
  const response = await httpPUTRequest(
    CREDIT_ACCOUNT_API_ROUTES.ADD_CREDIT_ACCOUNT_USER(creditAccountId),
    {
      companyId: userData.companyId,
    },
  );
  return response;
};

/**
 * Removes active users of a credit account identified by their client numbers.
 * @param userClientNumbers The array of user client numbers of the users to be removed.
 * @returns A promise indicating the success or failure of the remove operation.
 */
export const removeCreditAccountUsers = async (data: {
  creditAccountId: number;
  companyIds: number[];
}) => {
  const { creditAccountId, companyIds } = data;
  const response = await httpDELETERequest(
    CREDIT_ACCOUNT_API_ROUTES.REMOVE_CREDIT_ACCOUNT_USER(creditAccountId),
    {
      companyIds,
    },
  );
  return response;
};

/**
 * Backend request to hold/unhold/close/reopen a credit account.
 * @param updateStatusData Information about the update action for the credit account
 * @returns Result of the update action, or error on fail
 */
export const updateCreditAccountStatus = async (data: {
  creditAccountId: number;
  status: CreditAccountStatusType;
  reason?: string;
}) => {
  const { creditAccountId, status, reason } = data;

  const response = await httpPUTRequest(
    CREDIT_ACCOUNT_API_ROUTES.UPDATE_ACCOUNT_STATUS(creditAccountId),
    {
      creditAccountStatusType: status,
      comment: reason,
    },
  );
  return response;
};
