import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";
import { httpPOSTRequestStream } from "../../../../common/apiManager/httpRequestHandler";
import { getFileNameFromHeaders } from "../../../permits/apiManager/permitsAPI";

/**
 * The request object type for payment and refund summary
 */
export type PaymentAndRefundSummaryRequest = {
  issuedBy: string[];
  fromDateTime: string;
  toDateTime: string;
};

/**
 * The request object type for payment and refund detail
 */
export interface PaymentAndRefundDetailRequest
  extends PaymentAndRefundSummaryRequest {
  permitType: string[];
  paymentMethodType: string[];
  users?: string[];
}

const streamDownloadWithHTTPPost = async (url: string, requestBody: any) => {
  const response = await httpPOSTRequestStream(url, requestBody);
  const filename = getFileNameFromHeaders(response.headers);
  if (!filename) {
    throw new Error("Unable to download pdf, file not available");
  }
  if (!response.body) {
    throw new Error("Unable to download pdf, no response found");
  }
  const reader = response.body.getReader();
  const stream = new ReadableStream({
    start: (controller) => {
      const processRead = async () => {
        const { done, value } = await reader.read();
        if (done) {
          // When no more data needs to be consumed, close the stream
          controller.close();
          return;
        }
        // Enqueue the next data chunk into our target stream
        controller.enqueue(value);
        await processRead();
      };
      processRead();
    },
  });
  const newRes = new Response(stream);
  const blobObj = await newRes.blob();
  return { blobObj, filename };
};

/**
 * Retrieves the payment and refund summary report.
 * @param requestObject The {@link PaymentAndRefundSummaryRequest} object
 * @returns A Promise containing the AxiosResponse
 */
export const getPaymentAndRefundSummary = async (
  requestObject: PaymentAndRefundSummaryRequest
) => {
  const url = `${VEHICLES_URL}/payment/report/summary`;
  return await streamDownloadWithHTTPPost(url, requestObject);
};

/**
 * Retrieves the payment and refund detail report.
 * @param requestObject The {@link PaymentAndRefundDetailRequest} object
 * @returns A Promise containing the AxiosResponse
 */
export const getPaymentAndRefundDetail = async (
  requestObject: PaymentAndRefundDetailRequest
) => {
  const url = `${VEHICLES_URL}/payment/report/detailed`;
  return await streamDownloadWithHTTPPost(url, requestObject);
};
