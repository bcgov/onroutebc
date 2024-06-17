// eslint-disable-next-line
import { CreditAccountData, CreditAccountLimitType, HoldData, HOLD_ACTIVITY_TYPES, CloseData, CLOSE_ACTIVITY_TYPES, CreditAccountHistoryData } from "../types/creditAccount"
import { CREDIT_ACCOUNT_API_ROUTES } from "../apiManager/endpoints/endpoints"
import { CreditAccountUser } from "../types/creditAccount"

const companyProfileA: CreditAccountUser = {
  "companyId": 18,
  "companyGUID": "1FC2222DD96441EF907858A17665A57B",
  "clientNumber": "E2-000061-640",
  "migratedClientHash": null,
  "legalName": "Herzog-Blick Trucking",
  "alternateName": "Werner's Convoy",
  "phone": "763-356-8852",
  "extension": null,
  "fax": null,
  "email": "cmaciunas1o@amazon.co.jp",
  "primaryContact": {
    "firstName": "Adelaida",
    "lastName": "Winterton",
    "phone1": "851-454-2329",
    "phone2": undefined,
    "fax": "798-158-5884",
    "email": "awinterton1o@pagesperso-orange.fr",
    "city": "Lysekil",
    "provinceCode": "BC",
    "countryCode": "CA",
    "phone1Extension": undefined,
    "phone2Extension": undefined
  },
  "mailingAddress": {
    "addressLine1": "593 6th Trail",
    "addressLine2": null,
    "city": "Muke",
    "postalCode": "I1A 1U3",
    "provinceCode": "BC",
    "countryCode": "CA"
  },
  "isSuspended": false,
  "userType": "USER"
}

const companyProfileB: CreditAccountUser = {
  "companyId": 19,
  "companyGUID": "22723C3E423142A5B66834B1F9694FC2",
  "clientNumber": "B1-000083-390",
  "migratedClientHash": null,
  "legalName": "Jacobson, Bechtelar and Walker Trucking",
  "alternateName": null,
  "phone": "278-286-5357",
  "extension": null,
  "fax": null,
  "email": "clumly2a@nba.com",
  "primaryContact": {
    "firstName": "Jarrid",
    "lastName": "Cristofanini",
    "phone1": "837-837-2993",
    "phone2": "728-452-3114",
    "fax": "658-799-9980",
    "email": "jcristofanini2a@telegraph.co.uk",
    "city": "Müllendorf",
    "provinceCode": "BC",
    "countryCode": "CA",
    "phone1Extension": undefined,
    "phone2Extension": undefined
  },
  "mailingAddress": {
    "addressLine1": "1024 Anniversary Court",
    "addressLine2": null,
    "city": "Monguno",
    "postalCode": "R3Y 9A4",
    "provinceCode": "BC",
    "countryCode": "CA"
  },
  "isSuspended": false,
  "userType": "USER"
}

const companyProfileC: CreditAccountUser = {
  "companyId": 20,
  "companyGUID": "258DEBB0B3114FE68AD4A19BFDE4529D",
  "clientNumber": "R1-000079-847",
  "migratedClientHash": null,
  "legalName": "Roberts, Kautzer and Pouros Trucking",
  "alternateName": null,
  "phone": "666-329-8805",
  "extension": null,
  "fax": null,
  "email": "ltrobe26@sakura.ne.jp",
  "primaryContact": {
    "firstName": "Lucita",
    "lastName": "Cuttell",
    "phone1": "321-798-8332",
    "phone2": undefined,
    "fax": "240-352-0095",
    "email": "lcuttell26@tamu.edu",
    "city": "Zhemtala",
    "provinceCode": "BC",
    "countryCode": "CA",
    "phone1Extension": undefined,
    "phone2Extension": undefined
  },
  "mailingAddress": {
    "addressLine1": "475 Scoville Place",
    "addressLine2": null,
    "city": "Saint-Pierre-Montlimart",
    "postalCode": "Z3C 0I2",
    "provinceCode": "BC",
    "countryCode": "CA"
  },
  "isSuspended": false,
  "userType": "USER"
}

/**
 * Backend request to create a credit account.
 * @param creditAccountData Information about the credit account action for the company
 * @returns Result of the credit account action, or error on fail
 */
export const createCreditAccount = async (
  // eslint-disable-next-line 
        selectedCreditLimit: CreditAccountLimitType 
) => {
    return await mockCreateCreditAccountSuccess(CREDIT_ACCOUNT_API_ROUTES.CREATE_CREDIT_ACCOUNT()) 
}


// create a method the posts (using httpPOST...), then create a query hook that calls this method, and use that hook inside the page component
// eslint-disable-next-line 
const mockCreateCreditAccountSuccess = async (url: string): Promise<CreditAccountResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 201,
        data: {
          creditAccountId: 1,
          creditAccountType: "SECURED",
          creditAccountNumber: "WS7456",
          creditAccountStatusType: "ACTIVE",
          companyId: 1,
          creditLimit: 100000,
          creditBalance: 0,
          availableCredit: 100000,
          creditAccountUsers: []
        },
      });
    }, 1000);
  });
}

/**
 * Get the active credit account for a given company.
 * @param companyId Company id of the company to get credit account information for
 * @returns Credit account information for the given company
 */
export const getCreditAccount = async () => {
  const response = await mockGetCreditAccountFail(CREDIT_ACCOUNT_API_ROUTES.GET_CREDIT_ACCOUNT());
  return response.data;
};


// create a method the gets (using httpGET...), then create a query hook that calls this method, and use that hook inside the page component
// eslint-disable-next-line 
const mockGetCreditAccountSuccess = async (url: string): Promise<CreditAccountResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
        data: {
          creditAccountId: 1,
          creditAccountType: "SECURED",
          creditAccountNumber: "WS7456",
          creditAccountStatusType: "CLOSED",
          companyId: 1,
          creditLimit: 100000,
          creditBalance: 25000,
          availableCredit: 75000,
          creditAccountUsers: [companyProfileA, companyProfileB, companyProfileC]
        }
      });
    }, 1000);
  });
}

// eslint-disable-next-line 
const mockGetCreditAccountFail = async (url: string): Promise<CreditAccountResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 404
      });
    }, 1000);
  });
}

/**
 * Add a user to credit account
 * @param companyId Id of the company whose credit account we wish to add a user to 
 * @param userData Data of the company who is being added to the credit account
 * @returns Updated credit account information
 */
export const addCreditAccountUser = async (
  userData: CreditAccountUser
) => {
  const response = await mockAddCreditAccountUserSuccess(CREDIT_ACCOUNT_API_ROUTES.ADD_CREDIT_ACCOUNT_USER(), userData);
  return response;
};

// create a method the gets (using httpGET...), then create a query hook that calls this method, and use that hook inside the page component
// eslint-disable-next-line 
const mockAddCreditAccountUserSuccess = async (url: string, newUser: CreditAccountUser): Promise<CreditAccountResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
        data: {
          creditAccountId: 1,
          creditAccountType: "SECURED",
          creditAccountNumber: "WS7456",
          creditAccountStatusType: "ACTIVE",
          companyId: 1,
          creditLimit: 100000,
          creditBalance: 25000,
          availableCredit: 75000,
          creditAccountUsers: [newUser]
        }
      });
    }, 1000);
  });
}

/**
 * Removes active users of a credit account identified by their client numbers.
 * @param userClientNumbers The array of user client numbers of the users to be removed.
 * @returns A promise indicating the success or failure of the remove operation.
 */
export const removeCreditAccountUsers = (userClientNumbers: string[]) => {
  return mockRemoveCreditAccountUsersSuccess(
    CREDIT_ACCOUNT_API_ROUTES.REMOVE_CREDIT_ACCOUNT_USERS(),
    userClientNumbers
  );
};

// eslint-disable-next-line 
const mockRemoveCreditAccountUsersSuccess = async (url: string, userClientNumbers: string[]): Promise<CreditAccountResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
      });
    }, 1000);
  });
}

/**
 * Backend request to hold/unhold a credit account.
 * @param holdData Information about the hold action for the credit account
 * @returns Result of the hold action, or error on fail
 */
export const holdCreditAccount = async (
  holdData: HoldData
) => {
  return await mockHoldCreditAccountSuccess(
    CREDIT_ACCOUNT_API_ROUTES.HOLD_CREDIT_ACCOUNT(),
    holdData,
  );
};

// eslint-disable-next-line
const mockHoldCreditAccountSuccess = async (url: string, holdData: HoldData): Promise<CreditAccountResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200
      })
    }, 1000)
  })
}

/**
 * Backend request to close/reopen a credit account.
 * @param closeData Information about the close action for the credit account
 * @returns Result of the close action, or error on fail
 */
export const closeCreditAccount = async (
  closeData: CloseData
) => {
  return await mockCloseCreditAccountSuccess(
    CREDIT_ACCOUNT_API_ROUTES.CLOSE_CREDIT_ACCOUNT(),
    closeData,
  );
};

// eslint-disable-next-line
const mockCloseCreditAccountSuccess = async (url: string, closeData: CloseData): Promise<CreditAccountResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200
      })
    }, 1000)
  })
}

/**
 * Get the hold/close history list for a given company.
 * @param companyId Company id of the company to get hold/close history for
 * @returns List of hold/close history for the given company
 */
export const getCreditAccountHistory = async () => {
  const response = await mockGetCreditAccountHistorySuccess(CREDIT_ACCOUNT_API_ROUTES.GET_HISTORY());
  return response.data;
};


// create a method the gets (using httpGET...), then create a query hook that calls this method, and use that hook inside the page component
// eslint-disable-next-line 
const mockGetCreditAccountHistorySuccess = async (url: string): Promise<CreditAccountHistoryResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
        data: [{
          activityId: "A1",
          activityType:  CLOSE_ACTIVITY_TYPES.CLOSE_CREDIT_ACCOUNT,
          activityDateTime: "Jan. 16, 2024, 10:14 am PDT",
          IDIR: "RFARREL",
          reason: "I'm baby yes plz chambray seitan master cleanse, actually banh mi same plaid art party cloud bread blog. Wayfarers praxis bodega boys ramps brunch. Cardigan kinfolk viral brunch flannel keytar. Franzen stumptown lomo mixtape vape, fingerstache organic.",
        },
        {
          activityId: "A2",
          activityType:  CLOSE_ACTIVITY_TYPES.REOPEN_CREDIT_ACCOUNT,
          activityDateTime: "Jan. 18, 2023, 9:07 am PDT",
          IDIR: "RFARREL",
          reason: "",
        }],
      });
    }, 1000);
  });
}

// create a method the gets (using httpGET...), then create a query hook that calls this method, and use that hook inside the page component
// eslint-disable-next-line 
const mockGetCreditAccountHistoryFail = async (url: string): Promise<CreditAccountHistoryResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 404,
      });
    }, 1000);
  });
}

interface CreditAccountResponse {
  status: number;
  data?: CreditAccountData
}

interface CreditAccountHistoryResponse {
  status: number;
  data?: CreditAccountHistoryData[]
}