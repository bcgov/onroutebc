import { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../common/helpers/util";
import {
  APPLICATION_QUEUE_ROUTES,
  APPLICATION_STEPS,
  IDIR_ROUTES,
} from "../../../routes/constants";
import { useCompanyInfoDetailsQuery } from "../../manageProfile/apiManager/hooks";
import { usePowerUnitSubTypesQuery } from "../../manageVehicles/hooks/powerUnits";
import { useTrailerSubTypesQuery } from "../../manageVehicles/hooks/trailers";
import { calculateFeeByDuration } from "../../permits/helpers/feeSummary";
import { applyLCVToApplicationData } from "../../permits/helpers/getDefaultApplicationFormData";
import { PermitReview } from "../../permits/pages/Application/components/review/PermitReview";
import { Application } from "../../permits/types/application";
import { DEFAULT_PERMIT_TYPE } from "../../permits/types/PermitType";
import { useFetchSpecialAuthorizations } from "../../settings/hooks/specialAuthorizations";
import { ReviewApplicationInQueueContext } from "../context/ReviewApplicationInQueueContext";
import {
  useApproveApplicationInQueueMutation,
  useRejectApplicationInQueueMutation,
} from "../hooks/hooks";
import "./ApplicationInQueueReview.scss";
import { QueueBreadcrumb } from "./QueueBreadcrumb";
import { PERMIT_REVIEW_CONTEXTS } from "../../permits/types/PermitReviewContext";

export const ApplicationInQueueReview = () => {
  const { applicationData: applicationContextData } = useContext(
    ReviewApplicationInQueueContext,
  );

  const companyId = applyWhenNotNullable(
    (id) => `${id}`,
    applicationContextData?.companyId,
    "",
  ) as string;

  const { data: specialAuth } = useFetchSpecialAuthorizations(companyId);
  const isLcvDesignated = Boolean(specialAuth?.isLcvAllowed);
  const isNoFeePermitType = Boolean(specialAuth?.noFeeType);

  const { data: companyInfo } = useCompanyInfoDetailsQuery(companyId);
  const doingBusinessAs = companyInfo?.alternateName;

  const applicationData = applyLCVToApplicationData(
    applicationContextData,
    isLcvDesignated,
  );

  const fee = isNoFeePermitType
    ? "0"
    : `${calculateFeeByDuration(
        getDefaultRequiredVal(DEFAULT_PERMIT_TYPE, applicationData?.permitType),
        getDefaultRequiredVal(0, applicationData?.permitData?.permitDuration),
      )}`;

  const navigate = useNavigate();

  const powerUnitSubTypesQuery = usePowerUnitSubTypesQuery();
  const trailerSubTypesQuery = useTrailerSubTypesQuery();
  const methods = useForm<Application>();

  // For the confirmation checkboxes
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitted] = useState(false);

  const handleEdit = () => {
    navigate(APPLICATION_QUEUE_ROUTES.EDIT);
  };

  const isSuccess = (status?: number) => status === 201;

  const {
    mutateAsync: approveApplication,
    data: approveApplicationResponse,
    isPending: approveApplicationMutationPending,
  } = useApproveApplicationInQueueMutation();

  const handleApprove = async (): Promise<void> => {
    await approveApplication({
      applicationId: applicationData?.permitId,
      companyId,
    });
  };

  useEffect(() => {
    if (isSuccess(approveApplicationResponse?.status)) {
      navigate(IDIR_ROUTES.STAFF_HOME);
    }
  }, [approveApplicationResponse, navigate]);

  const {
    mutateAsync: rejectApplication,
    data: rejectApplicationResponse,
    isPending: rejectApplicationMutationPending,
  } = useRejectApplicationInQueueMutation();

  const handleReject = async (): Promise<void> => {
    await rejectApplication({
      applicationId: applicationData?.permitId,
      companyId,
    });
  };

  useEffect(() => {
    if (isSuccess(rejectApplicationResponse?.status)) {
      navigate(IDIR_ROUTES.STAFF_HOME);
    }
  }, [rejectApplicationResponse, navigate]);

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
          permitType={applicationData?.permitType}
          permitNumber={applicationData?.permitNumber}
          applicationNumber={applicationData?.applicationNumber}
          isAmendAction={false}
          permitStartDate={applicationData?.permitData?.startDate}
          permitDuration={applicationData?.permitData?.permitDuration}
          permitExpiryDate={applicationData?.permitData?.expiryDate}
          permitConditions={applicationData?.permitData?.commodities}
          createdDateTime={applicationData?.createdDateTime}
          updatedDateTime={applicationData?.updatedDateTime}
          companyInfo={companyInfo}
          contactDetails={applicationData?.permitData?.contactDetails}
          onEdit={handleEdit}
          onApprove={handleApprove}
          approveApplicationMutationPending={approveApplicationMutationPending}
          onReject={handleReject}
          rejectApplicationMutationPending={rejectApplicationMutationPending}
          allChecked={isChecked}
          setAllChecked={setIsChecked}
          hasAttemptedCheckboxes={isSubmitted}
          powerUnitSubTypes={powerUnitSubTypesQuery.data}
          trailerSubTypes={trailerSubTypesQuery.data}
          vehicleDetails={applicationData?.permitData?.vehicleDetails}
          vehicleWasSaved={
            applicationData?.permitData?.vehicleDetails?.saveVehicle
          }
          doingBusinessAs={doingBusinessAs}
          calculatedFee={fee}
          isApplicationInReview={true}
        />
      </FormProvider>
    </div>
  );
};
