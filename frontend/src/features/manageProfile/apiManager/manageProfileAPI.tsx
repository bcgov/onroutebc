import { ApiErrorResponse } from "../../../types/common";
import { MANAGE_PROFILE_API } from "./endpoints/endpoints";

interface Address {
  addressId: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  provinceCode: string;
  countryCode: string;
  postalCode: string;
}

interface Contact {
  contactId: number;
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

interface TestResponse {
  status: number;
}

const TEST_COMPANY_GUID = "2245D2BF64CD4B00B5F511E598BB2555";

export const getCompanyInfo = async (
  companyGUID: string
): Promise<CompanyProfile> => {
  //return TEST_DATA;
  const url = new URL(MANAGE_PROFILE_API.COMPANY_INFO);

  try {
    //const response = await fetch(`${url.href}/${companyGUID}`);
    const response = await fetch(`${url.href}/${TEST_COMPANY_GUID}`);
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

export const updateCompanyInfo = async ({
  companyGUID,
  companyInfo,
}: {
  companyGUID: string;
  companyInfo: CompanyProfile;
}): Promise<Response> => {
  //return fetch(`${MANAGE_PROFILE_API.COMPANY_INFO}/${companyGUID}`, {
  return fetch(`${MANAGE_PROFILE_API.COMPANY_INFO}/${TEST_COMPANY_GUID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(companyInfo),
  });
};
