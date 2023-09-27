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
import { 
  PowerUnit, 
  Trailer, 
  VehicleType, 
} from "../../../../../manageVehicles/types/managevehicles.d";

import { 
  Commodities,
  VehicleDetails as VehicleDetailsType, 
} from "../../../../types/application.d";

interface PermitFormProps {
  feature: string;
  onLeave?: () => void;
  onSave?: () => Promise<void>;
  onCancel?: () => void;
  onContinue: () => Promise<void>;
  isAmendAction: boolean;
  permitType: PermitType;
  applicationNumber?: string;
  permitNumber?: string;
  createdDateTime?: Dayjs;
  updatedDateTime?: Dayjs;
  permitStartDate: Dayjs;
  permitDuration: number;
  permitCommodities: Commodities[];
  vehicleDetails?: VehicleDetailsType;
  vehicleOptions: (PowerUnit | Trailer)[];
  powerUnitTypes: VehicleType[];
  trailerTypes: VehicleType[];
  children?: React.ReactNode;
  companyInfo?: CompanyProfile;
}

export const PermitForm = (props: PermitFormProps) => {
  return (
    <Box className="permit-form layout-box">
      <Box className="permit-form__form">
        <ApplicationDetails
          permitType={props.permitType}
          infoNumber={props.isAmendAction ? props.permitNumber : props.applicationNumber}
          infoNumberType={props.isAmendAction ? "permit" : "application"}
          createdDateTime={props.createdDateTime}
          updatedDateTime={props.updatedDateTime}
          companyInfo={props.companyInfo}
        />
        <ContactDetails feature={props.feature} />
        <PermitDetails
          feature={props.feature}
          defaultStartDate={props.permitStartDate}
          defaultDuration={props.permitDuration}
          commodities={props.permitCommodities}
          applicationNumber={props.applicationNumber}
        />
        <VehicleDetails
          feature={props.feature}
          vehicleData={props.vehicleDetails}
          vehicleOptions={props.vehicleOptions}
          powerUnitTypes={props.powerUnitTypes}
          trailerTypes={props.trailerTypes}
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
