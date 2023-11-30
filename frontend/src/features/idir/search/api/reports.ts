import { useQuery } from "@tanstack/react-query";
import { VEHICLES_URL } from "../../../../common/apiManager/endpoints/endpoints";
import {
  httpGETRequest,
  httpPOSTRequestStream,
} from "../../../../common/apiManager/httpRequestHandler";
import { getFileNameFromHeaders } from "../../../permits/apiManager/permitsAPI";
import { ONE_HOUR } from "../../../../common/constants/constants";

/**
 * The request object type for payment and refund summary
 */
export type PaymentAndRefundSummaryRequest = {
  issuedBy: string[];
  fromDateTime: string;
  toDateTime: string;
};

export interface PaymentCodes {
  paymentMethodTypeCode: string;
  paymentCardTypeCode?: string;
}

/**
 * The request object type for payment and refund detail
 */
export interface PaymentAndRefundDetailRequest
  extends PaymentAndRefundSummaryRequest {
  permitType: string[];
  paymentMethodType?: string[];
  paymentCodes: PaymentCodes[] | ["ALL"];
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

const permitTypes_REFERENCE = {
  EPTOP: "Extra-Provincial Temporary Operating",
  HC: "Highway Crossing",
  LCV: "Long Combination Vehicle",
  MFP: "Motive Fuel User",
  NRQBS: "Quarterly Non Resident Reg. / Ins. - Bus",
  NRQCL: "Non Resident Quarterly Conditional License",
  NRQCV: "Quarterly Non Resident Reg. / Ins. - Comm Vehicle",
  NRQFT: "Non Resident Quarterly Farm Tractor",
  NRQFV: "Quarterly Non Resident Reg. / Ins. - Farm Vehicle",
  NRQXP: "Non Resident Quarterly X Plated",
  NRSBS: "Single Trip Non-Resident Registration / Insurance -Buses",
  NRSCL: "Non Resident Single Trip Conditional License",
  NRSCV: "Single Trip Non-Resident Reg. / Ins. - Commercial Vehicle",
  NRSFT: "Non Resident Farm Tractor Single Trip",
  NRSFV: "Single Trip Non Resident Reg. / Ins. - Farm Vehicle",
  NRSXP: "Non Resident Single Trip X Plated Vehicle",
  RIG: "Rig Move",
  STOS: "Single Trip Oversize",
  STOW: "Single Trip Over Weight",
  STWS: "Single Trip Overweight Oversize",
  TRAX: "Term Axle Overweight",
  TROS: "Term Oversize",
  TROW: "Term Overweight",
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
 * 
 * @returns 
 */
export const usePermitTypesQuery = () => {
  return useQuery({
    queryKey: ["permitTypes"],
    queryFn: () => getPermitTypes(),
    // select: (data) => {
    //   return {
    //     "All Permit Types": "ALL",
    //     ...data,
    //   };
    // },
    keepPreviousData: true,
    staleTime: ONE_HOUR,
  });
}
