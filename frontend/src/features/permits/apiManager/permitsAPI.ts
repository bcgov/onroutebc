import { AxiosResponse } from "axios";
import {
  httpPOSTRequest_axios,
  getCompanyIdFromSession,
  httpGETRequest,
  getUserGuidFromSession,
  httpPUTRequest_axios,
  httpPOSTRequest,
} from "../../../common/apiManager/httpRequestHandler";

import { getDefaultRequiredVal, replaceEmptyValuesWithNull } from "../../../common/helpers/util";
import { Application, ApplicationResponse, PermitApplicationInProgress } from "../types/application";
import { DATE_FORMATS, toLocal } from "../../../common/helpers/formatDate";
import { APPLICATION_PDF_API, APPLICATION_UPDATE_STATUS_API, PAYMENT_API, PERMITS_API } from "./endpoints/endpoints";
import { mapApplicationToApplicationRequestData } from "../helpers/mappers";
import { Transaction } from "../types/payment";
import { VEHICLES_URL } from "../../../common/apiManager/endpoints/endpoints";

/**
 * Submits a new term oversize application.
 * @param termOversizePermit application data for term oversize permit
 * @returns response with created application data, or error if failed
 */
export const submitTermOversize = (
  termOversizePermit: Application
): Promise<AxiosResponse> => {
  return httpPOSTRequest_axios(
    PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT,
    replaceEmptyValuesWithNull({
      // must convert application to ApplicationRequestData (dayjs fields to strings)
      ...mapApplicationToApplicationRequestData(termOversizePermit),
      permitApplicationOrigin: "PPC", // temporarily added here, remove once backend handler for this logic is ready
    })
  );
};

/**
 * Updates an existing term oversize application.
 * @param termOversizePermit application data for term oversize permit
 * @param applicationNumber application number for the application to update
 * @returns response with updated application data, or error if failed
 */
export const updateTermOversize = (
  termOversizePermit: Application,
  applicationNumber: string
): Promise<AxiosResponse> => {
  return httpPUTRequest_axios(
    `${PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT}/${applicationNumber}`,
    replaceEmptyValuesWithNull({
      // must convert application to ApplicationRequestData (dayjs fields to strings)
      ...mapApplicationToApplicationRequestData(termOversizePermit),
      permitApplicationOrigin: "PPC", // temporarily added here, remove once backend handler for this logic is ready
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
  const applications = await httpGETRequest(applicationsUrl).then(
    (response) => (getDefaultRequiredVal([], response.data) as PermitApplicationInProgress[])
      .map(application => {
        let permitType = "";
        switch (application.permitType) {
          case "TROS":
            permitType = "Term Oversize";
            break;
          case "STOS":
          default:
            permitType = "Single Trip Oversize";
            break;
        }

        return {
          ...application,
          permitType,
          createdDateTime: toLocal(application.createdDateTime, DATE_FORMATS.DATETIME_LONG_TZ),
          updatedDateTime: toLocal(application.updatedDateTime, DATE_FORMATS.DATETIME_LONG_TZ),
          permitData: {
            ...application.permitData,
            startDate: toLocal(application.permitData.startDate, DATE_FORMATS.DATEONLY_SHORT_NAME),
            expiryDate: toLocal(application.permitData.startDate, DATE_FORMATS.DATEONLY_SHORT_NAME),
          }
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
  permitId: string | undefined,
)  : Promise<ApplicationResponse | undefined>=> {
  const companyId = getDefaultRequiredVal("", getCompanyIdFromSession());
  const url = `${VEHICLES_URL}/permits/applications/${permitId}?companyId=${companyId}`;
  return httpGETRequest(url).then(response => response.data);
};

/**
 * Delete one or more applications.
 * @param permitIds Array of permit ids to be deleted.
 * @returns A Promise with the API response.
 */
export const deleteApplications = (
  applicationIds: Array<string>,
): Promise<Response> => {
  let url: string | null = null;
  const requestBody: { applicationIds: Array<string>, applicationStatus: string } = { applicationIds: applicationIds, applicationStatus: "CANCELLED"};
  url = `${APPLICATION_UPDATE_STATUS_API}`;
  return httpPOSTRequest(url, replaceEmptyValuesWithNull(requestBody));
};

/**
 * View permit application pdf file.
 * @param permitId permit id of the permit application.
 * @returns A Promise of dms reference string.
 */
export const downloadPermitApplicationPdf = (
  permitId: number | undefined,
): Promise<any> => {
  const url = `${APPLICATION_PDF_API}/${permitId}?download=proxy`;
  return httpGETRequest(url).then((response) => {
    return response;
  });
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
  permitIds: number[]
): Promise<any> => {
  const url = `${PAYMENT_API}?paymentMethodId=${paymentMethodId}&transactionSubmitDate=${transactionSubmitDate}&transactionAmount=${transactionAmount}&permitIds=${permitIds.toString()}`;
  return httpGETRequest(url).then((response) => {
    return response.data.url;
  });
};

export const postTransaction = async (
  transactionDetails: Transaction,
): Promise<any> => {
  const url = `${PAYMENT_API}`;
  return httpPOSTRequest_axios(url, transactionDetails).then((response) => {
    return response;
  })
  .catch((err) => {
    return err;
  });
};
