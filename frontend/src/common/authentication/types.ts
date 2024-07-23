import { Contact } from "../../features/manageProfile/types/manageProfile";
import { Nullable } from "../types/common";
import { ALL_PERMISSION_KEYS } from "./PermissionMatrix";

/**
 * Company Metadata type
 */
export type CompanyMetadata = {
  companyId: number;
  clientNumber: string;
  legalName: string;
  companyGUID?: string;
  alternateName?: string;
  isSuspended?: boolean;
  email?: string;
};

/**
 * Partial Information about a company.
 */
export type PartialCompanyProfile = {
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
  fax?: Nullable<string>;
  extension?: Nullable<string>;
  primaryContact?: Nullable<Contact>;
};

/**
 * The information a verified client will have.
 */
export type VerifiedClient = PartialCompanyProfile & CompanyMetadata;

/**
 * User Context object type
 */
export type BCeIDUserContextType = {
  associatedCompanies: CompanyMetadata[];
  pendingCompanies: CompanyMetadata[];
  migratedClient: VerifiedClient;
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
};

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
  READ_SPECIAL_AUTH: "ORBC-READ-SPECIAL-AUTH",
  READ_NOFEE: "ORBC-READ-NOFEE",
  WRITE_NOFEE: "ORBC-WRITE-NOFEE",
  READ_LCV_FLAG: "ORBC-READ-LCV-FLAG",
  WRITE_LCV_FLAG: "ORBC-WRITE-LCV-FLAG",
  READ_LOA: "ORBC-READ-LOA",
  WRITE_LOA: "ORBC-WRITE-LOA",
  READ_SUSPEND: "ORBC-READ-SUSPEND",
  WRITE_SUSPEND: "ORBC-WRITE-SUSPEND",
  READ_CREDIT_ACCOUNT: "ORBC-READ-CREDIT-ACCOUNT",
  WRITE_CREDIT_ACCOUNT: "ORBC-WRITE-CREDIT-ACCOUNT",
} as const;

/**
 * The enum type for user roles.
 */
export type UserRolesType = (typeof ROLES)[keyof typeof ROLES];

/**
 * The user auth group enum key-value pairs.
 */
export const BCeID_USER_AUTH_GROUP = {
  PERMIT_APPLICANT: "PAPPLICANT",
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
  HQ_ADMINISTRATOR: "HQADMIN",
  FINANCE: "FINANCE",
  CTPO: "CTPO",
} as const;

/**
 * The enum type for user auth group.
 */
export type IDIRUserAuthGroupType =
  (typeof IDIR_USER_AUTH_GROUP)[keyof typeof IDIR_USER_AUTH_GROUP];

/**
 * The user auth group enum key-value pairs.
 */
export const USER_AUTH_GROUP = {
  ...IDIR_USER_AUTH_GROUP,
  ...BCeID_USER_AUTH_GROUP,
  ANONYMOUS: "ANONYMOUS",
} as const;

/**
 * The enum type for user auth group.
 */
export type UserAuthGroupType =
  (typeof USER_AUTH_GROUP)[keyof typeof USER_AUTH_GROUP];

/**
 * IDIR User Context object type
 */
export type IDIRUserContextType = {
  user?: {
    userAuthGroup?: IDIRUserAuthGroupType;
    statusCode?: string;
    userGUID?: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
};

export type PermissionConfigType = {
  /**
   * The auth groups that are disallowed from seeing the component.
   *
   * Given first preference if specified. If the user has one of
   * the specified auth groups, the component WILL NOT render.
   *
   * Example use-case: `ORBC_READ_PERMIT` is a role that's available to
   * the `FINANCE` users but they aren't allowed privileges to see
   * Applications in Progress.
   * In this instance, `disallowedAuthGroups = ['FINANCE']`.
   */
  disallowedAuthGroups?: readonly UserAuthGroupType[];
  /**
   * The idir auth groups that are allowed to see the component.
   *
   * If the user has one of the specified auth groups,
   * the component will render.
   */
  allowedIDIRAuthGroups?: readonly IDIRUserAuthGroupType[];

  /**
   * The bceid auth groups that are allowed to see the component.
   *
   * If the user has one of the specified auth groups,
   * the component will render.
   */
  allowedBCeIDAuthGroups?: readonly BCeIDUserAuthGroupType[];
  /**
   * The feature flag to check if the feature is enabled.
   */
  featureFlag?: string;
  /**
   * An additional function call whose boolean value will be accounted
   * for determining whether to render a component.
   * i.e., this function will play along with other specifications 
   * given in the other input props.
   * 
   * @param args Any arguments to be passed.
   * @returns A boolean.
   */
  additionalConditionToCall?: (...args: any) => boolean;
  /**
   * With only condition to check, all other configurations are skipped.
   * i.e., this function will be the only check to decide whether to render
   * a component.
   * 
   * Simply put, when provided, this will be the only check.
   * 
   * @param args Any arguments to be passed.
   * @returns A boolean.
   */
  onlyConditionToCheck?: (...args: any) => boolean;
  permissionKey?: ALL_PERMISSION_KEYS;
};
