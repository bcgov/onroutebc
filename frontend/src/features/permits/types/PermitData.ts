import { Dayjs } from "dayjs";

import { Nullable } from "../../../common/types/common";
import { PermitContactDetails } from "./PermitContactDetails";
import { PermitVehicleDetails } from "./PermitVehicleDetails";
import { PermitMailingAddress } from "./PermitMailingAddress";
import { PermitCondition } from "./PermitCondition";
import { PermittedCommodity } from "./PermittedCommodity";
import { PermitVehicleConfiguration } from "./PermitVehicleConfiguration";
import { PermittedRoute } from "./PermittedRoute";
import { PermitLOA } from "./PermitLOA";
import { ThirdPartyLiability } from "./ThirdPartyLiability";

export interface PermitData {
  startDate: Dayjs;
  permitDuration: number; // days
  expiryDate: Dayjs;
  contactDetails: PermitContactDetails;
  vehicleDetails: PermitVehicleDetails;
  commodities: PermitCondition[];
  mailingAddress: PermitMailingAddress;
  feeSummary?: Nullable<string>;
  companyName?: Nullable<string>;
  doingBusinessAs?: Nullable<string>;
  clientNumber?: Nullable<string>;
  loas?: Nullable<PermitLOA[]>;
  permittedCommodity?: Nullable<PermittedCommodity>;
  vehicleConfiguration?: Nullable<PermitVehicleConfiguration>;
  permittedRoute?: Nullable<PermittedRoute>;
  applicationNotes?: Nullable<string>;
  thirdPartyLiability?: Nullable<ThirdPartyLiability>;
  conditionalLicensingFee?: Nullable<string>;
}
