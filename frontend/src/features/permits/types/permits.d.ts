import { CompanyProfile } from "../../manageProfile/apiManager/manageProfileAPI";
import { PowerUnit, Trailer } from "../../manageVehicles/types/managevehicles";

interface TermOversizePermitDetails {
  startDate: string;
  endDate: string;
  permitDuration: number; //days
  commodities: string[];
}

export interface TermOversizePermit {
  contactDetails: CompanyProfile;
  permitDetails: TermOversizePermitDetails;
  vehicleDetails: PowerUnit | Trailer;
}
