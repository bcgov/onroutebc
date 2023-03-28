import { CompanyProfile } from "../features/manageProfile/apiManager/manageProfileAPI";
import {
  PowerUnit,
  Trailer,
} from "../features/manageVehicles/types/managevehicles";

export interface ApiErrorResponse {
  status: number;
  errorMessage: string; // array?
}

export type ORBC_FormTypes = CompanyProfile | PowerUnit | Trailer;
