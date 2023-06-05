import { AxiosResponse } from "axios";
import {
  httpPOSTRequest_axios,
  getCompanyIdFromSession,
  httpGETRequest,
  getUserGuidFromSession,
  httpPUTRequest_axios,
  httpPOSTRequest,
} from "../../../common/apiManager/httpRequestHandler";
import { Application, PermitApplicationInProgress } from "../types/application";
import { APPLICATION_PDF_API, APPLICATION_UPDATE_STATUS_API, PERMITS_API, VEHICLE_URL } from "./endpoints/endpoints";
import { formatDate } from "../../../common/helpers/formatDate";
import { replaceEmptyValuesWithNull } from "../../../common/helpers/util";

export const submitTermOversize = (
  termOversizePermit: Application
): Promise<AxiosResponse> => {
  return httpPOSTRequest_axios(
    PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT,
    termOversizePermit
  );
};

export const updateTermOversize = (
  termOversizePermit: Application,
  applicationNumber: string
): Promise<AxiosResponse> => {
  return httpPUTRequest_axios(
    `${PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT}/${applicationNumber}`,
    termOversizePermit
  );
};

/**
 * Fetch*
 * All Permit Application in Progress
 * @return An array of permit applications
 */
export const getApplicationsInProgress = async (): Promise<
  PermitApplicationInProgress[]
> => {
  const applicationsUrl = `${VEHICLE_URL}/permits/applications?companyId=${getCompanyIdFromSession()}&userGUID=${getUserGuidFromSession()}&status=IN_PROGRESS`;
  const applications = await httpGETRequest(applicationsUrl).then(
    (response) => response.data
  );
  if (applications.length > 0) {
    applications.forEach(
      (a: {
        unitNumber: any;
        permitData: any;
        vehicleDetails: any;
        plate: any;
        permitType: any;
        startDate: any;
        updatedDateTime: any;
        vehicleType: any;
      }) => {
        if (a.permitType === "TROS") {
          a.permitType = "Term Oversize";
        } else if (a.permitType === "STOS") {
          a.permitType = "Single Trip Oversize";
        }

        const startDateFormatter = new Intl.DateTimeFormat("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        const startDateFormattedStr = formatDate(
          startDateFormatter,
          a.permitData.startDate
        );
        a.startDate = startDateFormattedStr;

        const updatedDateTimeFormatter = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          timeZoneName: "short",
        });
        const updatedDateTimeFormattedStr = formatDate(
          updatedDateTimeFormatter,
          a.updatedDateTime
        );
        a.updatedDateTime = updatedDateTimeFormattedStr;
      }
    );
  }
  return applications;
};

export const getApplicationInProgressById = (
  permitId: string | undefined,
)  : Promise<Application | undefined>=> {
  const url = `${VEHICLE_URL}/permits/applications/${permitId}`;
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
export const viewPermitApplicationPdf = (
  permitId: number,
): Promise<string> => {
  const url = `${APPLICATION_PDF_API}/${permitId}`;
  return httpGETRequest(url).then(response => response.data);
};