import { CreditAccountData } from '../types/creditAccount'

/**
 * Backend request to create a credit account.
 * @param creditAccountData Information about the credit account action for the company
 * @returns Result of the credit account action, or error on fail
 */
export const createCreditAccount = async (
    creditAccountData: {
        companyId: number;
        data: CreditAccountData;
    },
) => {
    console.log('sending', creditAccountData)
    return await mockHttpPOSTRequest() 
}


// create a method the fetches (using httpGET...), then create a query hook that calls this method, and use that hook inside the page component
const mockHttpPOSTRequest = async (): Promise<CreateCreditAccountResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 201,
          data: {
            accountActivityType: 'CREATE',
            creditLimit: "100000",
            creditBalance: 0,
            creditAvailable: 100000,
          },
        });
      }, 1000);
    });
  }
  

 interface CreateCreditAccountResponse {
    status: number;
    data: {
      accountActivityType: string;
      creditLimit: string;
      creditBalance: number;
      creditAvailable: number;
    };
  }
