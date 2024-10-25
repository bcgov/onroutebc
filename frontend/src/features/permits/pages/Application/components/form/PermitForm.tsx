import { Box } from "@mui/material";

import "./PermitForm.scss";
import { FormActions } from "./FormActions";
import { ApplicationDetails } from "../../../../components/form/ApplicationDetails";
import { ContactDetails } from "../../../../components/form/ContactDetails";
import { PermitDetails } from "./PermitDetails";
import { VehicleDetails } from "./VehicleDetails/VehicleDetails";
import { PermitLOASection } from "./PermitLOASection";
import { useApplicationFormContext } from "../../../../hooks/useApplicationFormContext";
import { AmendReason } from "../../../Amend/components/form/AmendReason";
import { AmendRevisionHistory } from "../../../Amend/components/form/AmendRevisionHistory";
import { CommodityDetailsSection } from "./CommodityDetailsSection";
import { ApplicationNotesSection } from "./ApplicationNotesSection";
import { TripDetailsSection } from "./TripDetailsSection/TripDetailsSection";
import { LoadedDimensionsSection } from "./LoadedDimensionsSection/LoadedDimensionsSection";

export const PermitForm = () => {
  const {
    permitType,
    applicationNumber,
    permitNumber,
    startDate,
    expiryDate,
    currentSelectedLOAs,
    vehicleFormData,
    allConditions,
    availableDurationOptions,
    filteredVehicleOptions,
    subtypeOptions,
    isSelectedLOAVehicle,
    feature,
    companyInfo,
    isAmendAction,
    createdDateTime,
    updatedDateTime,
    pastStartDateStatus,
    companyLOAs,
    revisionHistory,
    commodityOptions,
    highwaySequence,
    onLeave,
    onSave,
    onCancel,
    onContinue,
    onSetConditions,
    onToggleSaveVehicle,
    onSetVehicle,
    onClearVehicle,
    onUpdateLOAs,
    onUpdateHighwaySequence,
  } = useApplicationFormContext();

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

        <PermitLOASection
          permitType={permitType}
          startDate={startDate}
          selectedLOAs={currentSelectedLOAs}
          companyLOAs={companyLOAs}
          onUpdateLOAs={onUpdateLOAs}
        />

        <PermitDetails
          feature={feature}
          expiryDate={expiryDate}
          allConditions={allConditions}
          durationOptions={availableDurationOptions}
          disableStartDate={isAmendAction}
          pastStartDateStatus={pastStartDateStatus}
          onSetConditions={onSetConditions}
        />

        <CommodityDetailsSection
          feature={feature}
          permitType={permitType}
          commodityOptions={commodityOptions}
        />
        
        <VehicleDetails
          feature={feature}
          vehicleFormData={vehicleFormData}
          vehicleOptions={filteredVehicleOptions}
          subtypeOptions={subtypeOptions}
          isSelectedLOAVehicle={isSelectedLOAVehicle}
          onSetSaveVehicle={onToggleSaveVehicle}
          onSetVehicle={onSetVehicle}
          onClearVehicle={onClearVehicle}
        />

        <LoadedDimensionsSection
          permitType={permitType}
          feature={feature}
        />

        <TripDetailsSection
          feature={feature}
          permitType={permitType}
          highwaySequence={highwaySequence}
          onUpdateHighwaySequence={onUpdateHighwaySequence}
        />

        <ApplicationNotesSection
          feature={feature}
          permitType={permitType}
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
