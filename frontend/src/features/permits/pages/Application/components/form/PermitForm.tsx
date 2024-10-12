import { Box } from "@mui/material";

import "./PermitForm.scss";
import { FormActions } from "./FormActions";
import { ApplicationDetails } from "../../../../components/form/ApplicationDetails";
import { ContactDetails } from "../../../../components/form/ContactDetails";
import { PermitDetails } from "./PermitDetails";
import { VehicleDetails } from "./VehicleDetails/VehicleDetails";
import { PermitLOA } from "./PermitLOA";
import { LOADetail } from "../../../../../settings/types/SpecialAuthorization";
import { isVehicleSubtypeLCV } from "../../../../../manageVehicles/helpers/vehicleSubtypes";
import { getStartOfDate } from "../../../../../../common/helpers/formatDate";
import { useApplicationFormContext } from "../../../../hooks/useApplicationFormContext";
import { AmendReason } from "../../../Amend/components/form/AmendReason";
import { AmendRevisionHistory } from "../../../Amend/components/form/AmendRevisionHistory";

export const PermitForm = () => {
  const {
    formData,
    availableDurationOptions,
    powerUnitSubtypes,
    trailerSubtypes,
    isLcvDesignated,
    ineligiblePowerUnitSubtypes,
    ineligibleTrailerSubtypes,
    filteredVehicleOptions,
    feature,
    companyInfo,
    isAmendAction,
    createdDateTime,
    updatedDateTime,
    pastStartDateStatus,
    companyLOAs,
    revisionHistory,
    onLeave,
    onSave,
    onCancel,
    onContinue,
    onSetConditions,
    onToggleSaveVehicle,
    onSetVehicle,
    onClearVehicle,
    onUpdateLOAs,
  } = useApplicationFormContext();

  const permitType = formData.permitType;
  const applicationNumber = formData.applicationNumber;
  const permitNumber = formData.permitNumber;
  const startDate = getStartOfDate(formData.permitData.startDate);
  const expiryDate = formData.permitData.expiryDate;
  const permitConditions = formData.permitData.commodities;
  const vehicleFormData = formData.permitData.vehicleDetails;
  const currentSelectedLOAs = formData.permitData.loas as LOADetail[];

  return (
    <Box className="permit-form layout-box">
      <Box className="permit-form__form">
        <ApplicationDetails
          permitType={permitType}
          infoNumber={
            isAmendAction ? permitNumber : applicationNumber
          }
          infoNumberType={isAmendAction ? "permit" : "application"}
          createdDateTime={createdDateTime}
          updatedDateTime={updatedDateTime}
          companyInfo={companyInfo}
          isAmendAction={isAmendAction}
          doingBusinessAs={companyInfo?.alternateName}
        />

        <ContactDetails feature={feature} />

        <PermitLOA
          permitType={permitType}
          startDate={startDate}
          selectedLOAs={currentSelectedLOAs}
          companyLOAs={companyLOAs}
          onUpdateLOAs={onUpdateLOAs}
        />

        <PermitDetails
          feature={feature}
          expiryDate={expiryDate}
          conditionsInPermit={permitConditions}
          durationOptions={availableDurationOptions}
          disableStartDate={isAmendAction}
          permitType={permitType}
          pastStartDateStatus={pastStartDateStatus}
          includeLcvCondition={
            isLcvDesignated
            && isVehicleSubtypeLCV(vehicleFormData.vehicleSubType)
          }
          onSetConditions={onSetConditions}
        />
        
        <VehicleDetails
          feature={feature}
          vehicleFormData={vehicleFormData}
          vehicleOptions={filteredVehicleOptions}
          powerUnitSubtypes={powerUnitSubtypes}
          trailerSubtypes={trailerSubtypes}
          ineligiblePowerUnitSubtypes={ineligiblePowerUnitSubtypes}
          ineligibleTrailerSubtypes={ineligibleTrailerSubtypes}
          selectedLOAs={currentSelectedLOAs}
          onSetSaveVehicle={onToggleSaveVehicle}
          onSetVehicle={onSetVehicle}
          onClearVehicle={onClearVehicle}
        />

        {isAmendAction ? (
          <>
            <AmendRevisionHistory revisionHistory={revisionHistory} />
            <AmendReason feature={feature} />
          </>
        ) : null}
      </Box>

      <FormActions
        onLeave={onLeave}
        onSave={onSave}
        onCancel={onCancel}
        onContinue={onContinue}
      />
    </Box>
  );
};
