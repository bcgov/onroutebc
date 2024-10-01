import { APPLICATIONS_API_BASE } from "../../../permits/apiManager/endpoints/endpoints";

export const APPLICATION_QUEUE_API_ROUTES = {
  UPDATE_QUEUE_STATUS: (companyId: string, applicationId: string) =>
    `${APPLICATIONS_API_BASE(companyId)}/${applicationId}/queue/status`,
  CLAIM: (companyId: string, applicationId: string) =>
    `${APPLICATIONS_API_BASE(companyId)}/${applicationId}/queue/assign`,
};
