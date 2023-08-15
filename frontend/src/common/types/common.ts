import {
  CompanyAndUserRequest,
  CompanyProfile,
  UserInformation,
} from "../../features/manageProfile/types/manageProfile";
import {
  PowerUnit,
  Trailer,
} from "../../features/manageVehicles/types/managevehicles";
import { Application } from "../../features/permits/types/application";

export interface ApiErrorResponse {
  status: number;
  errorMessage: string; // array?
}

export interface OrbcError {
  status: number;
  errorTypeId: string;
  errorOccuredTime: string;
  sessionId: string;
  userGuid: string;
  corelationId: string;
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
  | CompanyAndUserRequest;
