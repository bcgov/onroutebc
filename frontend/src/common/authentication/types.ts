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
export interface CompanyMetadata {
  companyId: string;
  clientNumber: string;
  legalName: string;
}

/**
 * User Context object type
 */
export interface UserContextType {
  associatedCompanies: CompanyMetadata[];
  pendingCompanies: CompanyMetadata[];
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
    phone1Extension?: string | null;
    phone2Extension?: string | null;
  };
}

/**
 * The set of user roles.
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
