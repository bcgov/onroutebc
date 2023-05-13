import { AxiosResponse } from "axios";
import {
  httpPOSTRequest_axios,
  getCompanyIdFromSession,
  httpGETRequest,
  getUserGuidFromSession,
  httpPUTRequest_axios,
} from "../../../common/apiManager/httpRequestHandler";
import { replaceEmptyValuesWithNull } from "../../../common/helpers/util";
import { Application, PermitApplicationInProgress } from "../types/application";
import { PERMITS_API, VEHICLE_URL } from "./endpoints/endpoints";
import { formatDate } from "../../../common/helpers/formatDate";

export const submitTermOversize = (
  termOversizePermit: Application
): Promise<AxiosResponse> => {
  return httpPOSTRequest_axios(
    PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT,
    replaceEmptyValuesWithNull(termOversizePermit)
  );
};

export const updateTermOversize = (
  termOversizePermit: Application,
  applicationNumber: string
): Promise<AxiosResponse> => {
  return httpPUTRequest_axios(
    `${PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT}/${applicationNumber}`,
    replaceEmptyValuesWithNull(termOversizePermit)
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
  applicationNumber: string | undefined,
)  : Promise<Application | undefined>=> {
  const url = `${VEHICLE_URL}/permits/applications/${applicationNumber}`;
  return httpGETRequest(url).then(response => response.data);
};
