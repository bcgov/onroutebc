import { Box } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

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
import { LCV_CONDITION } from "../../../../constants/constants";
import { sortConditions } from "../../../../helpers/conditions";
import { getStartOfDate } from "../../../../../../common/helpers/formatDate";
import { getExpiryDate } from "../../../../helpers/permitState";
import { calculateFeeByDuration } from "../../../../helpers/feeSummary";
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
  isNoFeePermitType: boolean;
}

export const PermitForm = (props: PermitFormProps) => {
  const { watch, setValue } = useFormContext();

  const permitType = watch("permitType");
  const applicationNumber = watch("applicationNumber");
  const permitStartDate = watch("permitData.startDate");
  const startDate = getStartOfDate(permitStartDate);
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

  const handleSetExpiryDate = (expiry: Dayjs) => {
    setValue("permitData.expiryDate", dayjs(expiry));
  };

  const handleSetFee = (fee: string) => {
    setValue("permitData.feeSummary", fee);
  };

  const isLcvDesignated = props.isLcvDesignated;
  const ineligiblePowerUnitSubtypes = getIneligiblePowerUnitSubtypes(permitType)
    .filter(subtype => !isLcvDesignated || !isVehicleSubtypeLCV(subtype.typeCode));

  // Permit expiry date === Permit start date + Permit duration - 1
  const expiryDate = getExpiryDate(startDate, permitDuration);
  useEffect(() => {
    handleSetExpiryDate(expiryDate);
  }, [expiryDate]);
  
  const isNoFeePermitType = props.isNoFeePermitType;
  const isAmendAction = props.isAmendAction;

  // Update fee summary whenever duration, permit type, or no-fee permit type designation changes
  useEffect(() => {
    if (isNoFeePermitType) {
      // If no-fee permit type is designated, always set fee to $0
      handleSetFee("0");
    } else if (!isAmendAction) {
      // If no-fee is disabled, and creating/editing application, then set fee to normal calculation
      handleSetFee(`${calculateFeeByDuration(permitType, permitDuration)}`);
    }
    // Otherwise, it will be an amendment, and when the no-fee is disabled, keep the fee the same as before
    // If it was $0 before, it makes sense to keep it at $0,
    // and similarly for calculated fee ($30 before would still be $30 now)
  }, [permitDuration, permitType, isNoFeePermitType, isAmendAction]);

  const vehicleSubtype = vehicleFormData.vehicleSubType;
  useEffect(() => {
    if (
      !isVehicleSubtypeLCV(vehicleSubtype)
      && permitConditions.some(({ condition }: PermitCondition) => condition === LCV_CONDITION.condition)
    ) {
      // If vehicle subtype in the form isn't LCV but conditions have LCV,
      // then remove that LCV condition from the form
    handleSetConditions(permitConditions.filter(
        ({ condition }: PermitCondition) => condition !== LCV_CONDITION.condition,
      ));
    } else if (
      isVehicleSubtypeLCV(vehicleSubtype)
      && !permitConditions.some(({ condition }: PermitCondition) => condition === LCV_CONDITION.condition)
    ) {
      // If vehicle subtype in the form is LCV but conditions don't have LCV,
      // then add that LCV condition into the form
      handleSetConditions(sortConditions([...permitConditions, LCV_CONDITION]));
    }
  }, [vehicleSubtype, permitConditions]);
  
  return (
    <Box className="permit-form layout-box">
      <Box className="permit-form__form">
        <ApplicationDetails
          permitType={permitType}
          infoNumber={
            isAmendAction ? props.permitNumber : applicationNumber
          }
          infoNumberType={isAmendAction ? "permit" : "application"}
          createdDateTime={props.createdDateTime}
          updatedDateTime={props.updatedDateTime}
          companyInfo={props.companyInfo}
          isAmendAction={isAmendAction}
          doingBusinessAs={props.doingBusinessAs}
        />

        <ContactDetails feature={props.feature} />

        <PermitDetails
          feature={props.feature}
          expiryDate={expiryDate}
          conditionsInPermit={permitConditions}
          durationOptions={props.durationOptions}
          disableStartDate={isAmendAction}
          permitType={permitType}
          pastStartDateStatus={props.pastStartDateStatus}
          includeLcvCondition={isLcvDesignated && isVehicleSubtypeLCV(vehicleFormData.vehicleSubType)}
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
