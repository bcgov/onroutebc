import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";
import { ONE_HOUR } from "../../../../common/constants/constants";
import { getFileNameFromHeaders } from "../../../permits/apiManager/permitsAPI";
import {
  httpGETRequest,
  httpPOSTRequestStream,
} from "../../../../common/apiManager/httpRequestHandler";

import {
  PaymentAndRefundDetailRequest,
  PaymentAndRefundSummaryRequest,
} from "../types/types";

/**
 * Streams a file through a POST request.
 *
 * @param url The API endpoint.
 * @param requestBody The request payload
 * @returns An object containing the filename and blob.
 * @throws Error when the file cannot be downloaded.
 */
const streamDownloadWithHTTPPost = async (
  url: string,
  requestBody: any,
): Promise<{
  blobObj: Blob;
  filename: string;
}> => {
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
  requestObject: PaymentAndRefundSummaryRequest,
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
  requestObject: PaymentAndRefundDetailRequest,
) => {
  const url = `${VEHICLES_URL}/payment/report/detailed`;
  return await streamDownloadWithHTTPPost(url, requestObject);
};

/**
 * Retrieves the permit types to be used in the reports page.
 * @returns A Promise containing the permit types in key - value pairs
 * where the key is the permitTypeCode and the value is the display.
 */
export const getPermitTypes = async (): Promise<Record<string, string>> => {
  const url = `${VEHICLES_URL}/permits/types/list`;
  return httpGETRequest(url.toString()).then((response) => response.data);
};

/**
 * Hook to fetch the permit types.
 * @returns A query result object containing the permit types
 */
export const usePermitTypesQuery = (): UseQueryResult<
  Record<string, string>,
  unknown
> => {
  return useQuery({
    queryKey: ["permitTypes"],
    queryFn: () => getPermitTypes(),
    keepPreviousData: true,
    staleTime: ONE_HOUR,
  });
};
