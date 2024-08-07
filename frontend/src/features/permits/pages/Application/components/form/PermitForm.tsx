import { Box } from "@mui/material";
import { Dayjs } from "dayjs";

import "./PermitForm.scss";
import { FormActions } from "./FormActions";
import { ApplicationDetails } from "../../../../components/form/ApplicationDetails";
import { ContactDetails } from "../../../../components/form/ContactDetails";
import { PermitDetails } from "./PermitDetails";
import { VehicleDetails } from "./VehicleDetails/VehicleDetails";
import { CompanyProfile } from "../../../../../manageProfile/types/manageProfile.d";
import { PermitType } from "../../../../types/PermitType";
import { Nullable } from "../../../../../../common/types/common";
import { PermitVehicleDetails } from "../../../../types/PermitVehicleDetails";
import { PermitCommodity } from "../../../../types/PermitCommodity";
import { PastStartDateStatus } from "../../../../../../common/components/form/subFormComponents/CustomDatePicker";
import {
  PowerUnit,
  Trailer,
  VehicleSubType,
} from "../../../../../manageVehicles/types/Vehicle";

import {
  getIneligiblePowerUnitSubtypes,
  getIneligibleTrailerSubtypes,
} from "../../../../helpers/removeIneligibleVehicles";

interface PermitFormProps {
  feature: string;
  onLeave?: () => void;
  onSave?: () => Promise<void>;
  onCancel?: () => void;
  onContinue: () => Promise<void>;
  isAmendAction: boolean;
  permitType: PermitType;
  applicationNumber?: Nullable<string>;
  permitNumber?: Nullable<string>;
  createdDateTime?: Nullable<Dayjs>;
  updatedDateTime?: Nullable<Dayjs>;
  permitStartDate: Dayjs;
  permitDuration: number;
  permitCommodities: PermitCommodity[];
  vehicleDetails: PermitVehicleDetails;
  vehicleOptions: (PowerUnit | Trailer)[];
  powerUnitSubTypes: VehicleSubType[];
  trailerSubTypes: VehicleSubType[];
  children?: React.ReactNode;
  companyInfo?: Nullable<CompanyProfile>;
  durationOptions: {
    value: number;
    label: string;
  }[];
  doingBusinessAs?: Nullable<string>;
  pastStartDateStatus: PastStartDateStatus;
}

export const PermitForm = (props: PermitFormProps) => {
  return (
    <Box className="permit-form layout-box">
      <Box className="permit-form__form">
        <ApplicationDetails
          permitType={props.permitType}
          infoNumber={
            props.isAmendAction ? props.permitNumber : props.applicationNumber
          }
          infoNumberType={props.isAmendAction ? "permit" : "application"}
          createdDateTime={props.createdDateTime}
          updatedDateTime={props.updatedDateTime}
          companyInfo={props.companyInfo}
          isAmendAction={props.isAmendAction}
          doingBusinessAs={props.doingBusinessAs}
        />

        <ContactDetails feature={props.feature} />

        <PermitDetails
          feature={props.feature}
          defaultStartDate={props.permitStartDate}
          defaultDuration={props.permitDuration}
          commoditiesInPermit={props.permitCommodities}
          applicationNumber={props.applicationNumber}
          durationOptions={props.durationOptions}
          disableStartDate={props.isAmendAction}
          permitType={props.permitType}
          pastStartDateStatus={props.pastStartDateStatus}
        />
        
        <VehicleDetails
          feature={props.feature}
          vehicleData={props.vehicleDetails}
          vehicleOptions={props.vehicleOptions}
          powerUnitSubTypes={props.powerUnitSubTypes}
          trailerSubTypes={props.trailerSubTypes}
          ineligiblePowerUnitSubtypes={getIneligiblePowerUnitSubtypes(props.permitType)}
          ineligibleTrailerSubtypes={getIneligibleTrailerSubtypes(props.permitType)}
        />
        {props.children}
      </Box>

      <FormActions
        onLeave={props.onLeave}
        onSave={props.onSave}
        onCancel={props.onCancel}
        onContinue={props.onContinue}
      />
    </Box>
  );
};
