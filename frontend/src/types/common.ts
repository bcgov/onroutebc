import { CompanyProfile } from "../features/manageProfile/apiManager/manageProfileAPI";
import {
  PowerUnit,
  Trailer,
} from "../features/manageVehicles/types/managevehicles";
import { TermOversizePermit } from "../features/permits/types/permits";

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
  | TermOversizePermit;
