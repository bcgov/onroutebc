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

/**
 * Partial Information about a company.
 */
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

/**
 * The information a migrated client will have.
 */
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
export const ROLES = {
  PUBLIC_AGENT: "ORBC-PUBLIC-AGENT",
  PUBLIC_ORG_ADMIN: "ORBC-PUBLIC-ORG-ADMIN",
  PUBLIC_USER_ADMIN: "ORBC-PUBLIC-USER-ADMIN",
  PUBLIC_VEHICLE_ADMIN: "ORBC-PUBLIC-VEHICLE-ADMIN",
  PUBLIC_VERIFIED: "ORBC-PUBLIC-VERIFIED",
  READ_BILLING: "ORBC-READ-BILLING",
  READ_ORG: "ORBC-READ-ORG",
  READ_PAYMENT: "ORBC-READ-PAYMENT",
  READ_PERMIT: "ORBC-READ-PERMIT",
  READ_SELF: "ORBC-READ-SELF",
  READ_USER: "ORBC-READ-USER",
  READ_VEHICLE: "ORBC-READ-VEHICLE",
  STAFF: "ORBC-STAFF",
  STAFF_ADMIN: "ORBC-STAFF-ADMIN",
  STAFF_PERMIT_ISSUER: "ORBC-STAFF-PERMIT-ISSUER",
  WRITE_BILLING: "ORBC-WRITE-BILLING",
  WRITE_ORG: "ORBC-WRITE-ORG",
  WRITE_PAYMENT: "ORBC-WRITE-PAYMENT",
  WRITE_PERMIT: "ORBC-WRITE-PERMIT",
  VOID_PERMIT: "ORBC-VOID-PERMIT",
  WRITE_SELF: "ORBC-WRITE-SELF",
  WRITE_USER: "ORBC-WRITE-USER",
  WRITE_VEHICLE: "ORBC-WRITE-VEHICLE",
  WRITE_VEHICLE_TYPES: "ORBC-WRITE-VEHICLE-TYPES",
  READ_VEHICLE_TYPES: "ORBC-READ-VEHICLE-TYPES",
  READ_DOCUMENT: "ORBC-READ-DOCUMENT",
  WRITE_DOCUMENT: "ORBC-WRITE-DOCUMENT",
  DELETE_DOCUMENT: "ORBC-DELETE-DOCUMENT",
  GENERATE_DOCUMENT: "ORBC-GENERATE-DOCUMENT",
  GENERATE_REPORT: "ORBC-GENERATE-REPORT",
  GENERATE_TRANSACTION_REPORT_ALL: "ORBC-GENERATE-TRANSACTION-REPORT-ALL",
  GENERATE_TRANSACTION_REPORT_SELF: "ORBC-GENERATE-TRANSACTION-REPORT-SELF",
  GENERATE_TRANSACTION_REPORT: "ORBC-GENERATE-TRANSACTION-REPORT",
} as const;

/**
 * The enum type for user roles.
 */
export type UserRolesType =
  (typeof ROLES)[keyof typeof ROLES];

/**
 * The user auth group enum key-value pairs.
 */
export const USER_AUTH_GROUP = {
  ANONYMOUS: "ANONYMOUS",
  CV_CLIENT: "CVCLIENT",
  COMPANY_ADMINISTRATOR: "ORGADMIN",
  PPC_CLERK: "PPCCLERK",
  SYSTEM_ADMINISTRATOR: "SYSADMIN",
  ENFORCEMENT_OFFICER: "EOFFICER",
} as const;

/**
 * The enum type for user auth group.
 */
export type UserAuthGroupType =
  (typeof USER_AUTH_GROUP)[keyof typeof USER_AUTH_GROUP];

/**
 * The user auth group enum key-value pairs.
 */
export const BCeID_USER_AUTH_GROUP = {
  CV_CLIENT: "CVCLIENT",
  COMPANY_ADMINISTRATOR: "ORGADMIN",
} as const;

/**
 * The enum type for user auth group.
 */
export type BCeIDUserAuthGroupType =
  (typeof BCeID_USER_AUTH_GROUP)[keyof typeof BCeID_USER_AUTH_GROUP];

/**
 * The user auth group enum associated with IDIR users.
 */
export const IDIR_USER_AUTH_GROUP = {
  PPC_CLERK: "PPCCLERK",
  SYSTEM_ADMINISTRATOR: "SYSADMIN",
  ENFORCEMENT_OFFICER: "EOFFICER",
} as const;

/**
 * The enum type for user auth group.
 */
export type IDIRUserAuthGroupType =
  (typeof IDIR_USER_AUTH_GROUP)[keyof typeof IDIR_USER_AUTH_GROUP];

/**
 * User Context object type
 */
export interface IDIRUserContextType {
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
