import { httpGETRequest, httpPOSTRequest, getCompanyIdFromSession, getUserGuidFromSession } from "../../../common/apiManager/httpRequestHandler";
import { replaceEmptyValuesWithNull } from "../../../common/helpers/util";
import { PERMITS_API, VEHICLE_URL } from "./endpoints/endpoints";
import { PermitApplicationInProgress } from "../types/application";
import { formatDate } from "../../../common/helpers/formatDate";

export const submitTermOversize = (
  termOversizePermit: any
): Promise<Response> => {
  return httpPOSTRequest(
    PERMITS_API.SUBMIT_TERM_OVERSIZE_PERMIT,
    replaceEmptyValuesWithNull(termOversizePermit)
  );
};

/**
 * Fetch*
 * All Permit Application in Progress
 * @return An array of permit applications
 */
export const getApplicationsInProgress = async (): Promise<(PermitApplicationInProgress)[]> => {
  const applicationsUrl = `${VEHICLE_URL}/permits/applications?companyId=${getCompanyIdFromSession()}&userGUID=${getUserGuidFromSession()}&status=IN_PROGRESS`;
  const applications = await httpGETRequest(applicationsUrl).then((response) => response.data);
  if (applications.length > 0) {
    applications.forEach((a: { unitNumber: any; permitData: any; vehicleDetails: any; plate: any; permitType: any; startDate: any; updatedDateTime: any; vehicleType: any}) => {
        
      if(a.permitType === "TROS"){
        a.permitType = "Term Oversize";
      }
      else if(a.permitType === "STOS"){
        a.permitType = "Single Trip Oversize";
      }

      const startDateFormatter = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const startDateFormattedStr = formatDate(startDateFormatter, a.permitData.startDate);
      a.startDate = startDateFormattedStr;
  
      const updatedDateTimeFormatter = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZoneName: "short",
      });
      const updatedDateTimeFormattedStr = formatDate(updatedDateTimeFormatter, a.updatedDateTime);
      a.updatedDateTime = updatedDateTimeFormattedStr;
    });
  }
  return applications;

};

/**
 * Delete Permit Applications in Progress
 * @return An object with two string arrays for deletion success or failure
 */
export const deleteApplicationsInProgress = (
  applicationNumbers: Array<string>,
): Promise<Response> => {
  const url = `${VEHICLE_URL}/permits/applications/delete-requests?companyId=${getCompanyIdFromSession()}`;
  const requestBody = { applicationsInProgress: applicationNumbers };
  return httpPOSTRequest(url, replaceEmptyValuesWithNull(requestBody));
};


