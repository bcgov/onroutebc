import { Box } from "@mui/material";
import { Dayjs } from "dayjs";
import { useMemo } from "react";
import type { ValidationResult, ValidationResults } from "onroute-policy-engine";
import type { StandardTireSize } from "onroute-policy-engine/types";

import "./PermitReview.scss";
import { ReviewActions } from "./ReviewActions";
import { ReviewContactDetails } from "./ReviewContactDetails";
import { ReviewFeeSummary } from "./ReviewFeeSummary";
import { ReviewPermitDetails } from "./ReviewPermitDetails";
import { ReviewPermitLOAs } from "./ReviewPermitLOAs";
import { ReviewVehicleInfo } from "./ReviewVehicleInfo";
import { PERMIT_TYPES, PermitType } from "../../../../types/PermitType";
import { PermitVehicleDetails } from "../../../../types/PermitVehicleDetails";
import { WarningBcGovBanner } from "../../../../../../common/components/banners/WarningBcGovBanner";
import { Nullable } from "../../../../../../common/types/common";
import { CompanyProfile } from "../../../../../manageProfile/types/manageProfile";
import { VehicleSubType } from "../../../../../manageVehicles/types/Vehicle";
import { ApplicationDetails } from "../../../../components/form/ApplicationDetails";
import { Application } from "../../../../types/application";
import { PermitCondition } from "../../../../types/PermitCondition";
import { PermitContactDetails } from "../../../../types/PermitContactDetails";
import { PermitLOA } from "../../../../types/PermitLOA";
import { getDefaultRequiredVal } from "../../../../../../common/helpers/util";
import { ApplicationRejectionHistory } from "../../../../types/ApplicationRejectionHistory";
import { ReviewApplicationRejectionHistory } from "./ReviewApplicationRejectionHistory";
import { isPermitStartOrExpiryDateInPast } from "../../../../helpers/dateSelection";
import { CommodityDetails } from "./CommodityDetails";
import { PermittedCommodity } from "../../../../types/PermittedCommodity";
import { PermitVehicleConfiguration } from "../../../../types/PermitVehicleConfiguration";
import { PermittedRoute } from "../../../../types/PermittedRoute";
import { LoadedDimensions } from "./LoadedDimensions";
import { ApplicationNotes } from "./ApplicationNotes";
import { TripDetails } from "./TripDetails";
import { ThirdPartyLiability } from "../../../../types/ThirdPartyLiability";
import { ThirdPartyLiabilitySection } from "./ThirdPartyLiabilitySection";
import { ReviewConditionalLicensingFeesSection } from "./ReviewConditionalLicensingFeesSection";
import { ReviewVehicleWeightSection } from "./ReviewVehicleWeightSection";
import { ConditionalLicensingFeeType } from "../../../../types/ConditionalLicensingFee";
import { ICBCInsuranceCertificate } from "../../../../types/ICBCInsuranceCertificate";
import { ReviewICBCInsuranceCertificateSection } from "./ReviewICBCInsuranceCertificateSection";
import { OverloadWeights } from "./OverloadWeights";
import { ReviewActualGVW } from "./ReviewActualGVW";
import {
  PERMIT_REVIEW_CONTEXTS,
  PermitReviewContext,
} from "../../../../types/PermitReviewContext";
import { AxleSpacingAndWeightsSection } from "../form/axleSpacingAndWeightsSection/AxleSpacingAndWeightsSection";

interface PermitReviewProps {
  reviewContext: PermitReviewContext;
  permitType?: Nullable<PermitType>;
  permitNumber?: Nullable<string>;
  applicationNumber?: Nullable<string>;
  createdDateTime?: Nullable<Dayjs>;
  updatedDateTime?: Nullable<Dayjs>;
  companyInfo?: Nullable<CompanyProfile>;
  contactDetails?: Nullable<PermitContactDetails>;
  permitStartDate?: Nullable<Dayjs>;
  permitDuration?: Nullable<number>;
  permitExpiryDate?: Nullable<Dayjs>;
  permitConditions?: Nullable<PermitCondition[]>;
  permittedCommodity?: Nullable<PermittedCommodity>;
  commodityOptions: {
    label: string;
    value: string;
  }[];
  continueBtnText?: string;
  isAmendAction: boolean;
  children?: React.ReactNode;
  hasAttemptedCheckboxes: boolean;
  allConfirmed: boolean;
  setAllConfirmed: (confirmed: boolean) => void;
  powerUnitSubTypes?: Nullable<VehicleSubType[]>;
  trailerSubTypes?: Nullable<VehicleSubType[]>;
  vehicleDetails?: Nullable<PermitVehicleDetails>;
  vehicleWasSaved?: Nullable<boolean>;
  vehicleConfiguration?: Nullable<PermitVehicleConfiguration>;
  route?: Nullable<PermittedRoute>;
  applicationNotes?: Nullable<string>;
  onEdit: () => void;
  onContinue?: () => Promise<void>;
  onAddToCart?: () => Promise<void>;
  handleApproveButton?: () => Promise<void>;
  updateApplicationMutationPending?: boolean;
  handleRejectButton?: () => void;
  showChangedFields?: boolean;
  oldFields?: Nullable<Partial<Application>>;
  calculatedFee: string;
  permitIntermediaryCosts: ValidationResult[];
  doingBusinessAs?: Nullable<string>;
  loas?: Nullable<PermitLOA[]>;
  applicationRejectionHistory?: Nullable<ApplicationRejectionHistory[]>;
  isStaffUser: boolean;
  thirdPartyLiability?: Nullable<ThirdPartyLiability>;
  conditionalLicensingFee?: Nullable<ConditionalLicensingFeeType>;
  icbcInsuranceCertificate?: Nullable<ICBCInsuranceCertificate>;
  companyId: number;
  policyWarnings: ValidationResult[];
  axleCalculationResults?: ValidationResults["axleCalculationResults"];
  tireSizeOptions?: StandardTireSize[];
}

export const PermitReview = (props: PermitReviewProps) => {
  const { powerUnitSubTypes, trailerSubTypes } = props;
  const powerUnitSubtypeNamesMap = useMemo(
    () =>
      new Map<string, string>(
        getDefaultRequiredVal([], powerUnitSubTypes).map(
          ({ typeCode, type }) => [typeCode, type],
        ),
      ),
    [powerUnitSubTypes],
  );

  const trailerSubtypeNamesMap = useMemo(
    () =>
      new Map<string, string>(
        getDefaultRequiredVal([], trailerSubTypes).map(({ typeCode, type }) => [
          typeCode,
          type,
        ]),
      ),
    [trailerSubTypes],
  );

  const shouldShowRejectionHistory =
    (props.reviewContext === PERMIT_REVIEW_CONTEXTS.QUEUE ||
      props.reviewContext === PERMIT_REVIEW_CONTEXTS.APPLY) &&
    props.applicationRejectionHistory &&
    props.applicationRejectionHistory.length > 0;

  const invalidPermitDates =
    props.permitStartDate && props.permitExpiryDate
      ? isPermitStartOrExpiryDateInPast(
          props.permitStartDate,
          props.permitExpiryDate,
        )
      : false;

  // The "Add to Cart" button should only show up if:
  // 1. Applying for permit, and permit type is not STOS nor STWSE
  // 2. Applying for permit, and user is staff
  // 3. Applying for permit, and user isn't staff and permit type is STWSE,
  // but there are no dimension oversize warnings
  // 4. Amending a permit and the total amount due is a positive amount
  // (ie. Additional amount needs to be paid for amendment)
  const hasToCartButton = (
    props.reviewContext === PERMIT_REVIEW_CONTEXTS.APPLY
      && (
        (
          props.permitType !== PERMIT_TYPES.STOS
            && props.permitType !== PERMIT_TYPES.STWSE
        ) || (
          props.isStaffUser
        ) || (
          props.permitType === PERMIT_TYPES.STWSE
            && props.policyWarnings.length <= 0
        )
      )
  ) || (
    props.reviewContext === PERMIT_REVIEW_CONTEXTS.AMEND
      && Number(props.calculatedFee) > 0
  );
  
  return (
    <Box className="permit-review layout-box">
      <Box className="permit-review__container">
        <Box className="permit-review__banner--confirm">
          <WarningBcGovBanner msg="Please review and confirm that the information below is correct." />
        </Box>

        <ApplicationDetails
          permitType={props.permitType}
          infoNumberType={props.isAmendAction ? "permit" : "application"}
          infoNumber={
            props.isAmendAction ? props.permitNumber : props.applicationNumber
          }
          isAmendAction={props.isAmendAction}
          createdDateTime={props.createdDateTime}
          updatedDateTime={props.updatedDateTime}
          companyInfo={props.companyInfo}
          doingBusinessAs={props.doingBusinessAs}
        />

        <ReviewContactDetails
          contactDetails={props.contactDetails}
          showChangedFields={props.showChangedFields}
          oldFields={props.oldFields?.permitData?.contactDetails}
        />

        <ReviewPermitLOAs loas={props.loas} />

        <ReviewPermitDetails
          permitType={props.permitType}
          startDate={props.permitStartDate}
          permitDuration={props.permitDuration}
          expiryDate={props.permitExpiryDate}
          conditions={props.permitConditions}
          showChangedFields={props.showChangedFields}
          oldStartDate={props.oldFields?.permitData?.startDate}
          oldDuration={props.oldFields?.permitData?.permitDuration}
          showDateErrorBanner={invalidPermitDates}
        />

        <CommodityDetails
          commodity={props.permittedCommodity}
          oldCommodity={props.oldFields?.permitData?.permittedCommodity}
          showChangedFields={props.showChangedFields}
          commodityOptions={props.commodityOptions}
        />

        <ReviewICBCInsuranceCertificateSection
          permitType={props.permitType}
          haveCertificate={Boolean(
            props.icbcInsuranceCertificate?.haveCertificate,
          )}
          oldHaveCertificate={Boolean(
            props.oldFields?.permitData?.icbcInsuranceCertificate
              ?.haveCertificate,
          )}
          showChangedFields={props.showChangedFields}
        />

        <ReviewVehicleInfo
          permitType={props.permitType}
          powerUnitSubtypeNamesMap={powerUnitSubtypeNamesMap}
          trailerSubtypeNamesMap={trailerSubtypeNamesMap}
          vehicleDetails={props.vehicleDetails}
          vehicleWasSaved={props.vehicleWasSaved}
          showChangedFields={props.showChangedFields}
          oldFields={props.oldFields?.permitData?.vehicleDetails}
          selectedTrailers={props.vehicleConfiguration?.trailers}
        />

        {props.permitType === PERMIT_TYPES.STOW &&
        props.vehicleDetails &&
        props.axleCalculationResults ? (
          <AxleSpacingAndWeightsSection
            permitType={props.permitType}
            selectedCommodityType={props.permittedCommodity?.commodityType}
            powerUnitSubtypeNamesMap={powerUnitSubtypeNamesMap}
            trailerSubtypeNamesMap={trailerSubtypeNamesMap}
            vehicleFormData={props.vehicleDetails}
            vehicleConfiguration={props.vehicleConfiguration}
            axleCalculationResultsFromValidation={props.axleCalculationResults}
            tireSizeOptions={props.tireSizeOptions}
            showASWRequiredFieldsBanner={false}
            readOnly={true}
          />
        ) : null}

        <ReviewActualGVW
          permitType={props.permitType}
          actualGVW={getDefaultRequiredVal(
            0,
            props.vehicleConfiguration?.actualGVW,
          )}
          licensedGVW={getDefaultRequiredVal(
            0,
            props.vehicleDetails?.licensedGVW,
          )}
        />

        <LoadedDimensions
          permitType={props.permitType}
          vehicleConfiguration={props.vehicleConfiguration}
          oldVehicleConfiguration={
            props.oldFields?.permitData?.vehicleConfiguration
          }
          showChangedFields={props.showChangedFields}
          policyWarnings={props.policyWarnings}
        />

        <OverloadWeights
          permitType={props.permitType}
          vehicleConfiguration={props.vehicleConfiguration}
          oldVehicleConfiguration={
            props.oldFields?.permitData?.vehicleConfiguration
          }
          showChangedFields={props.showChangedFields}
        />

        <TripDetails
          routeDetails={props.route}
          oldRouteDetails={props.oldFields?.permitData?.permittedRoute}
          showChangedFields={props.showChangedFields}
        />

        <ThirdPartyLiabilitySection
          thirdPartyLiability={props.thirdPartyLiability}
          oldThirdPartyLiability={
            props.oldFields?.permitData?.thirdPartyLiability
          }
          showChangedFields={props.showChangedFields}
        />

        <ReviewConditionalLicensingFeesSection
          selectedCLF={props.conditionalLicensingFee}
          oldCLF={props.oldFields?.permitData?.conditionalLicensingFee}
          showChangedFields={props.showChangedFields}
        />

        <ReviewVehicleWeightSection
          loadedGVW={props.vehicleConfiguration?.loadedGVW}
          oldLoadedGVW={
            props.oldFields?.permitData?.vehicleConfiguration?.loadedGVW
          }
          netWeight={props.vehicleConfiguration?.netWeight}
          oldNetWeight={
            props.oldFields?.permitData?.vehicleConfiguration?.netWeight
          }
          showChangedFields={props.showChangedFields}
        />

        <ApplicationNotes applicationNotes={props.applicationNotes} />

        {shouldShowRejectionHistory && props.applicationRejectionHistory ? (
          <ReviewApplicationRejectionHistory
            applicationRejectionHistory={props.applicationRejectionHistory}
          />
        ) : null}

        <ReviewFeeSummary
          hasAttemptedSubmission={props.hasAttemptedCheckboxes}
          areAllConfirmed={props.allConfirmed}
          setAreAllConfirmed={props.setAllConfirmed}
          permitType={props.permitType}
          fee={props.calculatedFee}
          permitIntermediaryCosts={props.permitIntermediaryCosts}
          reviewContext={props.reviewContext}
          companyId={props.companyId}
        />

        {props.children}

        <ReviewActions
          reviewContext={props.reviewContext}
          onEdit={props.onEdit}
          continueBtnText={props.continueBtnText}
          onContinue={props.onContinue}
          hasToCartButton={hasToCartButton}
          onAddToCart={props.onAddToCart}
          handleApproveButton={props.handleApproveButton}
          handleRejectButton={props.handleRejectButton}
          disableApproveButton={
            props.updateApplicationMutationPending || invalidPermitDates
          }
          disableRejectButton={props.updateApplicationMutationPending}
        />
      </Box>
    </Box>
  );
};
