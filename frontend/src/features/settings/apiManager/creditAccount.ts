/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CreditAccountData,
  CreditAccountLimitType,
  CreditAccountHistoryData,
  UpdateStatusData,
  CreditAccountStatusType,
} from "../types/creditAccount";
import { CREDIT_ACCOUNT_API_ROUTES } from "../apiManager/endpoints/endpoints";
import { CreditAccountUser } from "../types/creditAccount";
import {
  httpDELETERequest,
  httpGETRequest,
  httpPOSTRequest,
  httpPUTRequest,
} from "../../../common/apiManager/httpRequestHandler";

const creditAccountHolder: CreditAccountUser = {
  companyId: 74,
  clientNumber: "B3-000005-722",
  legalName: "Parisian LLC Trucking",
  alternateName: null,
  email: "gspoure4@mtv.com",
  isSuspended: false,
  userType: "HOLDER",
};
const creditAccountUserA: CreditAccountUser = {
  companyId: 3,
  clientNumber: "B1-000096-763",
  legalName: "Abshire, Rempel and O'Keefe Trucking",
  alternateName: null,
  email: "dmccarter2n@webeden.co.uk",
  isSuspended: false,
  userType: "USER",
};
const creditAccountUserB: CreditAccountUser = {
  companyId: 19,
  clientNumber: "B1-000083-390",
  legalName: "Jacobson, Bechtelar and Walker Trucking",
  alternateName: null,
  email: "clumly2a@nba.com",
  isSuspended: false,
  userType: "USER",
};
const creditAccountUserC: CreditAccountUser = {
  companyId: 20,
  clientNumber: "R1-000079-847",
  legalName: "Roberts, Kautzer and Pouros Trucking",
  alternateName: null,
  email: "ltrobe26@sakura.ne.jp",
  isSuspended: false,
  userType: "USER",
};
const creditAccount: CreditAccountData = {
  creditAccountId: 19,
  creditAccountType: "UNSECURED",
  creditAccountNumber: "WS5005",
  creditAccountStatusType: "ACTIVE",
  companyId: 74,
  availableCredit: "1000",
  creditLimit: "1000",
  creditBalance: 0,
  creditAccountUsers: [
    creditAccountHolder,
    creditAccountUserA,
    creditAccountUserB,
  ],
};

const prepaidCreditAccount: CreditAccountData = {
  creditAccountId: 16,
  creditAccountType: "PREPAID",
  creditAccountNumber: "WS5064",
  creditAccountStatusType: "ACTIVE",
  companyId: 74,
  availableCredit: "PREPAID",
  creditLimit: "PREPAID",
  creditBalance: 0,
  creditAccountUsers: [creditAccountHolder],
};

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

// create a method the posts (using httpPOST...), then create a query hook that calls this method, and use that hook inside the page component
const mockCreateCreditAccountSuccess = async (
  url: string,
): Promise<CreditAccountResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        status: 201,
        data: creditAccount,
      });
    }, 1000);
  });
};

/**
 * Get credit account information for the active company.
 * @returns Credit account information for the active company
 */
export const getCreditAccount = async () => {
  const response = await httpGETRequest(
    CREDIT_ACCOUNT_API_ROUTES.GET_CREDIT_ACCOUNT(),
  );
  return response.data;
};

// create a method the gets (using httpGET...), then create a query hook that calls this method, and use that hook inside the page component
const mockGetCreditAccountSuccess = async (
  url: string,
): Promise<CreditAccountResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        status: 200,
        data: creditAccount,
      });
    }, 1000);
  });
};

const mockGetCreditAccountFail = async (
  url: string,
): Promise<CreditAccountResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: false,
        status: 404,
      });
    }, 1000);
  });
};

export const getCreditAccountUsers = async (creditAccountId: number) => {
  const response = await httpGETRequest(
    CREDIT_ACCOUNT_API_ROUTES.GET_CREDIT_ACCOUNT_USERS(creditAccountId),
  );
  return response.data;
};

/**
 * Add a user to credit account
 * @param {number} creditAccountId Id of the credit account we wish to add a user to
 * @param {CreditAccountUser} userData Id of the company who is being added to the credit account
 * @returns {CreditAccountUser}
 */
export const addCreditAccountUser = async (data: {
  creditAccountId: number;
  userData: CreditAccountUser;
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

// create a method the gets (using httpGET...), then create a query hook that calls this method, and use that hook inside the page component
const mockAddCreditAccountUserSuccess = async (
  url: string,
  newUser: CreditAccountUser,
): Promise<CreditAccountResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        status: 200,
        data: {
          creditAccountId: 1,
          creditAccountType: "SECURED",
          creditAccountNumber: "WS7456",
          creditAccountStatusType: "ACTIVE",
          companyId: 1,
          creditLimit: "100000",
          creditBalance: 25000,
          availableCredit: "75000",
          creditAccountUsers: [newUser],
        },
      });
    }, 1000);
  });
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

const mockRemoveCreditAccountUsersSuccess = async (
  url: string,
  userClientNumbers: string[],
): Promise<CreditAccountResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        status: 200,
      });
    }, 1000);
  });
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

/**
 * Get the hold/close history list for a given company.
 * @param companyId Company id of the company to get hold/close history for
 * @returns List of hold/close history for the given company
 */
export const getCreditAccountHistory = async () => {
  const response = await mockGetCreditAccountHistorySuccess(
    CREDIT_ACCOUNT_API_ROUTES.GET_HISTORY(),
  );
  return response.data;
};

// create a method the gets (using httpGET...), then create a query hook that calls this method, and use that hook inside the page component
const mockGetCreditAccountHistorySuccess = async (
  url: string,
): Promise<CreditAccountHistoryResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        status: 200,
        data: [
          {
            activityId: "A1",
            activityType: "ONHOLD",
            activityDateTime: "Jan. 16, 2024, 10:14 am PDT",
            IDIR: "RFARREL",
            reason:
              "I'm baby yes plz chambray seitan master cleanse, actually banh mi same plaid art party cloud bread blog. Wayfarers praxis bodega boys ramps brunch. Cardigan kinfolk viral brunch flannel keytar. Franzen stumptown lomo mixtape vape, fingerstache organic.",
          },
          {
            activityId: "A2",
            activityType: "ACTIVE",
            activityDateTime: "Jan. 18, 2023, 9:07 am PDT",
            IDIR: "RFARREL",
            reason: "",
          },
        ],
      });
    }, 1000);
  });
};

// create a method the gets (using httpGET...), then create a query hook that calls this method, and use that hook inside the page component
const mockGetCreditAccountHistoryFail = async (
  url: string,
): Promise<CreditAccountHistoryResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: false,
        status: 404,
      });
    }, 1000);
  });
};

interface CreditAccountResponse {
  ok: boolean;
  status: number;
  data?: CreditAccountData;
}

interface CreditAccountHistoryResponse {
  ok: boolean;
  status: number;
  data?: CreditAccountHistoryData[];
}
