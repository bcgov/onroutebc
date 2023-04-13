import {
  httpGETRequest,
  httpGETRequestPromise,
  httpPOSTRequest,
  httpPUTRequest,
  getCompanyIdFromSession,
} from "../../../common/apiManager/httpRequestHandler";
import { UserContextType } from "../../../common/authentication/types";
import { ApiErrorResponse } from "../../../types/common";
import { MANAGE_PROFILE_API, MANAGE_PROFILE_URL } from "./endpoints/endpoints";

interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  provinceCode: string;
  countryCode: string;
  postalCode: string;
}

interface Contact {
  firstName: string;
  lastName: string;
  phone1: string;
  phone1Extension?: string;
  phone2?: string;
  phone2Extension?: string;
  email: string;
  city: string;
  provinceCode: string;
  countryCode: string;
}

export interface CompanyProfile {
  companyId: string;
  companyGUID: string;
  clientNumber: string;
  legalName: string;
  companyAddress: Address;
  mailingAddressSameAsCompanyAddress: boolean;
  mailingAddress?: Address;
  email: string;
  phone: string;
  extension?: string;
  fax?: string;
  primaryContact: Contact;
}

export interface UserInformation extends Contact {
  fax?: string;
  userAuthGroup: string;
}

export interface CompanyAndUserRequest {
  companyId: string;
  companyGUID: string;
  legalName: string;
  companyAddress: Address;
  mailingAddressSameAsCompanyAddress: boolean;
  mailingAddress?: Address;
  email: string;
  phone: string;
  extension?: string;
  fax?: string;
  primaryContact: Contact;
  adminUser: UserInformation;
}

export const getCompanyInfo = async (): Promise<CompanyProfile> => {
  const url = new URL(MANAGE_PROFILE_API.COMPANIES);

  try {
    const response = await httpGETRequest(
      new URL(`${url.href}/${getCompanyIdFromSession()}`)
    );
    const data = await response.json();

    // Handle API errors created from the backend API
    if (!response.ok) {
      const err: ApiErrorResponse = data;
      return Promise.reject(err.errorMessage);
    }

    return data;
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Handle network errors
    // Error type has name and message
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    return Promise.reject(error.message);
  }
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
  return httpGETRequestPromise(`${MANAGE_PROFILE_URL}/users/user-context`).then(
    (response) => response.json()
  );
};
