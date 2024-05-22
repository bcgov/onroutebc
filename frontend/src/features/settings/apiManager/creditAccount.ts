// eslint-disable-next-line
import { CreditAccountData, CreditAccountLimitType, UserData } from "../types/creditAccount"
import { CREDIT_ACCOUNT_API_ROUTES } from "../apiManager/endpoints/endpoints"
// import { getCompanyDataBySearch } from "../../idir/search/api/idirSearch";
// import { httpGETRequest } from "../../../common/apiManager/httpRequestHandler";
// import {CompanyProfile} from "../../manageProfile/types/manageProfile"

/**
 * Backend request to create a credit account.
 * @param creditAccountData Information about the credit account action for the company
 * @returns Result of the credit account action, or error on fail
 */
export const createCreditAccount = async (
  // eslint-disable-next-line 
    creditAccountData: {
        companyId: number;
        selectedCreditLimit: CreditAccountLimitType 
    },
) => {
    return await mockCreateCreditAccountSuccess(CREDIT_ACCOUNT_API_ROUTES.CREATE_CREDIT_ACCOUNT(creditAccountData.companyId)) 
}

/**
 * Get the active credit account for a given company.
 * @param companyId Company id of the company to get credit account information for
 * @returns Credit account information for the given company
 */
export const getCreditAccount = async (
  companyId: number,
) => {
  const response = await mockGetCreditAccountSuccess(CREDIT_ACCOUNT_API_ROUTES.GET_CREDIT_ACCOUNT(companyId));
  return response.data;
};

/**
 * Get the client by client id.
 * @param clientId Client id of the client to get account information for
 * @returns Client account information
 */
// export const getCompany = async (
//   clientId: string,
// ): Promise<CompanyProfile> => {
//   const response = await httpGETRequest(CREDIT_ACCOUNT_API_ROUTES.GET_COMPANY(clientId));
//   return response.data
// };


// create a method the posts (using httpPOST...), then create a query hook that calls this method, and use that hook inside the page component
// eslint-disable-next-line 
const mockCreateCreditAccountSuccess = async (url: string): Promise<CreateCreditAccountResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 201,
        data: {
          accountNumber: "WS7456",
          userDesignation: "account holder",
          creditLimit: 100000,
          creditBalance: 0,
          creditAvailable: 100000,
        },
      });
    }, 1000);
  });
}

// create a method the gets (using httpGET...), then create a query hook that calls this method, and use that hook inside the page component
// eslint-disable-next-line 
const mockGetCreditAccountSuccess = async (url: string): Promise<GetCreditAccountResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
        data: {
          accountNumber: "WS7456",
          userDesignation: "account holder",
          creditLimit: 100000,
          creditBalance: 25000,
          creditAvailable: 75000,
        },
      });
    }, 1000);
  });
}

// eslint-disable-next-line 
const mockGetCreditAccountFail = async (url: string): Promise<GetCreditAccountResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 404
      });
    }, 1000);
  });
}

// eslint-disable-next-line 
// const mockGetCompanySuccess = (url: string): Promise<GetCompanyResponse> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         status: 200,
//         data: {
//           clientNumber: "B1-874592-765",
//           companyName: "Bandstra Transportation Systems Ltd.",
//           userDesignation: "Account Holder",
//           doingBusinessAs: "Julie's Trucking Company"
//         }
//       });
//     }, 1000);
//   });
// }
  

 interface CreateCreditAccountResponse {
  status: number;
  data: CreditAccountData
}

interface GetCreditAccountResponse {
  status: number;
  data?: CreditAccountData
}

// interface GetCompanyResponse {
//   status: number,
//   data?: UserData
// }
