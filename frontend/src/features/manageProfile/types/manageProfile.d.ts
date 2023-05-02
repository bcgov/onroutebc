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
  companyId: string;
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
  fax?: string;
  userAuthGroup: string;
}

export interface CompanyAndUserRequest {
  companyId: string;
  companyGUID: string;
  legalName: string;
  mailingAddress: Address;
  email: string;
  phone: string;
  extension?: string;
  fax?: string;
  primaryContact: Contact;
  adminUser: UserInformation;
}
