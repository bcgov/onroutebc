import { DATE_FORMATS, toLocal } from "../../../common/helpers/formatDate";
import { mapApplicationToApplicationRequestData } from "../helpers/mappers";
import { VEHICLES_URL } from "../../../common/apiManager/endpoints/endpoints";
import { IssuePermitsResponse, ReadPermitDto } from "../types/permit";
import { PaginatedResponse } from "../../../common/types/common";
import { PERMIT_STATUSES } from "../types/PermitStatus";
import { PermitHistory } from "../types/PermitHistory";
import { getPermitTypeName } from "../types/PermitType";
import { 
  CompleteTransactionRequestData, 
  CompleteTransactionResponseData, 
  StartTransactionRequestData, 
  StartTransactionResponseData, 
} from "../types/payment";

import {
  getCompanyIdFromSession,
  httpGETRequest,
  getUserGuidFromSession,
  httpPUTRequest,
  httpPOSTRequest,
  httpGETRequestStream,
} from "../../../common/apiManager/httpRequestHandler";

import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
  replaceEmptyValuesWithNull,
} from "../../../common/helpers/util";

import {
  Application,
  ApplicationResponse,
  PermitApplicationInProgress,
} from "../types/application";

import {
  APPLICATION_UPDATE_STATUS_API,
  PAYMENT_API,
  PERMITS_API,
} from "./endpoints/endpoints";
import { RevokePermitRequestData, VoidPermitRequestData, VoidPermitResponseData } from "../pages/Void/types/VoidPermit";

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
  const companyId = getCompanyIdFromSession();
  const userGuid = getUserGuidFromSession();
  let applicationsUrl = `${VEHICLES_URL}/permits/applications?status=IN_PROGRESS`;
  if (companyId) {
    applicationsUrl += `&companyId=${companyId}`;
  }
  if (userGuid) {
    applicationsUrl += `&userGUID=${userGuid}`;
  }

  const applications = await httpGETRequest(applicationsUrl).then((response) =>
    (
      getDefaultRequiredVal([], response.data) as PermitApplicationInProgress[]
    ).map((application) => {
      return {
        ...application,
        permitType: getPermitTypeName(application.permitType) as string,
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
 * Fetch application by its permit id.
 * @param permitId permit id of the application to fetch
 * @returns ApplicationResponse data as response, or null if fetch failed
 */
export const getApplicationByPermitId = async (
  permitId?: string
): Promise<ApplicationResponse | null> => {
  try {
    const companyId = getCompanyIdFromSession();
    let url = `${VEHICLES_URL}/permits/applications/${permitId}`;
    if (companyId) {
      url += `?companyId=${companyId}`;
    }

    const response = await httpGETRequest(url);
    return response.data;
  } catch (err) {
    return null;
  }
};

/**
 * Delete one or more applications.
 * @param permitIds Array of permit ids to be deleted.
 * @returns A Promise with the API response.
 */
export const deleteApplications = async (applicationIds: Array<string>) => {
  const requestBody = { applicationIds, applicationStatus: PERMIT_STATUSES.CANCELLED };
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
 * Start making a payment transaction with Moti Pay.
 * @param {StartTransactionRequestData} requestData - Payment information that is to be submitted.
 * @returns {Promise<StartTransactionResponseData>} - A Promise that resolves to the submitted transaction with URL.
 */
export const startTransaction = async (
  requestData: StartTransactionRequestData
): Promise<StartTransactionResponseData | null> => {
  try {
    const response = await httpPOSTRequest(PAYMENT_API, replaceEmptyValuesWithNull(requestData));
    if (response.status !== 201) {
      return null;
    }
    return response.data as StartTransactionResponseData;
  } catch (err) {
    console.error(err);
    return null;
  }
};

/**
 * Completes the transaction after payment is successful.
 * @param transactionId - The id for the transaction to be completed
 * @param transactionQueryString - the queryString with the hashValue to be validated
 * @param transactionDetails - The complete transaction details to be submitted after payment
 * @returns Promise that resolves to a successful transaction.
 */
export const completeTransaction = async (transactionData: {
  transactionId: string,
  transactionQueryString: string,
  transactionDetails: CompleteTransactionRequestData
}): Promise<CompleteTransactionResponseData | null> => {
  try {
    const { 
      transactionId, 
      transactionDetails,
      transactionQueryString,
    } = transactionData;
    
    const response = await httpPUTRequest(
      `${PAYMENT_API}/${transactionId}/payment-gateway?queryString=${transactionQueryString}`,
      transactionDetails
    );
    if (response.status !== 200) {
      return null;
    }
    return response.data as CompleteTransactionResponseData;
  } catch (err) {
    console.error(err);
    return null;
  }
};

/**
 * Issues the permits indicated by the application/permit ids.
 * @param ids Application/permit ids for the permits to be issued.
 * @returns Successful and failed permit ids that were issued.
 */
export const issuePermits = async (
  ids: string[],
): Promise<IssuePermitsResponse> => {
  try {
    const companyId = getCompanyIdFromSession();
    const response = await httpPOSTRequest(
      PERMITS_API.ISSUE_PERMIT, 
      replaceEmptyValuesWithNull({ 
        applicationIds: [...ids], 
        companyId: applyWhenNotNullable((companyId) => Number(companyId), companyId),
      })
    );
    
    if (response.status !== 201) {
      return {
        success: [],
        failure: [...ids],
      };
    }
    return response.data as IssuePermitsResponse;
  } catch (err) {
    console.error(err);
    return {
      success: [],
      failure: [...ids],
    };
  }
};

/**
 * Get permit by permit id
 * @param permitId Permit id of the permit to be retrieved.
 * @returns Permit information if found, or undefined
 */
export const getPermit = async (permitId?: string): Promise<ReadPermitDto | null> => {
  if (!permitId) return null;
  const companyId = getDefaultRequiredVal("", getCompanyIdFromSession());
  let permitsURL = `${VEHICLES_URL}/permits/${permitId}`;
  const queryParams = [];
  if (companyId) {
    queryParams.push(`companyId=${companyId}`);
  }
  if (queryParams.length > 0) {
    permitsURL += `?${queryParams.join("&")}`;
  }

  const response = await httpGETRequest(permitsURL);
  if (!response.data) return null;
  return response.data as ReadPermitDto;
};

/**
 * Get current application for amendment, if there is one
 * @param originalId Original permit id of the permit that is amended.
 * @returns Permit application information, if any
 */
export const getCurrentAmendmentApplication = async (
  originalId?: string
): Promise<ReadPermitDto | null> => {
  if (!originalId) return null;
  const companyId = getDefaultRequiredVal("", getCompanyIdFromSession());
  let permitsURL = `${VEHICLES_URL}/permits/applications/${originalId}`;
  const queryParams = [`amendment=true`];
  if (companyId) {
    queryParams.push(`companyId=${companyId}`);
  }
  if (queryParams.length > 0) {
    permitsURL += `?${queryParams.join("&")}`;
  }

  try {
    const response = await httpGETRequest(permitsURL);
    if (!response.data) return null;
    return response.data as ReadPermitDto;
  } catch (err) {
    return null;
  }
};

/**
 * Retrieve the list of active or expired permits.
 * @param expired If set to true, expired permits will be retrieved.
 * @returns A list of permits.
 */
export const getPermits = async ({
  expired = false,
} = {}): Promise<ReadPermitDto[]> => {
  const companyId = getDefaultRequiredVal("", getCompanyIdFromSession());
  let permitsURL = `${VEHICLES_URL}/permits/user`;
  const queryParams = [];
  if (companyId) {
    queryParams.push(`companyId=${companyId}`);
  }
  if (expired) {
    queryParams.push(`expired=${expired}`);
  }
  if (queryParams.length > 0) {
    permitsURL += `?${queryParams.join("&")}`;
  }
  const permits = await httpGETRequest(permitsURL)
    .then((response) => {
      const paginatedResponseObject = getDefaultRequiredVal(
        {},
        response.data
      ) as PaginatedResponse<ReadPermitDto>;
      return paginatedResponseObject.items;
    })
    .then((permits) =>
      permits.map((permit) => {
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
              permit.permitData.expiryDate,
              DATE_FORMATS.DATEONLY_SHORT_NAME
            ),
          },
        } as ReadPermitDto;
      })
    );
  return permits;
};

export const getPermitHistory = async (originalPermitId?: string) => {
  try {
    if (!originalPermitId) return [];
    
    const response = await httpGETRequest(
      `${VEHICLES_URL}/permits/history?originalId=${originalPermitId}`
    );

    if (response.status === 200) {
      return response.data as PermitHistory[];
    }
    return [];
  } catch (err) {
    return [];
  }
};

/**
 * Void or revoke a permit.
 * @param permitId Id of the permit to void or revoke.
 * @param voidData Void or revoke data to be sent to backend.
 * @returns Response data containing successfully voided/revoked permit ids, as well as failed ones.
 */
export const voidPermit = async (voidPermitParams: {
  permitId: string, 
  voidData: VoidPermitRequestData | RevokePermitRequestData
}) => {
  const { permitId, voidData } = voidPermitParams;
  try {
    const response = await httpPOSTRequest(
      `${PERMITS_API.BASE}/${permitId}/void`,
      replaceEmptyValuesWithNull(voidData)
    );

    if (response.status === 201) {
      return response.data as VoidPermitResponseData;
    }
    return {
      success: [],
      failure: [permitId],
    };
  } catch (err) {
    console.error(err);
    return {
      success: [],
      failure: [permitId],
    };
  }
};

/**
 * Amend a permit.
 * @param permit permit data for permit to be amended
 * @returns response with amended permit data, or error if failed
 */
export const amendPermit = async (permit: ReadPermitDto) => {
  return await httpPOSTRequest(
    PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT,
    replaceEmptyValuesWithNull({
      ...permit,
    })
  );
};

/**
 * Modify amendment application.
 * @param application amendment application data to be modified
 * @param applicationNumber application number of the amendment application
 * @returns response with amended permit data, or error if failed
 */
export const modifyAmendmentApplication = async ({
  application,
  applicationNumber,
}: {
  application: Application;
  applicationNumber: string;
}) => {
  return await updateTermOversize(application, applicationNumber);
};
