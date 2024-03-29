import { PayBCPaymentDetails, StartTransactionResponseData } from "../types/payment";
import { Nullable } from "../../../common/types/common";
import {
  PAYMENT_GATEWAY_METHODS,
  PAYMENT_METHOD_TYPE_CODE,
  PaymentGatewayMethod,
  PaymentMethodTypeCode,
} from "../../../common/types/paymentMethods";

import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../common/helpers/util";
import { httpGETRequest } from "../../../common/apiManager/httpRequestHandler";
import { PAYMENT_API_ROUTES } from "../apiManager/endpoints/endpoints";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

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
  const payBCPaymentDetails: PayBCPaymentDetails = {
    authCode: params.get("authCode"),
    avsAddrMatch: getDefaultRequiredVal("", params.get("avsAddrMatch")),
    avsId: getDefaultRequiredVal("", params.get("avsId")),
    avsMessage: getDefaultRequiredVal("", params.get("avsMessage")),
    avsPostalMatch: getDefaultRequiredVal("", params.get("avsPostalMatch")),
    avsProcessed: getDefaultRequiredVal("", params.get("avsProcessed")),
    avsResult: getDefaultRequiredVal("", params.get("avsResult")),
    cardType: getDefaultRequiredVal("", params.get("cardType")),
    cvdId: applyWhenNotNullable((cvdId) => Number(cvdId), params.get("cvdId")),
    trnApproved: applyWhenNotNullable(
      (approved) => Number(approved),
      params.get("trnApproved"),
    0),
    messageId: applyWhenNotNullable(
      (messageId) => Number(messageId),
      params.get("messageId"),
    ),
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

/**
 * Determines whether or not transaction is valid based on payment method and if it's approved.
 * @param paymentMethod Payment method used
 * @param transactionApproved Approval status of the transaction
 * @returns Whether or not the transaction is valid
 */
export const isValidTransaction = (
  paymentMethod: PaymentMethodTypeCode,
  transactionApproved?: Nullable<number>,
) => {
  return (
    paymentMethod !== PAYMENT_METHOD_TYPE_CODE.WEB ||
    (!!transactionApproved && transactionApproved > 0)
  );
};

/**
 * Fetch payment information by transaction id.
 * @param transactionId transaction id of the payment details to fetch
 * @returns PaymentTransaction data as response, or null if fetch failed
 */
export const getPaymentByTransactionId = async (
  transactionId?: string,
): Promise<Required<StartTransactionResponseData>> => {
  const url = `${PAYMENT_API_ROUTES.GET}/${transactionId}`;
  return httpGETRequest(url).then((response) => response.data);
};

/**
 * Hook to fetch the payment information by the given transactionId
 * @returns UseQueryResult containing the query results.
 */
export const usePaymentByTransactionIdQuery = (transactionId: string) => {
  return useQuery({
    queryKey: ["paymentByTransactionId"],
    queryFn: () => getPaymentByTransactionId(transactionId),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    enabled: true,
  });
};
