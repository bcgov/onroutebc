import { Box } from "@mui/material";

import "./PermitForm.scss";
import { FormActions } from "./FormActions";
import { ApplicationDetails } from "../../../../components/form/ApplicationDetails";
import { ContactDetails } from "../../../../components/form/ContactDetails";
import { PermitDetails } from "./PermitDetails";
import { VehicleInformationSection } from "./VehicleInformationSection/VehicleInformationSection";
import { PermitLOASection } from "./PermitLOASection";
import { useApplicationFormContext } from "../../../../hooks/form/useApplicationFormContext";
import { AmendReason } from "../../../Amend/components/form/AmendReason";
import { AmendRevisionHistory } from "../../../Amend/components/form/AmendRevisionHistory";
import { CommodityDetailsSection } from "./CommodityDetailsSection/CommodityDetailsSection";
import { ApplicationNotesSection } from "./ApplicationNotesSection";
import { TripDetailsSection } from "./TripDetailsSection/TripDetailsSection";
import { LoadedDimensionsSection } from "./LoadedDimensionsSection/LoadedDimensionsSection";
import { ThirdPartyLiabilitySection } from "./ThirdPartyLiabilitySection";
import { ConditionalLicensingFeeSection } from "./ConditionalLicensingFeeSection/ConditionalLicensingFeeSection";
import { VehicleWeightSection } from "./VehicleWeightSection/VehicleWeightSection";
import { isVehicleSubtypeEmpty } from "../../../../../manageVehicles/helpers/vehicleSubtypes";
import { ReviewApplicationRejectionHistory } from "../review/ReviewApplicationRejectionHistory";
import { ErrorAltBcGovBanner } from "../../../../../../common/components/banners/ErrorAltBcGovBanner";
import { CustomActionLink } from "../../../../../../common/components/links/CustomActionLink";
import { useRef } from "react";

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
    rejectionHistory,
    commodityOptions,
    highwaySequence,
    tripOrigin,
    tripDestination,
    totalDistance,
    nextAllowedSubtypes,
    powerUnitSubtypeNamesMap,
    trailerSubtypeNamesMap,
    selectedVehicleConfigSubtypes,
    commodityType,
    vehicleConfiguration,
    thirdPartyLiability,
    conditionalLicensingFee,
    availableCLFs,
    enableLoadedGVW,
    enableNetWeight,
    minAllowedPastStartDate,
    maxAllowedFutureStartDate,
    maxNumDaysAllowedInFuture,
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
    onUpdateTripOrigin,
    onUpdateTripDestination,
    onUpdateTotalDistance,
    onUpdateVehicleConfigTrailers,
    onChangeCommodityType,
    onUpdateVehicleConfig,
    onUpdateThirdPartyLiability,
    onUpdateConditionalLicensingFee,
    onUpdateLoadedGVW,
    onUpdateNetWeight,
  } = useApplicationFormContext();

  const reviewApplicationRejectionHistoryRef = useRef<HTMLDivElement>(null);

  const scrollToReviewApplicationRejectionHistorySection = () =>
    reviewApplicationRejectionHistoryRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  return (
    <Box className="permit-form layout-box">
      <Box className="permit-form__form">
        {rejectionHistory.length > 0 && (
          <ErrorAltBcGovBanner
            className="permit-form__rejection-banner"
            msg={
              <div className="rejection-banner__message">
                <span>This application was rejected. </span>
                <CustomActionLink
                  className="rejection-banner__link"
                  onClick={scrollToReviewApplicationRejectionHistorySection}
                >
                  See the reason(s) for rejection.
                </CustomActionLink>
              </div>
            }
          />
        )}
        <ApplicationDetails
          permitType={permitType}
          infoNumber={isAmendAction ? permitNumber : applicationNumber}
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
          permitType={permitType}
          expiryDate={expiryDate}
          allConditions={allConditions}
          startDate={startDate}
          minAllowedPastStartDate={minAllowedPastStartDate}
          maxAllowedFutureStartDate={maxAllowedFutureStartDate}
          maxNumDaysAllowedInFuture={maxNumDaysAllowedInFuture}
          durationOptions={availableDurationOptions}
          pastStartDateStatus={pastStartDateStatus}
          onSetConditions={onSetConditions}
        />

        <CommodityDetailsSection
          feature={feature}
          permitType={permitType}
          commodityOptions={commodityOptions}
          selectedCommodityType={commodityType}
          onChangeCommodityType={onChangeCommodityType}
        />

        <VehicleInformationSection
          permitType={permitType}
          feature={feature}
          vehicleFormData={vehicleFormData}
          vehicleOptions={filteredVehicleOptions}
          subtypeOptions={subtypeOptions}
          isLOAUsed={currentSelectedLOAs.length > 0}
          isSelectedLOAVehicle={isSelectedLOAVehicle}
          nextAllowedSubtypes={nextAllowedSubtypes}
          powerUnitSubtypeNamesMap={powerUnitSubtypeNamesMap}
          trailerSubtypeNamesMap={trailerSubtypeNamesMap}
          selectedConfigSubtypes={selectedVehicleConfigSubtypes}
          selectedCommodityType={commodityType}
          onSetSaveVehicle={onToggleSaveVehicle}
          onSetVehicle={onSetVehicle}
          onClearVehicle={onClearVehicle}
          onUpdateVehicleConfigTrailers={onUpdateVehicleConfigTrailers}
        />

        <LoadedDimensionsSection
          permitType={permitType}
          feature={feature}
          vehicleConfiguration={vehicleConfiguration}
          onUpdateVehicleConfiguration={onUpdateVehicleConfig}
        />

        <TripDetailsSection
          feature={feature}
          permitType={permitType}
          highwaySequence={highwaySequence}
          tripOrigin={tripOrigin}
          tripDestination={tripDestination}
          totalDistance={totalDistance}
          onUpdateHighwaySequence={onUpdateHighwaySequence}
          onUpdateTripOrigin={onUpdateTripOrigin}
          onUpdateTripDestination={onUpdateTripDestination}
          onUpdateTotalDistance={onUpdateTotalDistance}
        />

        <ThirdPartyLiabilitySection
          permitType={permitType}
          thirdPartyLiability={thirdPartyLiability}
          onChange={onUpdateThirdPartyLiability}
        />

        <ConditionalLicensingFeeSection
          permitType={permitType}
          conditionalLicensingFeeType={conditionalLicensingFee}
          availableCLFs={availableCLFs}
          onChange={onUpdateConditionalLicensingFee}
        />

        <VehicleWeightSection
          permitType={permitType}
          isVehicleSubtypeEmpty={isVehicleSubtypeEmpty(
            vehicleFormData.vehicleSubType,
          )}
          enableLoadedGVW={enableLoadedGVW}
          loadedGVW={vehicleConfiguration?.loadedGVW}
          enableNetWeight={enableNetWeight}
          netWeight={vehicleConfiguration?.netWeight}
          onUpdateLoadedGVW={onUpdateLoadedGVW}
          onUpdateNetWeight={onUpdateNetWeight}
        />

        <ApplicationNotesSection feature={feature} permitType={permitType} />

        {isAmendAction ? (
          <>
            <AmendRevisionHistory revisionHistory={revisionHistory} />
            <AmendReason feature={feature} />
          </>
        ) : null}

        {rejectionHistory.length > 0 && (
          <div ref={reviewApplicationRejectionHistoryRef}>
            <ReviewApplicationRejectionHistory
              applicationRejectionHistory={rejectionHistory}
            />
          </div>
        )}
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
