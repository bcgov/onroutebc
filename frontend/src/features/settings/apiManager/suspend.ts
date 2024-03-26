import { SuspendData, SuspendHistoryData } from "../types/suspend";
import { SUSPEND_API_ROUTES } from "./endpoints/endpoints";
import { httpGETRequest, httpPOSTRequest } from "../../../common/apiManager/httpRequestHandler";

/**
 * Backend request to suspend/unsuspend a company.
 * @param suspendData Information about the suspend action for the company
 * @returns Result of the suspend action, or error on fail
 */
export const suspendCompany = async (
  suspendData: {
    companyId: number;
    data: SuspendData;
  },
) => {
  const { companyId, data } = suspendData;
  return await httpPOSTRequest(
    SUSPEND_API_ROUTES.SUSPEND(companyId),
    data,
  );
};

/**
 * Get the suspension history list for a given company.
 * @param companyId Company id of the company to get suspension history for
 * @returns List of suspension history for the given company
 */
export const getSuspensionHistory = async (
  companyId: number,
): Promise<SuspendHistoryData[]> => {
  const response = await httpGETRequest(SUSPEND_API_ROUTES.HISTORY(companyId));
  return response.data;
};
