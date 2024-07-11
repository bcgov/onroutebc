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
    DETAIL: (companyId: number | string, loaId: string) =>
      `${SPECIAL_AUTH_API_BASE}/${companyId}/loas/${loaId}`,
    CREATE: (companyId: number | string) =>
      `${SPECIAL_AUTH_API_BASE}/${companyId}/loas`,
    UPDATE: (companyId: number | string, loaId: string) =>
      `${SPECIAL_AUTH_API_BASE}/${companyId}/loas/${loaId}`,
    REMOVE: (companyId: number | string, loaId: string) =>
      `${SPECIAL_AUTH_API_BASE}/${companyId}/loas/${loaId}`,
    DOWNLOAD: (companyId: number | string, loaId: string) =>
      `${SPECIAL_AUTH_API_BASE}/${companyId}/loas/${loaId}/documents?downloadMode=proxy`,
    REMOVE_DOCUMENT: (companyId: number | string, loaId: string) =>
      `${SPECIAL_AUTH_API_BASE}/${companyId}/loas/${loaId}/documents`,
  },
};
