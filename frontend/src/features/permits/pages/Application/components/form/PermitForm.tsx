import { Box } from "@mui/material";
import { Dayjs } from "dayjs";
import { useFormContext } from "react-hook-form";

import "./PermitForm.scss";
import { FormActions } from "./FormActions";
import { ApplicationDetails } from "../../../../components/form/ApplicationDetails";
import { ContactDetails } from "../../../../components/form/ContactDetails";
import { PermitDetails } from "./PermitDetails";
import { VehicleDetails } from "./VehicleDetails/VehicleDetails";
import { CompanyProfile } from "../../../../../manageProfile/types/manageProfile.d";
import { Nullable } from "../../../../../../common/types/common";
import { EMPTY_VEHICLE_DETAILS, PermitVehicleDetails } from "../../../../types/PermitVehicleDetails";
import { PastStartDateStatus } from "../../../../../../common/components/form/subFormComponents/CustomDatePicker";
import { isVehicleSubtypeLCV } from "../../../../../manageVehicles/helpers/vehicleSubtypes";
import { PermitCondition } from "../../../../types/PermitCondition";
import {
  PowerUnit,
  Trailer,
  VehicleSubType,
} from "../../../../../manageVehicles/types/Vehicle";

import {
  getIneligiblePowerUnitSubtypes,
  getIneligibleTrailerSubtypes,
} from "../../../../helpers/permitVehicles";

interface PermitFormProps {
  feature: string;
  onLeave?: () => void;
  onSave?: () => Promise<void>;
  onCancel?: () => void;
  onContinue: () => Promise<void>;
  isAmendAction: boolean;
  permitNumber?: Nullable<string>;
  createdDateTime?: Nullable<Dayjs>;
  updatedDateTime?: Nullable<Dayjs>;
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
  isLcvDesignated: boolean;
}

export const PermitForm = (props: PermitFormProps) => {
  const { watch, setValue } = useFormContext();

  const permitType = watch("permitType");
  const applicationNumber = watch("applicationNumber");
  const permitStartDate = watch("permitData.startDate");
  const permitDuration = watch("permitData.permitDuration");
  const permitConditions = watch("permitData.commodities");
  const vehicleFormData = watch("permitData.vehicleDetails");

  const handleSetConditions = (conditions: PermitCondition[]) => {
    setValue("permitData.commodities", [...conditions]);
  };

  const handleToggleSaveVehicle = (saveVehicle: boolean) => {
    setValue("permitData.vehicleDetails.saveVehicle", saveVehicle);
  };

  const handleSetVehicle = (vehicleDetails: PermitVehicleDetails) => {
    setValue("permitData.vehicleDetails", {
      ...vehicleDetails,
    });
  };

  const handleClearVehicle = (saveVehicle: boolean) => {
    setValue("permitData.vehicleDetails", {
      ...EMPTY_VEHICLE_DETAILS,
      saveVehicle,
    });
  };

  const ineligiblePowerUnitSubtypes = getIneligiblePowerUnitSubtypes(permitType)
    .filter(subtype => !props.isLcvDesignated || !isVehicleSubtypeLCV(subtype.typeCode));
  
  return (
    <Box className="permit-form layout-box">
      <Box className="permit-form__form">
        <ApplicationDetails
          permitType={permitType}
          infoNumber={
            props.isAmendAction ? props.permitNumber : applicationNumber
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
          defaultStartDate={permitStartDate}
          defaultDuration={permitDuration}
          conditionsInPermit={permitConditions}
          durationOptions={props.durationOptions}
          disableStartDate={props.isAmendAction}
          permitType={permitType}
          pastStartDateStatus={props.pastStartDateStatus}
          includeLcvCondition={props.isLcvDesignated && isVehicleSubtypeLCV(vehicleFormData.vehicleSubType)}
          onSetConditions={handleSetConditions}
        />
        
        <VehicleDetails
          feature={props.feature}
          vehicleFormData={vehicleFormData}
          vehicleOptions={props.vehicleOptions}
          powerUnitSubtypes={props.powerUnitSubTypes}
          trailerSubtypes={props.trailerSubTypes}
          ineligiblePowerUnitSubtypes={ineligiblePowerUnitSubtypes}
          ineligibleTrailerSubtypes={getIneligibleTrailerSubtypes(permitType)}
          onSetSaveVehicle={handleToggleSaveVehicle}
          onSetVehicle={handleSetVehicle}
          onClearVehicle={handleClearVehicle}
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
