import {
  CreditAccountData,
  CreditAccountLimitData,
  CreditAccountLimitType,
  CreditAccountMetadata,
  CreditAccountStatusType,
  CreditAccountUser,
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
export const createCreditAccount = async (data: {
  companyId: number;
  creditLimit: CreditAccountLimitType;
}) => {
  const { companyId, creditLimit } = data;
  return await httpPOSTRequest(
    CREDIT_ACCOUNT_API_ROUTES.CREATE_CREDIT_ACCOUNT(companyId),
    { creditLimit },
  );
};

/**
 * Get credit account information for related to the given company ID
 * @returns Credit account information for the company
 */
export const getCreditAccountMetadata = async (
  companyId: number,
): Promise<CreditAccountMetadata> => {
  const response = await httpGETRequest(
    CREDIT_ACCOUNT_API_ROUTES.GET_CREDIT_ACCOUNT_META_DATA(companyId),
  );
  return response.data;
};

/**
 * Get credit account information for related to the given company ID
 * @returns Credit account information for the company
 */
export const getCreditAccount = async (
  companyId: number,
  creditAccountId: number,
): Promise<CreditAccountData> => {
  const response = await httpGETRequest(
    CREDIT_ACCOUNT_API_ROUTES.GET_CREDIT_ACCOUNT(companyId, creditAccountId),
  );
  return response.data;
};

/**
 * Get credit account users for the given credit account ID
 * @param companyId Identifier of the company with which the credit Account is associated
 * @param creditAccountId Identifier of the credit account to retrieve
 * @returns List of credit account users for the credit account
 */
export const getCreditAccountUsers = async (data: {
  companyId: number;
  creditAccountId: number;
}) => {
  const { companyId, creditAccountId } = data;
  const response = await httpGETRequest(
    CREDIT_ACCOUNT_API_ROUTES.GET_CREDIT_ACCOUNT_USERS(
      companyId,
      creditAccountId,
    ),
  );
  return response.data as CreditAccountUser[];
};

/**
 * Get credit account users for the given credit account ID
 * @param companyId Identifier of the company with which the credit Account is associated
 * @param creditAccountId Identifier of the credit account to retrieve
 * @returns List of credit account users for the credit account
 */
export const getCreditAccountHistory = async ({
  companyId,
  creditAccountId,
}: {
  companyId: number;
  creditAccountId: number;
}) => {
  const response = await httpGETRequest(
    CREDIT_ACCOUNT_API_ROUTES.GET_CREDIT_ACCOUNT_HISTORY(
      companyId,
      creditAccountId,
    ),
  );
  return response.data;
};

/**
 * Get credit account users for the given credit account ID
 * @param companyId Identifier of the company with which the credit Account is associated
 * @param creditAccountId Identifier of the credit account to retrieve
 * @returns List of credit account users for the credit account
 */
export const getCreditAccountLimits = async ({
  companyId,
  creditAccountId,
}: {
  companyId: number;
  creditAccountId: number;
}) => {
  const response = await httpGETRequest(
    CREDIT_ACCOUNT_API_ROUTES.GET_CREDIT_ACCOUNT_LIMITS(
      companyId,
      creditAccountId,
    ),
  );
  return response.data as CreditAccountLimitData;
};

/**
 * Add a user to credit account
 * @param companyId Identifier of the company with which the credit Account is associated
 * @param creditAccountId Id of the credit account we wish to add a user to
 * @param userData Id of the company who is being added to the credit account
 * @returns companyProfile
 */
export const addCreditAccountUser = async (data: {
  companyId: number;
  creditAccountId: number;
  userData: CompanyProfile;
}) => {
  const { companyId, creditAccountId, userData } = data;
  const response = await httpPUTRequest(
    CREDIT_ACCOUNT_API_ROUTES.ADD_CREDIT_ACCOUNT_USER(
      companyId,
      creditAccountId,
    ),
    {
      companyId: userData.companyId,
    },
  );
  return response;
};

/**
 * Removes active users of a credit account identified by their client numbers.
 * @param companyId Identifier of the company with which the credit Account is associated
 * @param userClientNumbers The array of user client numbers of the users to be removed.
 * @returns A promise indicating the success or failure of the remove operation.
 */
export const removeCreditAccountUsers = async (data: {
  companyId: number;
  creditAccountId: number;
  companyIds: number[];
}) => {
  const { companyId, creditAccountId, companyIds } = data;
  const response = await httpDELETERequest(
    CREDIT_ACCOUNT_API_ROUTES.REMOVE_CREDIT_ACCOUNT_USER(
      companyId,
      creditAccountId,
    ),
    {
      companyIds,
    },
  );
  return response;
};

/**
 * Backend request to hold/unhold/close/reopen a credit account.
 * @param companyId Identifier of the company with which the credit Account is associated
 * @param creditAccountId Id of the credit account we wish to add a user to
 * @param status The intended status for the credit account to be updated to
 * @param reason The reason why the status has been updated
 * @returns Result of the update action, or error on fail
 */

export const updateCreditAccountStatus = async (data: {
  companyId: number;
  creditAccountId: number;
  status: CreditAccountStatusType;
  reason?: string;
}) => {
  const { companyId, creditAccountId, status, reason } = data;

  const response = await httpPUTRequest(
    CREDIT_ACCOUNT_API_ROUTES.UPDATE_ACCOUNT_STATUS(companyId, creditAccountId),
    {
      creditAccountStatusType: status,
      comment: reason,
    },
  );
  return response;
};

/**
 * Backend request to verify credit account.
 * @param companyId Identifier of the company with which the credit Account is associated
 * @param creditAccountId Id of the credit account we wish to add a user to
 * @param reason The reason why the status has been updated
 * @returns Result of the verification action, or error on fail
 */

export const verifyCreditAccount = async (data: {
  companyId: number;
  creditAccountId: number;
  reason?: string;
}) => {
  const { companyId, creditAccountId, reason } = data;

  const response = await httpPUTRequest(
    CREDIT_ACCOUNT_API_ROUTES.VERIFY_ACCOUNT_STATUS(companyId, creditAccountId),
    {
      comment: reason,
    },
  );
  return response;
};
