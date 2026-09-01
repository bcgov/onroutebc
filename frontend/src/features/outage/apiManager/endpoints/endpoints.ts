import { PUBLIC_API_URL } from "../../../../common/apiManager/endpoints/endpoints";

const PUBLIC_API_BASE = `${PUBLIC_API_URL}`;

export const PUBLIC_API_ROUTES = {
  OUTAGE_NOTIFICATION: () =>
    `${PUBLIC_API_BASE}/outage-notification`,
  
}