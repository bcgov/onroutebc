import {
  getCompanyIdFromSession,
  httpGETRequest,
  getUserGuidFromSession,
  httpPUTRequest,
  httpPOSTRequest,
  httpGETRequestStream,
} from "../../../common/apiManager/httpRequestHandler";

import {
  getDefaultRequiredVal,
  replaceEmptyValuesWithNull,
} from "../../../common/helpers/util";
import {
  Application,
  ApplicationResponse,
  PermitApplicationInProgress,
} from "../types/application";
import { DATE_FORMATS, toLocal } from "../../../common/helpers/formatDate";
import { APPLICATION_UPDATE_STATUS_API, PAYMENT_API, PERMITS_API } from "./endpoints/endpoints";
import { mapApplicationToApplicationRequestData } from "../helpers/mappers";
import { PermitTransaction, Transaction } from "../types/payment";
import { VEHICLES_URL } from "../../../common/apiManager/endpoints/endpoints";
import { ReadPermitDto } from "../types/permit";

/**
 * A record containing permit keys and full forms.
 */
const permitAbbreviations: Record<string, string> = {
  TROS: "Term Oversize",
  STOS: "Single Trip Oversize",
};

/**
 * Submits a new term oversize application.
 * @param termOversizePermit application data for term oversize permit
 * @returns response with created application data, or error if failed
 */
export const submitTermOversize = async (termOversizePermit: Application) => {
  return await httpPOSTRequest(
    PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT,
    replaceEmptyValuesWithNull({
      // must convert application to ApplicationRequestData (dayjs fields to strings)
      ...mapApplicationToApplicationRequestData(termOversizePermit),
    })
  );
};

/**
 * Updates an existing term oversize application.
 * @param termOversizePermit application data for term oversize permit
 * @param applicationNumber application number for the application to update
 * @returns response with updated application data, or error if failed
 */
export const updateTermOversize = async (
  termOversizePermit: Application,
  applicationNumber: string
) => {
  return await httpPUTRequest(
    `${PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT}/${applicationNumber}`,
    replaceEmptyValuesWithNull({
      // must convert application to ApplicationRequestData (dayjs fields to strings)
      ...mapApplicationToApplicationRequestData(termOversizePermit),
    })
  );
};

/**
 * Fetch All Permit Application in Progress
 * @return An array of permit applications
 */
export const getApplicationsInProgress = async (): Promise<
  PermitApplicationInProgress[]
> => {
  const applicationsUrl = `${VEHICLES_URL}/permits/applications?companyId=${getCompanyIdFromSession()}&userGUID=${getUserGuidFromSession()}&status=IN_PROGRESS`;
  const applications = await httpGETRequest(applicationsUrl).then((response) =>
    (
      getDefaultRequiredVal([], response.data) as PermitApplicationInProgress[]
    ).map((application) => {
      return {
        ...application,
        permitType: permitAbbreviations[application.permitType],
        createdDateTime: toLocal(
          application.createdDateTime,
          DATE_FORMATS.DATETIME_LONG_TZ
        ),
        updatedDateTime: toLocal(
          application.updatedDateTime,
          DATE_FORMATS.DATETIME_LONG_TZ
        ),
        permitData: {
          ...application.permitData,
          startDate: toLocal(
            application.permitData.startDate,
            DATE_FORMATS.DATEONLY_SHORT_NAME
          ),
          expiryDate: toLocal(
            application.permitData.startDate,
            DATE_FORMATS.DATEONLY_SHORT_NAME
          ),
        },
      } as PermitApplicationInProgress;
    })
  );
  return applications;
};

/**
 * Fetch in-progress application by its permit id.
 * @param permitId permit id of the application to fetch
 * @returns ApplicationResponse data as response, or undefined if fetch failed
 */
export const getApplicationInProgressById = (
  permitId: string | undefined
): Promise<ApplicationResponse | undefined> => {
  const companyId = getDefaultRequiredVal("", getCompanyIdFromSession());
  const url = `${VEHICLES_URL}/permits/applications/${permitId}?companyId=${companyId}`;
  return httpGETRequest(url).then((response) => response.data);
};

/**
 * Delete one or more applications.
 * @param permitIds Array of permit ids to be deleted.
 * @returns A Promise with the API response.
 */
export const deleteApplications = async (applicationIds: Array<string>) => {
  const requestBody = { applicationIds, applicationStatus: "CANCELLED" };
  return await httpPOSTRequest(
    `${APPLICATION_UPDATE_STATUS_API}`,
    replaceEmptyValuesWithNull(requestBody)
  );
};

const getFileNameFromHeaders = (headers: Headers) => {
  const contentDisposition = headers.get("content-disposition");
  if (!contentDisposition) return undefined;
  const matchRegex = /filename=(.+)/;
  const filenameMatch = matchRegex.exec(contentDisposition);
  if (filenameMatch && filenameMatch.length > 1) {
    return filenameMatch[1];
  }
  return undefined;
};

const streamDownload = async (url: string) => {
  const response = await httpGETRequestStream(url);
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
 * Download permit application pdf file.
 * @param permitId permit id of the permit application.
 * @returns A Promise of dms reference string.
 */
export const downloadPermitApplicationPdf = async (permitId: string) => {
  const url = `${PERMITS_API.BASE}/${permitId}/pdf?download=proxy`;
  return await streamDownload(url);
};

/**
 * Download permit receipt pdf file.
 * @param permitId permit id of the permit application associated with the receipt.
 * @returns A Promise of dms reference string.
 */
export const downloadReceiptPdf = async (permitId: string) => {
  const url = `${PERMITS_API.BASE}/${permitId}/receipt`;
  return await streamDownload(url);
};

/**
 * Generates a URL for making a payment transaction with Moti Pay.
 * @param {number} transactionAmount - The amount of the transaction.
 * @returns {Promise<any>} - A Promise that resolves to the transaction URL.
 */
export const getMotiPayTransactionUrl = async (
  paymentMethodId: number,
  transactionSubmitDate: string,
  transactionAmount: number,
  permitIds: string[]
): Promise<any> => {
  const url =
    `${PAYMENT_API}?` +
    `paymentMethodId=${paymentMethodId}` +
    `&transactionSubmitDate=${transactionSubmitDate}` +
    `&transactionAmount=${transactionAmount}` +
    `&permitIds=${permitIds.toString()}`;
  return httpGETRequest(url).then((response) => {
    return response.data.url;
  });
};

export const postTransaction = async (
  transactionDetails: Transaction
): Promise<any> => {
  const url = `${PAYMENT_API}`;
  return await httpPOSTRequest(url, transactionDetails);
};

/**
 * Retrieve the list of active or expired permits.
 * @param expired If set to true, expired permits will be retrieved.
 * @returns A list of permits.
 */
export const getPermits = async ({ expired = false } = {}): Promise<
  ReadPermitDto[]
> => {
  const companyId = getDefaultRequiredVal("", getCompanyIdFromSession());
  let permitsURL = `${VEHICLES_URL}/permits/user?companyId=${companyId}`;
  if (expired) {
    permitsURL += `&expired=${expired}`;
  }
  const permits = await httpGETRequest(permitsURL).then((response) =>
    (getDefaultRequiredVal([], response.data) as ReadPermitDto[]).map(
      (permit) => {
        return {
          ...permit,
          createdDateTime: toLocal(
            permit.createdDateTime,
            DATE_FORMATS.DATETIME_LONG_TZ
          ),
          updatedDateTime: toLocal(
            permit.updatedDateTime,
            DATE_FORMATS.DATETIME_LONG_TZ
          ),
          permitData: {
            ...permit.permitData,
            startDate: toLocal(
              permit.permitData.startDate,
              DATE_FORMATS.DATEONLY_SHORT_NAME
            ),
            expiryDate: toLocal(
              permit.permitData.startDate,
              DATE_FORMATS.DATEONLY_SHORT_NAME
            ),
          },
        } as ReadPermitDto;
      }
    )
  );
  return permits;
};

export const getPermitTransaction = async (transactionOrderNumber: string) => {
  try {
    const response = await httpGETRequest(
      `${PAYMENT_API}/${transactionOrderNumber}/permit`
    );
    if (response.status === 200) {
      return response.data as PermitTransaction;
    }
    return undefined;
  } catch (err) {
    return undefined;
  }
};
