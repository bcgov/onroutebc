import { PayBCPaymentDetails } from "../types/payment";
import { parseRedirectUriPath } from "../pages/Payment/PaymentRedirect";
import { 
  PAYMENT_GATEWAY_METHODS, 
  PaymentGatewayMethod, 
} from "../../../common/types/paymentMethods";

import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../common/helpers/util";

/**
 * Extracts PayBCPaymentDetails from the query parameters of a URL.
 *
 * @param {URLSearchParams} params - The object containing URL query parameters.
 * @returns {PayBCPaymentDetails} The extracted PayBCPaymentDetails object.
 */
export const getPayBCPaymentDetails = (
  params: URLSearchParams,
): PayBCPaymentDetails => {
  // Extract the query parameters and assign them to the corresponding properties of PayBCPaymentDetails
  const path = getDefaultRequiredVal("", params.get("path"));
  const { trnApproved } = parseRedirectUriPath(path);

  const payBCPaymentDetails: PayBCPaymentDetails = {
    authCode: getDefaultRequiredVal("", params.get("authCode")),
    avsAddrMatch: getDefaultRequiredVal("", params.get("avsAddrMatch")),
    avsId: getDefaultRequiredVal("", params.get("avsId")),
    avsMessage: getDefaultRequiredVal("", params.get("avsMessage")),
    avsPostalMatch: getDefaultRequiredVal("", params.get("avsPostalMatch")),
    avsProcessed: getDefaultRequiredVal("", params.get("avsProcessed")),
    avsResult: getDefaultRequiredVal("", params.get("avsResult")),
    cardType: getDefaultRequiredVal("", params.get("cardType")),
    cvdId: 1, // applyWhenNotNullable((cvdId) => Number(cvdId), params.get("cvdId"), 0),
    trnApproved: trnApproved,
    messageId: "1", // getDefaultRequiredVal("", params.get("messageId")),
    messageText: getDefaultRequiredVal("", params.get("messageText")),
    paymentMethod: getDefaultRequiredVal(
      PAYMENT_GATEWAY_METHODS.CC,
      params.get("paymentMethod"),
    ) as PaymentGatewayMethod,
    ref1: getDefaultRequiredVal("", params.get("ref1")),
    ref2: getDefaultRequiredVal("", params.get("ref2")),
    ref3: getDefaultRequiredVal("", params.get("ref3")),
    ref4: getDefaultRequiredVal("", params.get("ref4")),
    ref5: getDefaultRequiredVal("", params.get("ref5")),
    responseType: getDefaultRequiredVal("", params.get("responseType")),
    trnAmount: applyWhenNotNullable(
      (trnAmount) => Number(trnAmount),
      params.get("trnAmount"),
      0,
    ),
    trnCustomerName: getDefaultRequiredVal("", params.get("trnCustomerName")),
    trnDate: getDefaultRequiredVal("", params.get("trnDate")),
    trnEmailAddress: getDefaultRequiredVal("", params.get("trnEmailAddress")),
    trnId: getDefaultRequiredVal("", params.get("trnOrderId")),
    trnLanguage: getDefaultRequiredVal("", params.get("trnLanguage")),
    trnOrderNumber: getDefaultRequiredVal("", params.get("trnOrderNumber")),
    trnPhoneNumber: getDefaultRequiredVal("", params.get("trnPhoneNumber")),
    trnType: getDefaultRequiredVal("", params.get("trnType")),
  };

  return payBCPaymentDetails;
};
