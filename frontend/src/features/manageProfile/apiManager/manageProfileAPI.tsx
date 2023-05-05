import {
  httpGETRequest,
  httpPOSTRequest,
  httpPUTRequest,
  getCompanyIdFromSession,
  getUserGuidFromSession,
} from "../../../common/apiManager/httpRequestHandler";
import { UserContextType } from "../../../common/authentication/types";
import { replaceEmptyValuesWithNull } from "../../../common/helpers/util";
import { CompanyProfile, CompanyAndUserRequest, UserInformation } from "../types/manageProfile";
import { MANAGE_PROFILE_API, MANAGE_PROFILE_URL } from "./endpoints/endpoints";

export const getCompanyInfo = async (): Promise<CompanyProfile> => {
  const url = MANAGE_PROFILE_API.COMPANIES + "/" + getCompanyIdFromSession();
  return httpGETRequest(url).then((response) => response.data);
};

export const getMyInfo = async (): Promise<UserInformation> => {
  const url = `${MANAGE_PROFILE_API.MY_INFO}/${getUserGuidFromSession()}?companyId=${getCompanyIdFromSession()}`;
  return httpGETRequest(url).then((response) => response.data);
};

/* eslint-disable @typescript-eslint/no-unused-vars */
export const updateCompanyInfo = async ({
  companyInfo,
}: {
  companyInfo: CompanyProfile;
}): Promise<Response> => {

  return httpPUTRequest(
    `${MANAGE_PROFILE_API.COMPANIES}/${getCompanyIdFromSession()}`,
    replaceEmptyValuesWithNull(companyInfo)
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
    replaceEmptyValuesWithNull(onRouteBCProfileRequestObject)
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
  return httpGETRequest(
    `${MANAGE_PROFILE_URL}/users/roles?companyId=${getCompanyIdFromSession()}`
  ).then((response) => response.data);
};
