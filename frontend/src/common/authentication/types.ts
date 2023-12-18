import { Nullable } from "../types/common";

/**
 * Type for displaying snackbar (aka toast message) after an operation.
 */
export interface CompanyMetadataContextType {
  companyMetadata: CompanyMetadata;
  setCompanyMetadata: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Company Basic Info type
 */
export type CompanyMetadata = {
  companyId: number;
  clientNumber: string;
  legalName: string;
  companyGUID?: string;
  alternateName?: string;
};

export type ClientInformation = {
  migratedClientHash?: string;
  mailingAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    postalCode: string;
    provinceCode?: string;
    countryCode?: string;
  };
  email: string;
  phone: string;
  fax: string;
  extension: string;
};

export type MigratedClient = ClientInformation & CompanyMetadata;

/**
 * User Context object type
 */
export interface BCeIDUserContextType {
  associatedCompanies: CompanyMetadata[];
  pendingCompanies: CompanyMetadata[];
  migratedClient: MigratedClient;
  user?: {
    userAuthGroup?: string;
    statusCode?: string;
    userGUID?: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    phone1?: string;
    phone2?: string;
    fax?: string;
    email?: string;
    city?: string;
    provinceCode?: string;
    countryCode?: string;
    phone1Extension?: Nullable<string>;
    phone2Extension?: Nullable<string>;
  };
}

/**
 * The set of user roles.
 *
 * Cross verify with the roles enum in the backend for any modifications.
 */
export enum ROLES {
  PUBLIC_AGENT = "ORBC-PUBLIC-AGENT",
  PUBLIC_ORG_ADMIN = "ORBC-PUBLIC-ORG-ADMIN",
  PUBLIC_USER_ADMIN = "ORBC-PUBLIC-USER-ADMIN",
  PUBLIC_VEHICLE_ADMIN = "ORBC-PUBLIC-VEHICLE-ADMIN",
  PUBLIC_VERIFIED = "ORBC-PUBLIC-VERIFIED",
  READ_BILLING = "ORBC-READ-BILLING",
  READ_ORG = "ORBC-READ-ORG",
  READ_PERMIT = "ORBC-READ-PERMIT",
  READ_SELF = "ORBC-READ-SELF",
  READ_USER = "ORBC-READ-USER",
  READ_VEHICLE = "ORBC-READ-VEHICLE",
  STAFF = "ORBC-STAFF",
  STAFF_ADMIN = "ORBC-STAFF-ADMIN",
  STAFF_PERMIT_ISSUER = "ORBC-STAFF-PERMIT-ISSUER",
  WRITE_BILLING = "ORBC-WRITE-BILLING",
  WRITE_ORG = "ORBC-WRITE-ORG",
  WRITE_PERMIT = "ORBC-WRITE-PERMIT",
  WRITE_SELF = "ORBC-WRITE-SELF",
  WRITE_USER = "ORBC-WRITE-USER",
  WRITE_VEHICLE = "ORBC-WRITE-VEHICLE",
}

/**
 * User Context object type
 */
export interface IDIRUserContextType {
  associatedCompanies: [];
  pendingCompanies: [];
  user?: {
    userAuthGroup?: string;
    statusCode?: string;
    userGUID?: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}
