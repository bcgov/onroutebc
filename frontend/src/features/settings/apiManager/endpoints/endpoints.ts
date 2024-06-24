import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";
import { getCompanyIdFromSession } from "../../../../common/apiManager/httpRequestHandler";

const SUSPEND_API_BASE = `${VEHICLES_URL}/companies`;

export const SUSPEND_API_ROUTES = {
  HISTORY: (companyId: number) => `${SUSPEND_API_BASE}/${companyId}/suspend`,
  SUSPEND: (companyId: number) => `${SUSPEND_API_BASE}/${companyId}/suspend`,
};

const CREDIT_ACCOUNT_API_BASE = `${VEHICLES_URL}/companies`;

// placeholder routes subject to change
export const CREDIT_ACCOUNT_API_ROUTES = {
  CREATE_CREDIT_ACCOUNT: () => `${CREDIT_ACCOUNT_API_BASE}/${getCompanyIdFromSession()}/credit-account`,
  GET_CREDIT_ACCOUNT: () => `${CREDIT_ACCOUNT_API_BASE}/${getCompanyIdFromSession()}/credit-account/get-credit-account`,
  GET_COMPANY: (clientNumber: string) => `${CREDIT_ACCOUNT_API_BASE}/companies?page=1&take=1&clientNumber=${clientNumber}`,
  ADD_CREDIT_ACCOUNT_USER: (creditAccountId: number) => `${CREDIT_ACCOUNT_API_BASE}/${getCompanyIdFromSession()}/credit-account/${creditAccountId}/credit-account-user`,
  REMOVE_CREDIT_ACCOUNT_USER: (creditAccountId: number) => `${CREDIT_ACCOUNT_API_BASE}/${getCompanyIdFromSession()}/credit-account/${creditAccountId}/credit-account-user`,
  HOLD_CREDIT_ACCOUNT: () => `${CREDIT_ACCOUNT_API_BASE}/${getCompanyIdFromSession()}/credit-account/hold-credit-account`,
  CLOSE_CREDIT_ACCOUNT: () => `${CREDIT_ACCOUNT_API_BASE}/${getCompanyIdFromSession()}/credit-account/close-credit-account`,
  GET_HISTORY: () => `${CREDIT_ACCOUNT_API_BASE}/${getCompanyIdFromSession()}/credit-account/history`
};
