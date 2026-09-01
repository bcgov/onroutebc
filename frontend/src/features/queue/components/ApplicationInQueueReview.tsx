import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import "./ApplicationInQueueReview.scss";
import { getDefaultRequiredVal } from "../../../common/helpers/util";
import { Nullable } from "../../../common/types/common";
import {
  APPLICATION_QUEUE_ROUTES,
  APPLICATION_STEPS,
  IDIR_ROUTES,
} from "../../../routes/constants";
import { useCompanyInfoDetailsQuery } from "../../manageProfile/apiManager/hooks";
import { usePowerUnitSubTypesQuery } from "../../manageVehicles/hooks/powerUnits";
import { useTrailerSubTypesQuery } from "../../manageVehicles/hooks/trailers";
import { PermitReview } from "../../permits/pages/Application/components/review/PermitReview";
import { Application } from "../../permits/types/application";
import { PERMIT_REVIEW_CONTEXTS } from "../../permits/types/PermitReviewContext";
import {
  DEFAULT_PERMIT_TYPE,
  PERMIT_TYPES,
} from "../../permits/types/PermitType";
import { useFetchSpecialAuthorizations } from "../../settings/hooks/specialAuthorizations";
import { CASE_ACTIVITY_TYPES } from "../types/CaseActivityType";
import { QueueBreadcrumb } from "./QueueBreadcrumb";
import { RejectApplicationModal } from "./RejectApplicationModal";
import { useUpdateApplicationInQueueStatus } from "../hooks/hooks";
import { usePolicyEngine } from "../../policy/hooks/usePolicyEngine";
import { useCommodityOptions } from "../../permits/hooks/useCommodityOptions";
import { useCalculatePermitFee } from "../../permits/hooks/useCalculatePermitFee";
import { serializePermitData } from "../../permits/helpers/serialize/serializePermitData";
import { usePolicyWarnings } from "../../permits/hooks/usePolicyWarnings";
import { PermitReviewConfirmWarningDialog } from "../../permits/components/dialog/PermitReviewConfirmWarningDialog";

export const ApplicationInQueueReview = ({
  applicationData,
}: {
  applicationData?: Nullable<Application>;
}) => {
  const companyId = getDefaultRequiredVal(0, applicationData?.companyId);
  const applicationId = getDefaultRequiredVal("", applicationData?.permitId);

  const { data: specialAuth } = useFetchSpecialAuthorizations(companyId);

  const { data: companyInfo } = useCompanyInfoDetailsQuery(companyId);
  const doingBusinessAs = companyInfo?.alternateName;

  const permitType = getDefaultRequiredVal(
    DEFAULT_PERMIT_TYPE,
    applicationData?.permitType,
  );

  const policyEngine = usePolicyEngine(specialAuth);
  const serializedPermit = {
    permitType,
    permitData: applicationData?.permitData
      ? serializePermitData(applicationData.permitData)
      : {},
  };

  const { totalCost, costs } = useCalculatePermitFee(
    serializedPermit,
    policyEngine,
  );

  const { policyWarnings } = usePolicyWarnings(serializedPermit, policyEngine);

  const navigate = useNavigate();

  const { commodityOptions } = useCommodityOptions(policyEngine, permitType);
  const powerUnitSubTypesQuery = usePowerUnitSubTypesQuery();
  const trailerSubTypesQuery = useTrailerSubTypesQuery();
  const methods = useForm<Application>();

  // For the confirmation checkboxes
  // For Applications in Queue review, confirmation checkboxes are checked and disabled by default
  const [allConfirmed, setAllConfirmed] = useState(true);
  const [hasAttemptedSubmission, setHasAttemptedSubmission] = useState(false);

  const handleEdit = () => {
    navigate(APPLICATION_QUEUE_ROUTES.EDIT(companyId, applicationId), {
      replace: true,
    });
  };

  const isSuccess = (status?: number) => status === 201;

  const {
    mutateAsync: updateApplication,
    data: updateApplicationResponse,
    isPending: updateApplicationMutationPending,
  } = useUpdateApplicationInQueueStatus();

  const [showConfirmWarningModal, setShowConfirmWarningModal] =
    useState<boolean>(false);

  const handleApprove = async (): Promise<void> => {
    setHasAttemptedSubmission(true);

    await updateApplication({
      applicationId,
      companyId,
      caseActivityType: CASE_ACTIVITY_TYPES.APPROVED,
    });
  };

  const handleClickApprove = async () => {
    if (permitType === PERMIT_TYPES.STWSE && policyWarnings.length > 0) {
      setShowConfirmWarningModal(true);
    } else {
      await handleApprove();
    }
  };

  const handleCloseConfirmWarningModal = () => {
    setShowConfirmWarningModal(false);
  };

  const [showRejectApplicationModal, setShowRejectApplicationModal] =
    useState<boolean>(false);

  const handleRejectButton = () => {
    setShowRejectApplicationModal(true);
  };

  const handleReject = async (comment: string): Promise<void> => {
    setHasAttemptedSubmission(true);

    await updateApplication({
      applicationId,
      companyId,
      caseActivityType: CASE_ACTIVITY_TYPES.REJECTED,
      comment,
    });
  };

  const updateApplicationResponseStatus = updateApplicationResponse?.status;

  useEffect(() => {
    if (isSuccess(updateApplicationResponseStatus)) {
      navigate(IDIR_ROUTES.STAFF_HOME);
    }
  }, [updateApplicationResponseStatus, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="application-in-queue-review">
      <QueueBreadcrumb
        applicationNumber={applicationData?.applicationNumber}
        applicationStep={APPLICATION_STEPS.REVIEW}
      />

      <FormProvider {...methods}>
        <PermitReview
          reviewContext={PERMIT_REVIEW_CONTEXTS.QUEUE}
          permitType={permitType}
          permitNumber={applicationData?.permitNumber}
          applicationNumber={applicationData?.applicationNumber}
          isAmendAction={false}
          permitStartDate={applicationData?.permitData?.startDate}
          permitDuration={applicationData?.permitData?.permitDuration}
          permitExpiryDate={applicationData?.permitData?.expiryDate}
          permitConditions={applicationData?.permitData?.commodities}
          permittedCommodity={applicationData?.permitData?.permittedCommodity}
          commodityOptions={commodityOptions}
          createdDateTime={applicationData?.createdDateTime}
          updatedDateTime={applicationData?.updatedDateTime}
          companyInfo={companyInfo}
          contactDetails={applicationData?.permitData?.contactDetails}
          onEdit={handleEdit}
          handleApproveButton={handleClickApprove}
          updateApplicationMutationPending={updateApplicationMutationPending}
          handleRejectButton={handleRejectButton}
          allConfirmed={allConfirmed}
          setAllConfirmed={setAllConfirmed}
          hasAttemptedCheckboxes={hasAttemptedSubmission}
          powerUnitSubTypes={powerUnitSubTypesQuery.data}
          trailerSubTypes={trailerSubTypesQuery.data}
          vehicleDetails={applicationData?.permitData?.vehicleDetails}
          vehicleWasSaved={
            applicationData?.permitData?.vehicleDetails?.saveVehicle
          }
          vehicleConfiguration={
            applicationData?.permitData?.vehicleConfiguration
          }
          route={applicationData?.permitData?.permittedRoute}
          applicationNotes={applicationData?.permitData?.applicationNotes}
          doingBusinessAs={doingBusinessAs}
          calculatedFee={`${totalCost}`}
          permitIntermediaryCosts={costs}
          applicationRejectionHistory={applicationData?.rejectionHistory}
          isStaffUser={true}
          thirdPartyLiability={applicationData?.permitData?.thirdPartyLiability}
          conditionalLicensingFee={
            applicationData?.permitData?.conditionalLicensingFee
          }
          companyId={companyId}
          icbcInsuranceCertificate={
            applicationData?.permitData?.icbcInsuranceCertificate
          }
          policyWarnings={policyWarnings}
        />
      </FormProvider>

      {showRejectApplicationModal ? (
        <RejectApplicationModal
          showModal={showRejectApplicationModal}
          onCancel={() => setShowRejectApplicationModal(false)}
          onConfirm={handleReject}
          isPending={updateApplicationMutationPending}
        />
      ) : null}

      {showConfirmWarningModal ? (
        <PermitReviewConfirmWarningDialog
          showModal={showConfirmWarningModal}
          isAmend={false}
          actionText="approve"
          confirmButtonText="Approve"
          onCancel={handleCloseConfirmWarningModal}
          onConfirm={handleApprove}
        />
      ) : null}
    </div>
  );
};
