import CryptoJS from "crypto-js";
import { Application } from "../types/application";
import { MotiPaymentDetails } from "../types/payment";

const motipayApiKey = import.meta.env.VITE_MOTIPAY_API_KEY;
const motipayBaseUrl = import.meta.env.VITE_MOTIPAY_BASE_URL;
const merchantId = import.meta.env.VITE_MOTIPAY_MERCHANT_ID;
// MOTI Pay requires an approved and declined redirect but we are using one redirect url then implementing UI logic 
// in the single redirect page to check the approved status parameter and rendering the UI accordingly 
const approvedRedirectUrl = import.meta.env.VITE_MOTIPAY_REDIRECT;
const declinedRedirectUrl = import.meta.env.VITE_MOTIPAY_REDIRECT;

/**
 * Generates a hash and other necessary values for a transaction.
 *
 * @param {string} transactionAmount - The amount of the transaction.
 * @returns {object} An object containing the transaction number, hash expiry, and hash.
 */
const createHash = (transactionAmount: string) => {
  // Get the current date and time
  const currDate = new Date();

  // Generate a unique transaction number based on the current timestamp
  const trnNum = "T" + currDate.getTime();
  const transactionNumber = trnNum;

  // Giving our hash expiry a value of current date plus 10 minutes which is sufficient
  const hashExpiryDt = new Date(currDate.getTime() + 10 * 60000);

  // Extract the year, month, day, hours, and minutes from the hash expiry date
  const year = hashExpiryDt.getFullYear();
  const monthPadded = ("00" + (hashExpiryDt.getMonth() + 1)).slice(-2);
  const dayPadded = ("00" + hashExpiryDt.getDate()).slice(-2);
  const hoursPadded = ("00" + hashExpiryDt.getHours()).slice(-2);
  const minutesPadded = ("00" + hashExpiryDt.getMinutes()).slice(-2);

  // Create the hash expiry string in the format "YYYYMMDDHHmm"
  const hashExpiry = `${year}${monthPadded}${dayPadded}${hoursPadded}${minutesPadded}`;
  const motipayHashExpiry = hashExpiry;

  // There should be a better way of doing this which is not as rigid - something like
  // dynamically removing the hashValue param from the actual query string instead of building
  // it up manually below, but this is sufficient for now.
  const queryString = `merchant_id=${merchantId}&trnType=P&trnOrderNumber=${transactionNumber}&trnAmount=${transactionAmount}&approvedPage=${approvedRedirectUrl}&declinedPage=${declinedRedirectUrl}${motipayApiKey}`;

  // Generate the hash using the query string and the MD5 algorithm
  const hash = CryptoJS.MD5(queryString).toString();
  const motiPayHash = hash;

  return {
    transactionNumber: transactionNumber,
    motipayHashExpiry: motipayHashExpiry,
    motipayHash: motiPayHash,
  };
};

/**
 * Generates a URL with transaction details for forwarding the user to the payment gateway.
 *
 * @param {Application} termOversizePermit - The term oversize permit application object.
 * @returns {string} The URL containing transaction details for the payment gateway.
 */
export const forwardTransactionDetails = (
  termOversizePermit: Application
): string => {
  // TODO: Add permit cost instead of permitDuration
  // Get the transaction amount from the term oversize permit object
  const transactionAmount = termOversizePermit.permitData.permitDuration;

  // Generate the hash and other necessary values for the transaction
  const hash = createHash(transactionAmount.toString());
  const motipayHash = hash.motipayHash;
  const motipayHashExpiry = hash.motipayHashExpiry;
  const transactionNumber = hash.transactionNumber;

  // Construct the URL with the transaction details for the payment gateway
  return `${motipayBaseUrl}?merchant_id=${merchantId}&trnType=P&trnOrderNumber=${transactionNumber}&trnAmount=${transactionAmount}&approvedPage=${approvedRedirectUrl}&declinedPage=${declinedRedirectUrl}&hashValue=${motipayHash}`;
};


/**
 * Extracts MotiPaymentDetails from the query parameters of a URL.
 *
 * @param {string} url - The URL containing the query parameters.
 * @returns {MotiPaymentDetails} The extracted MotiPaymentDetails object.
 */
export const getURLParameters = (url: string): MotiPaymentDetails => {
  // Split the URL to get the query string
  const queryString = url.split('?')[1];

  // Parse the query string into a URLSearchParams object
  const params = new URLSearchParams(queryString);

  // Extract the query parameters and assign them to the corresponding properties of MotiPaymentDetails
  const motiPaymentDetails: MotiPaymentDetails = {
    authCode: params.get("authCode") || "",
    avsAddrMatch: params.get("avsAddrMatch") || "",
    avsId: params.get("avsId") || "",
    avsMessage: params.get("avsMessage") || "",
    avsPostalMatch: params.get("avsPostalMatch") || "",
    avsProcessed: params.get("avsProcessed") || "",
    avsResult: params.get("avsResult") || "",
    cardType: params.get("cardType") || "",
    cvdId: params.get("cvdId") || "",
    trnApproved: params.get("trnApproved") || "",
    messageId: params.get("messageId") || "",
    messageText: params.get("messageText") || "",
    paymentMethod: params.get("paymentMethod") || "",
    ref1: params.get("ref1") || "",
    ref2: params.get("ref2") || "",
    ref3: params.get("ref3") || "",
    ref4: params.get("ref4") || "",
    ref5: params.get("ref5") || "",
    responseType: params.get("responseType") || "",
    trnAmount: params.get("trnAmount") || "",
    trnCustomerName: params.get("trnCustomerName") || "",
    trnDate: params.get("trnDate") || "",
    trnEmailAddress: params.get("trnEmailAddress") || "",
    trnId: params.get("trnId") || "",
    trnLanguage: params.get("trnLanguage") || "",
    trnOrderNumber: params.get("trnOrderNumber") || "",
    trnPhoneNumber: params.get("trnPhoneNumber") || "",
    trnType: params.get("trnType") || "",
  };

  return motiPaymentDetails;
};