import { VEHICLES_URL } from "../../../common/apiManager/endpoints/endpoints";
import { BCeIDUserContextType } from "../../../common/authentication/types";
import { replaceEmptyValuesWithNull } from "../../../common/helpers/util";
import { RequiredOrNull } from "../../../common/types/common";
import { BCeIDAddUserRequest, ReadCompanyUser } from "../types/userManagement";
import { MANAGE_PROFILE_API } from "./endpoints/endpoints";
import {
  httpGETRequest,
  httpPOSTRequest,
  httpPUTRequest,
  getCompanyIdFromSession,
  getUserGuidFromSession,
  httpDELETERequest,
} from "../../../common/apiManager/httpRequestHandler";

import {
  CompanyProfile,
  CompanyAndUserRequest,
  UserInformation,
  Contact,
  VerifyMigratedClientRequest,
  VerifyMigratedClientResponse,
} from "../types/manageProfile";

export const getCompanyInfo = async (): Promise<CompanyProfile> => {
  const url = MANAGE_PROFILE_API.COMPANIES + "/" + getCompanyIdFromSession();
  return httpGETRequest(url).then((response) => response.data);
};

export const getCompanyInfoById = async (
  companyId: number,
): Promise<RequiredOrNull<CompanyProfile>> => {
  try {
    const response = await httpGETRequest(
      `${MANAGE_PROFILE_API.COMPANIES}/${companyId}`,
    );
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getMyInfo = async (): Promise<UserInformation> => {
  const companyId = getCompanyIdFromSession();
  let url = `${MANAGE_PROFILE_API.MY_INFO}/${getUserGuidFromSession()}`;
  if (companyId) {
    url += `?companyId=${companyId}`;
  }
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
    replaceEmptyValuesWithNull(companyInfo),
  );
};

export const updateMyInfo = async ({ myInfo }: { myInfo: UserInformation }) => {
  return await httpPUTRequest(
    `${
      MANAGE_PROFILE_API.COMPANIES
    }/${getCompanyIdFromSession()}/users/${getUserGuidFromSession()}`,
    replaceEmptyValuesWithNull(myInfo),
  );
};

/**
 * For use in the Profile Wizard
 * @param param0
 * @returns
 */
export const createMyOnRouteBCUserProfile = async ({
  myInfo,
}: {
  myInfo: Contact;
}) => {
  return await httpPOSTRequest(
    `${MANAGE_PROFILE_API.COMPANIES}/${getCompanyIdFromSession()}/users`,
    replaceEmptyValuesWithNull(myInfo),
  );
};

/**
 * Creates an onRouteBC profile.
 * @param onRouteBCProfileRequestObject The request object containing the profile details
 * @returns A Promise containing the response from the API.
 */
export const createOnRouteBCProfile = (
  onRouteBCProfileRequestObject: CompanyAndUserRequest,
) => {
  return httpPOSTRequest(
    `${MANAGE_PROFILE_API.COMPANIES}`,
    replaceEmptyValuesWithNull(onRouteBCProfileRequestObject),
  );
};

/**
 * Verifies a migrated client through an API call.
 * @param requestPayload The verify migrated client form values.
 * @returns A promise containing details of the verification.
 */
export const verifyMigratedClient = (
  requestPayload: VerifyMigratedClientRequest,
): Promise<VerifyMigratedClientResponse> => {
  return httpPOSTRequest(
    `${VEHICLES_URL}/users/verify-migrated-client`,
    replaceEmptyValuesWithNull(requestPayload),
  ).then((response) => response.data);
};

/**
 * Retrieve the company and user details post login.
 */
export const getUserContext = (): Promise<BCeIDUserContextType> => {
  const url = `${VEHICLES_URL}/users/user-context`;
  return httpPOSTRequest(url, {}).then((response) => response.data);
};

/**
 * Retrieves the roles of the user w.r.t a company.
 */
export const getUserRolesByCompanyId = (): Promise<string[]> => {
  const companyId = getCompanyIdFromSession();
  let url = `${VEHICLES_URL}/users/roles`;
  if (companyId) {
    url += `?companyId=${companyId}`;
  }
  return httpGETRequest(url).then((response) => response.data);
};

/**
 * Retrieves the roles of an IDIR user (i.e., OnRouteBC staff).
 */
export const getIDIRUserRoles = async (): Promise<RequiredOrNull<string[]>> => {
  return httpGETRequest(`${VEHICLES_URL}/users/roles`).then(
    (response) => response.data,
  );
};

/**
 * Retrieves the users of a company by companyId
 * @returns a promise containing the users.
 */
export const getCompanyUsers = (): Promise<ReadCompanyUser[]> => {
  return httpGETRequest(
    `${VEHICLES_URL}/companies/${getCompanyIdFromSession()}/users?includePendingUser=true`,
  ).then((response) => response.data);
};

/**
 * Retrieves the users of a company by companyId
 * @returns a promise containing the users.
 */
export const getCompanyPendingUsers = (): Promise<ReadCompanyUser[]> => {
  return httpGETRequest(
    `${VEHICLES_URL}/companies/${getCompanyIdFromSession()}/pending-users`,
  ).then((response) => response.data);
};

/**
 * Adds a user to a company.
 * @param addUserRequest The request object containing the user details
 * @returns A Promise containing the response from the API.
 */
export const addUserToCompany = async (addUserRequest: BCeIDAddUserRequest) => {
  return await httpPOSTRequest(
    `${
      MANAGE_PROFILE_API.COMPANIES
    }/${getCompanyIdFromSession()}/pending-users`,
    replaceEmptyValuesWithNull(addUserRequest),
  );
};

/**
 * Deletes a user of the company by companyId
 * @returns a promise containing the users.
 */
export const deleteCompanyUsers = (userName: string) => {
  return httpDELETERequest(
    `${VEHICLES_URL}/companies/${getCompanyIdFromSession()}/pending-users/${userName}`,
  );
};

/**
 * Retrieves a users of a company by the user's userGUID.
 * (For admin's user management operations)
 * @returns a promise containing the user.
 */
export const getCompanyUserByUserGUID = (
  userGUID: string,
): Promise<ReadCompanyUser> => {
  return httpGETRequest(`${VEHICLES_URL}/users/${userGUID}`).then(
    (response) => response.data,
  );
};

/**
 *
 * @param userInfo The updated user info object.
 * @returns A Promise with the API response.
 */
export const updateUserInfo = async ({
  userInfo,
  userGUID,
}: {
  userInfo: ReadCompanyUser;
  userGUID: string;
}) => {
  return await httpPUTRequest(
    `${
      MANAGE_PROFILE_API.COMPANIES
    }/${getCompanyIdFromSession()}/users/${userGUID}`,
    replaceEmptyValuesWithNull(userInfo),
  );
};
