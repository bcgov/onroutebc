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
  fax?: string;
  city: string;
  provinceCode: string;
  countryCode: string;
}

export interface CompanyProfile {
  companyId: number;
  companyGUID: string;
  clientNumber: string;
  legalName: string;
  mailingAddress: Address;
  email: string;
  phone: string;
  extension?: string;
  fax?: string;
  primaryContact: Contact;
}

export interface UserInformation extends Contact {
  userAuthGroup: string;
  userGUID: string;
  userName: string;
  statusCode: string;
}

export interface CompanyAndUserRequest {
  companyId: number;
  companyGUID: string;
  legalName: string;
  alternateName?: string; // Doing Business As field
  mailingAddress: Address;
  email: string;
  phone: string;
  extension?: string;
  fax?: string;
  primaryContact: Contact;
  adminUser: Contact;
}

/**
 * The tabs on the user profile management page.
 */
export enum BCEID_PROFILE_TABS {
  COMPANY_INFORMATION = 0,
  MY_INFORMATION = 1,
  USER_MANAGEMENT_ORGADMIN = 2,
  PAYMENT_INFORMATION_CVCLIENT = 2,
  PAYMENT_INFORMATION_ORGADMIN = 3,
}
