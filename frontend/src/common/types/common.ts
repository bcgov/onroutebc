import { SearchFields } from "../../features/idir/search/types/types";
import { Application } from "../../features/permits/types/application";
import { PermitContactDetails } from "../../features/permits/types/PermitContactDetails";
import {
  CreateCompanyRequest,
  CompanyProfile,
  UserInfoRequest,
  VerifyClientRequest,
  BCeIDAddUserRequest,
} from "../../features/manageProfile/types/manageProfile";

import {
  PowerUnit,
  Trailer,
} from "../../features/manageVehicles/types/Vehicle";
import { LOAFormData } from "../../features/settings/types/LOAFormData";
import { VoidPermitFormData } from "../../features/permits/pages/Void/types/VoidPermit";

export interface ApiErrorResponse {
  status: number;
  errorMessage: string; // array?
}

/**
 * The names of onRouteBC forms, used in classNames and determining which fields to show in reusable/shared forms
 */
export const ORBC_FORM_FEATURES = {
  ADD_USER: "add-user",
  AMEND_PERMIT: "amend-permit",
  APPLICATION: "application",
  CLIENT_SEARCH: "client-search",
  CLOSE_CREDIT_ACCOUNT: "close-credit-account",
  COMPANY_INFORMATION_WIZARD: "company-information-wizard",
  COMPANY_PROFILE: "company-profile",
  HOLD_CREDIT_ACCOUNT: "hold-credit-account",
  LOA: "loa",
  MY_INFORMATION: "my-information",
  MY_INFORMATION_WIZARD: "my-information-wizard",
  PERMIT_RESEND: "permit-resend",
  POWER_UNIT: "power-unit",
  REJECT_APPLICATION: "reject-application",
  REVOKE_PERMIT: "revoke-permit",
  SUSPEND_ACCOUNT: "suspend-account",
  TEST_FEATURE: "test-feature",
  TRAILER: "trailer",
  USER_INFORMATION: "user-information",
  USER_INFORMATION_WIZARD: "user-information-wizard",
  VERIFY_MIGRATED_CLIENT: "verify-migrated-client",
  VOID_PERMIT: "void-permit",
} as const;

export type ORBCFormFeatureType =
  (typeof ORBC_FORM_FEATURES)[keyof typeof ORBC_FORM_FEATURES];

/**
 * The types of onRouteBC forms that are supported by the custom form components
 */
export type ORBC_FormTypes =
  | CompanyProfile
  | PowerUnit
  | Trailer
  | Application
  | UserInfoRequest
  | CreateCompanyRequest
  | BCeIDAddUserRequest
  | SearchFields
  | VerifyClientRequest
  | PermitContactDetails
  | LOAFormData
  | VoidPermitFormData;

/**
 * The options for pagination.
 */
export interface PaginationOptions {
  /**
   * The page number to fetch.
   */
  page: number;
  /**
   * The number of items in the current page.
   * Max. value is 25.
   */
  take: number;
}

/**
 * The sort directions.
 */
export const SORT_DIRECTIONS = {
  ASCENDING: "ASC",
  DESCENDING: "DESC",
} as const;

export type SortDirectionsType =
  (typeof SORT_DIRECTIONS)[keyof typeof SORT_DIRECTIONS];

/**
 * The config for sorting data.
 */
export interface SortingConfig {
  /**
   * The field to order by.
   */
  column: string;
  /**
   * Boolean indicating if the sort is in descending order.
   * If not given a value, defaulted to false.
   */
  descending?: boolean;
}

/**
 * Additional data filters that could be used for
 * filtering data further.
 */
export interface DataFilterOptions {
  /**
   * The search value entered by the user.
   */
  searchString?: string;
  /**
   * The column to which the searchString will be applied.
   */
  // TODO create a type for the searchColumn which provides "applicationNumber" & "plate" and ensure that a default value is passed where necessary
  searchColumn?: string;
  /**
   * The sorting configuration selected by the user.
   */
  orderBy?: Array<SortingConfig>;
}

/**
 * The options for pagination and filtering data.
 */
export interface PaginationAndFilters
  extends PaginationOptions,
    DataFilterOptions {}

/**
 * The metadata containing info about a page in the paginated response.
 */
export interface PageMetadataInResponse extends PaginationOptions {
  /**
   * The total items matching the query in the database.
   */
  totalItems: number;
  /**
   * The total number of pages.
   */
  pageCount: number;
  /**
   * Is there a previous page?
   */
  hasPreviousPage: boolean;
  /**
   * Is there a next page?
   */
  hasNextPage: boolean;
}

/**
 * A generic paginated response structure for all the paginated responses from APIs.
 */
export interface PaginatedResponse<T> {
  /**
   * An array of items containing the response T.
   */
  items: T[];
  /**
   * Metadata about a page.
   */
  meta: PageMetadataInResponse;
}

export type Optional<T> = T | undefined;
export type RequiredOrNull<T> = T | null;
export type Nullable<T> = Optional<RequiredOrNull<T>>;
export type NullableFields<T> = {
  [P in keyof T]?: Nullable<T[P]>;
};

export const isNull = <T>(val?: Nullable<T>) => {
  return !val && typeof val !== "undefined" && val == null;
};

export const isUndefined = <T>(val?: Nullable<T>) => {
  return typeof val === "undefined";
};
