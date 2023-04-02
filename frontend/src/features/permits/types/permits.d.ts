import { CompanyProfile } from "../../manageProfile/apiManager/manageProfileAPI";
import { PowerUnit, Trailer } from "../../manageVehicles/types/managevehicles";

/**
 * A base permit type. This is an incomplete object and meant to be extended for use.
 */
interface Permit {
  applicationId: number;
  dateCreated: Dayjs;
  lastUpdated: Dayjs;
}

interface TermOversizePermitDetails {
  startDate: Dayjs;
  endDate: string;
  permitDuration: number; //days
  commodities: string[];
}

export interface TermOversizePermit extends Permit {
  contactDetails?: CompanyProfile;
  permitDetails: TermOversizePermitDetails;
  vehicleDetails?: PowerUnit | Trailer;
  selectedVehicle?: string;
  vehicleType?: string;
}
