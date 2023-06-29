import { MotiPaymentDetails } from "../types/payment";

/**
 * Extracts MotiPaymentDetails from the query parameters of a URL.
 *
 * @param {string} url - The URL containing the query parameters.
 * @returns {MotiPaymentDetails} The extracted MotiPaymentDetails object.
 */
export const getURLParameters = (url: string): MotiPaymentDetails => {
  // Split the URL to get the query string
  const queryString = url.split("?")[1];

  // Parse the query string into a URLSearchParams object
  const params = new URLSearchParams(queryString);

  // Extract the query parameters and assign them to the corresponding properties of MotiPaymentDetails
  const motiPaymentDetails: MotiPaymentDetails = {
    authCode: params.get("authCode") ?? "",
    avsAddrMatch: params.get("avsAddrMatch") ?? "",
    avsId: params.get("avsId") ?? "",
    avsMessage: params.get("avsMessage") ?? "",
    avsPostalMatch: params.get("avsPostalMatch") ?? "",
    avsProcessed: params.get("avsProcessed") ?? "",
    avsResult: params.get("avsResult") ?? "",
    cardType: params.get("cardType") ?? "",
    cvdId: params.get("cvdId") ?? "",
    trnApproved: params.get("trnApproved") ?? "",
    messageId: params.get("messageId") ?? "",
    messageText: params.get("messageText") ?? "",
    paymentMethod: params.get("paymentMethod") ?? "",
    ref1: params.get("ref1") ?? "",
    ref2: params.get("ref2") ?? "",
    ref3: params.get("ref3") ?? "",
    ref4: params.get("ref4") ?? "",
    ref5: params.get("ref5") ?? "",
    responseType: params.get("responseType") ?? "",
    trnAmount: params.get("trnAmount") ?? "",
    trnCustomerName: params.get("trnCustomerName") ?? "",
    trnDate: params.get("trnDate") ?? "",
    trnEmailAddress: params.get("trnEmailAddress") ?? "",
    trnId: params.get("trnId") ?? "",
    trnLanguage: params.get("trnLanguage") ?? "",
    trnOrderNumber: params.get("trnOrderNumber") ?? "",
    trnPhoneNumber: params.get("trnPhoneNumber") ?? "",
    trnType: params.get("trnType") ?? "",
  };

  return motiPaymentDetails;
};
