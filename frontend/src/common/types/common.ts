import { SearchFields } from "../../features/idir/search/types/types";
import { BCeIDAddUserRequest } from "../../features/manageProfile/types/userManagement";
import { Application } from "../../features/permits/types/application";
import {
  CompanyAndUserRequest,
  CompanyProfile,
  UserInformation,
} from "../../features/manageProfile/types/manageProfile";

import {
  PowerUnit,
  Trailer,
} from "../../features/manageVehicles/types/managevehicles";

export interface ApiErrorResponse {
  status: number;
  errorMessage: string; // array?
}

/**
 * The types of onRouteBC forms that are supported by the custom form components
 */
export type ORBC_FormTypes =
  | CompanyProfile
  | PowerUnit
  | Trailer
  | Application
  | UserInformation
  | CompanyAndUserRequest
  | BCeIDAddUserRequest
  | SearchFields;

/**
 * The options for pagination.
 */
export type PaginationOptions = {
  /**
   * The page number to fetch.
   */
  page: number;
  /**
   * The number of items in the current page.
   */
  take: number;
};

/**
 * A generic paginated response structure for all the paginated responses from APIs.
 */
export type PaginatedResponse<T> = {
  /**
   * An array of items containing the response T.
   */
  items: T[];
  /**
   * Metadata about a page.
   */
  meta: PageMetadataInResponse;
};

/**
 * The metadata containing info about a page in the paginated response.
 */
export type PageMetadataInResponse = {
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
   * Is there a next page.
   */
  hasNextPage: boolean;
} & PaginationOptions;

export type Optional<T> = T | undefined;
export type RequiredOrNull<T> = T | null;
export type Nullable<T> = Optional<RequiredOrNull<T>>;
export type NullableFields<T> = {
  [P in keyof T]?: Nullable<T[P]>;
};
