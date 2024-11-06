import { httpPOSTRequest } from "../../../../../common/apiManager/httpRequestHandler";
import { PAYMENT_API_ROUTES } from "../../../apiManager/endpoints/endpoints";
import { RefundPermitData } from "../types/RefundPermitData";

export const refundPermit = async (data: RefundPermitData) => {
  try {
    const response = await httpPOSTRequest(PAYMENT_API_ROUTES.REFUND, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
