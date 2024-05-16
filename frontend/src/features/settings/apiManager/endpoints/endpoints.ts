import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";

const SUSPEND_API_BASE = `${VEHICLES_URL}/companies`;

export const SUSPEND_API_ROUTES = {
  HISTORY: (companyId: number) => `${SUSPEND_API_BASE}/${companyId}/suspend`,
  SUSPEND: (companyId: number) => `${SUSPEND_API_BASE}/${companyId}/suspend`,
};

const CREDIT_ACCOUNT_API_BASE = `${VEHICLES_URL}/companies`;

// placeholder route subject to change
export const CREDIT_ACCOUNT_API_ROUTES = {
  CREATE: (companyId: number) => `${CREDIT_ACCOUNT_API_BASE}/${companyId}/credit-account/create`,
};
