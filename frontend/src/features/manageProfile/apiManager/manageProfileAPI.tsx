import {
  httpGETRequest,
  httpPOSTRequest,
  httpPUTRequest,
  getCompanyIdFromSession,
} from "../../../common/apiManager/httpRequestHandler";
import { UserContextType } from "../../../common/authentication/types";
import { CompanyProfile, CompanyAndUserRequest } from "../types/manageProfile";
import { MANAGE_PROFILE_API, MANAGE_PROFILE_URL } from "./endpoints/endpoints";

export const getCompanyInfo = async (): Promise<CompanyProfile> => {
  const url = MANAGE_PROFILE_API.COMPANIES + "/" + getCompanyIdFromSession();
  return httpGETRequest(url).then((response) => response.data);
};

/* eslint-disable @typescript-eslint/no-unused-vars */
export const updateCompanyInfo = async ({
  companyInfo,
}: {
  companyInfo: CompanyProfile;
}): Promise<Response> => {
  // If the mailing address is the same as the company address, then send an undefined mailing address
  // The backend API will set the mailing address ID to match the company address ID
  if (companyInfo.mailingAddressSameAsCompanyAddress) {
    companyInfo.mailingAddress = undefined;
  }

  return httpPUTRequest(
    `${MANAGE_PROFILE_API.COMPANIES}/${getCompanyIdFromSession()}`,
    companyInfo
  );
};

/**
 * Creates an onRouteBC profile.
 * @param onRouteBCProfileRequestObject The request object containing the profile details
 * @returns A Promise containing the response from the API.
 */
export const createOnRouteBCProfile = async (
  onRouteBCProfileRequestObject: CompanyAndUserRequest
): Promise<Response> => {
  return httpPOSTRequest(
    `${MANAGE_PROFILE_API.COMPANIES}`,
    onRouteBCProfileRequestObject
  );
};

/**
 * Retrieve the company and user details post login.
 */
export const getUserContext = (): Promise<UserContextType> => {
  const url = `${MANAGE_PROFILE_URL}/users/user-context`;
  return httpGETRequest(url).then((response) => response.data);
};

/**
 * Retrieves the roles of the user w.r.t a company.
 */
export const getUserRolesByCompanyId = (): Promise<string[]> => {
  return httpGETRequestPromise(
    `${MANAGE_PROFILE_URL}/users/roles?companyId=${getCompanyIdFromSession()}`
  ).then((response) => response.json());
};
