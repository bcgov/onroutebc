import {
  CompanyAndUserRequest,
  CompanyProfile,
  UserInformation,
} from "../../features/manageProfile/types/manageProfile";
import { BCeIDAddUserRequest } from "../../features/manageProfile/types/userManagement";
import {
  PowerUnit,
  Trailer,
} from "../../features/manageVehicles/types/managevehicles";
import { Application } from "../../features/permits/types/application";
import { SearchFilter } from "./searchFilter";

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
  | SearchFilter;

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
  meta: PageMetadata;
};

/**
 * The metadata containing info about a page in the paginated response.
 */
export type PageMetadata = {
  currentPage: number;
  currentItemCount: number;
  itemsPerPage: number;
  totalPages?: number;
  totalItems?: number;
};
