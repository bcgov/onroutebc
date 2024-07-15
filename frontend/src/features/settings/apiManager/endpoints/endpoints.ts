import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";

const SUSPEND_API_BASE = `${VEHICLES_URL}/companies`;

export const SUSPEND_API_ROUTES = {
  HISTORY: (companyId: number) => `${SUSPEND_API_BASE}/${companyId}/suspend`,
  SUSPEND: (companyId: number) => `${SUSPEND_API_BASE}/${companyId}/suspend`,
};

const CREDIT_ACCOUNT_API_BASE = `${VEHICLES_URL}/companies`;

export const CREDIT_ACCOUNT_API_ROUTES = {
  CREATE_CREDIT_ACCOUNT: (companyId: number) =>
    `${CREDIT_ACCOUNT_API_BASE}/${companyId}/credit-account`,
  GET_CREDIT_ACCOUNT: (companyId: number) =>
    `${CREDIT_ACCOUNT_API_BASE}/${companyId}/credit-account`,
  GET_COMPANY: (clientNumber: string) =>
    `${CREDIT_ACCOUNT_API_BASE}/companies?page=1&take=1&clientNumber=${clientNumber}`,
  GET_CREDIT_ACCOUNT_USERS: (companyId: number, creditAccountId: number) =>
    `${CREDIT_ACCOUNT_API_BASE}/${companyId}/credit-account/${creditAccountId}/credit-account-user?includeAccountHolder=true`,
  ADD_CREDIT_ACCOUNT_USER: (companyId: number, creditAccountId: number) =>
    `${CREDIT_ACCOUNT_API_BASE}/${companyId}/credit-account/${creditAccountId}/credit-account-user`,
  REMOVE_CREDIT_ACCOUNT_USER: (companyId: number, creditAccountId: number) =>
    `${CREDIT_ACCOUNT_API_BASE}/${companyId}/credit-account/${creditAccountId}/credit-account-user`,
  UPDATE_ACCOUNT_STATUS: (companyId: number, creditAccountId: number) =>
    `${CREDIT_ACCOUNT_API_BASE}/${companyId}/credit-account/${creditAccountId}/status`,
};
