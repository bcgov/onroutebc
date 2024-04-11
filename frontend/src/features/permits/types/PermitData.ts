import { Dayjs } from "dayjs";

import { Nullable } from "../../../common/types/common";
import { PermitContactDetails } from "./PermitContactDetails";
import { PermitVehicleDetails } from "./PermitVehicleDetails";
import { PermitMailingAddress } from "./PermitMailingAddress";
import { PermitCommodity } from "./PermitCommodity";

export interface PermitData {
  startDate: Dayjs;
  permitDuration: number; // days
  expiryDate: Dayjs;
  contactDetails: PermitContactDetails;
  vehicleDetails: PermitVehicleDetails;
  commodities: PermitCommodity[];
  mailingAddress: PermitMailingAddress;
  feeSummary?: Nullable<string>;
  companyName?: Nullable<string>;
  doingBusinessAs?: Nullable<string>;
  clientNumber?: Nullable<string>;
}
