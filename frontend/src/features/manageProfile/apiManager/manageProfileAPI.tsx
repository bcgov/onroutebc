import {
  httpGETRequest,
  httpGETRequestPromise,
  httpPOSTRequest,
  httpPUTRequest,
} from "../../../common/apiManager/httpRequestHandler";
import { ApiErrorResponse } from "../../../types/common";
import { MANAGE_PROFILE_API } from "./endpoints/endpoints";

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

// I have hardcoded the companyGUID because for this sprint we have assumed
// that the user has logged in with BCeID and has already completed the
// Wizard to setup their initial company profile
//let TEST_COMPANY_GUID = "06D0D93CE18A43948979F255C7046B72";
//let TEST_COMPANY_GUID = "C16A95599A264242A850BDDC21B739F4"; // Harry Ewing User
const TEST_COMPANY_ID = "1";

/* eslint-disable @typescript-eslint/no-unused-vars */
export const getCompanyInfo = async (
  companyGUID: string
): Promise<CompanyProfile> => {
  //return TEST_DATA;
  const url = new URL(MANAGE_PROFILE_API.COMPANY_INFO);

  try {
    const response = await httpGETRequest(
      new URL(`${url.href}/${TEST_COMPANY_ID}`)
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
  companyGUID,
  companyInfo,
}: {
  companyGUID: string;
  companyInfo: CompanyProfile;
}): Promise<Response> => {
  console.log("companyInfo", companyInfo);
  // If the mailing address is the same as the company address, then send an undefined mailing address
  // The backend API will set the mailing address ID to match the company address ID
  if (companyInfo.mailingAddressSameAsCompanyAddress) {
    companyInfo.mailingAddress = undefined;
  }

  return httpPUTRequest(
    `${MANAGE_PROFILE_API.COMPANY_INFO}/${TEST_COMPANY_ID}`,
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
    `${MANAGE_PROFILE_API.COMPANY_INFO}`,
    onRouteBCProfileRequestObject
  );
};

/**
 *
 * @param param0
 * @returns
 */
export const addUserInfo = async ({
  companyGUID,
  userInfo,
}: {
  companyGUID: string;
  userInfo: UserInformation;
}): Promise<Response> => {
  return httpPOSTRequest(
    `${MANAGE_PROFILE_API.COMPANY_INFO}/${companyGUID}`,
    userInfo
  );
};

/**
 * Retrieve the company and user details post login.
 */
export const getUserContext = (): Promise<Response> => {
  return httpGETRequestPromise(`${MANAGE_PROFILE_API}/user-context`);
};
