import { VEHICLES_URL } from "../../../common/apiManager/endpoints/endpoints";
import {
  httpGETRequest,
  httpPOSTRequest,
  httpPUTRequest,
  getCompanyIdFromSession,
  getUserGuidFromSession,
} from "../../../common/apiManager/httpRequestHandler";
import { UserContextType } from "../../../common/authentication/types";
import { replaceEmptyValuesWithNull } from "../../../common/helpers/util";
import {
  CompanyProfile,
  CompanyAndUserRequest,
  UserInformation,
} from "../types/manageProfile";
import { ReadCompanyUser } from "../types/userManagement";
import { MANAGE_PROFILE_API } from "./endpoints/endpoints";

export const getCompanyInfo = async (): Promise<CompanyProfile> => {
  const url = MANAGE_PROFILE_API.COMPANIES + "/" + getCompanyIdFromSession();
  return httpGETRequest(url).then((response) => response.data);
};

export const getMyInfo = async (): Promise<UserInformation> => {
  const url = `${
    MANAGE_PROFILE_API.MY_INFO
  }/${getUserGuidFromSession()}?companyId=${getCompanyIdFromSession()}`;
  return httpGETRequest(url).then((response) => response.data);
};

/* eslint-disable @typescript-eslint/no-unused-vars */
export const updateCompanyInfo = async ({
  companyInfo,
}: {
  companyInfo: CompanyProfile;
}) => {
  return await httpPUTRequest(
    `${MANAGE_PROFILE_API.COMPANIES}/${getCompanyIdFromSession()}`,
    replaceEmptyValuesWithNull(companyInfo)
  );
};

export const updateMyInfo = async ({ myInfo }: { myInfo: UserInformation }) => {
  return await httpPUTRequest(
    `${
      MANAGE_PROFILE_API.COMPANIES
    }/${getCompanyIdFromSession()}/users/${getUserGuidFromSession()}`,
    replaceEmptyValuesWithNull(myInfo)
  );
};

/**
 * Creates an onRouteBC profile.
 * @param onRouteBCProfileRequestObject The request object containing the profile details
 * @returns A Promise containing the response from the API.
 */
export const createOnRouteBCProfile = async (
  onRouteBCProfileRequestObject: CompanyAndUserRequest
) => {
  return await httpPOSTRequest(
    `${MANAGE_PROFILE_API.COMPANIES}`,
    replaceEmptyValuesWithNull(onRouteBCProfileRequestObject)
  );
};

/**
 * Retrieve the company and user details post login.
 */
export const getUserContext = (): Promise<UserContextType> => {
  const url = `${VEHICLES_URL}/users/user-context`;
  return httpPOSTRequest(url, {}).then((response) => response.data);
};

/**
 * Retrieves the roles of the user w.r.t a company.
 */
export const getUserRolesByCompanyId = (): Promise<string[]> => {
  return httpGETRequest(
    `${VEHICLES_URL}/users/roles?companyId=${getCompanyIdFromSession()}`
  ).then((response) => response.data);
};

/**
 * Retrieves the users of a company by companyId
 * @returns a promise containing the users.
 */
export const getCompanyUsers = ({
  page = 1,
  limit = 10,
} = {}): Promise<ReadCompanyUser> => {
  return httpGETRequest(
    `${VEHICLES_URL}/users?companyId=${getCompanyIdFromSession()}`
  ).then((response) => response.data);
};
