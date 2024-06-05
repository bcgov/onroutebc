import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";

const SETTINGS_API_BASE = `${VEHICLES_URL}/companies`;
const SUSPEND_API_BASE = SETTINGS_API_BASE;
const SPECIAL_AUTH_API_BASE = SETTINGS_API_BASE;

export const SUSPEND_API_ROUTES = {
  HISTORY: (companyId: number) => `${SUSPEND_API_BASE}/${companyId}/suspend`,
  SUSPEND: (companyId: number) => `${SUSPEND_API_BASE}/${companyId}/suspend`,
};

export const SPECIAL_AUTH_API_ROUTES = {
  LOA: {
    ALL: (companyId: number | string, expired: boolean) =>
      `${SPECIAL_AUTH_API_BASE}/${companyId}/loas${expired ? "?expired=true" : ""}`,
    DETAIL: (companyId: number | string, loaNumber: string) =>
      `${SPECIAL_AUTH_API_BASE}/${companyId}/loas/${loaNumber}`,
    CREATE: (companyId: number | string) =>
      `${SPECIAL_AUTH_API_BASE}/${companyId}/loas`,
    UPDATE: (companyId: number | string, loaNumber: string) =>
      `${SPECIAL_AUTH_API_BASE}/${companyId}/loas/${loaNumber}`,
    REMOVE: (companyId: number | string, loaNumber: string) =>
      `${SPECIAL_AUTH_API_BASE}/${companyId}/loas/${loaNumber}`,
  },
};
