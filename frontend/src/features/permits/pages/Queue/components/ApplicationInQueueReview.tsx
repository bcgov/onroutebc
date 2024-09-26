/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import "./ApplicationInQueueReview.scss";
import { Application } from "../../../types/application";
import { ApplicationBreadcrumb } from "../../../components/application-breadcrumb/ApplicationBreadcrumb";
import { useCompanyInfoDetailsQuery } from "../../../../manageProfile/apiManager/hooks";
import { PermitReview } from "../../Application/components/review/PermitReview";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../../common/helpers/util";
import { usePowerUnitSubTypesQuery } from "../../../../manageVehicles/hooks/powerUnits";
import { useTrailerSubTypesQuery } from "../../../../manageVehicles/hooks/trailers";
import { useFetchSpecialAuthorizations } from "../../../../settings/hooks/specialAuthorizations";
import { applyLCVToApplicationData } from "../../../helpers/getDefaultApplicationFormData";
import { calculateFeeByDuration } from "../../../helpers/feeSummary";
import { DEFAULT_PERMIT_TYPE } from "../../../types/PermitType";
import {
  APPLICATIONS_ROUTES,
  APPLICATION_QUEUE_ROUTES,
  APPLICATION_STEPS,
  IDIR_ROUTES,
} from "../../../../../routes/constants";
import { ReviewApplicationInQueueContext } from "../context/ReviewApplicationInQueueContext";
import {
  useApproveApplicationInQueueMutation,
  useRejectApplicationInQueueMutation,
} from "../../../hooks/hooks";

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

  const routeParams = useParams();
  const permitId = getDefaultRequiredVal("", routeParams.permitId);

  const navigate = useNavigate();

  const powerUnitSubTypesQuery = usePowerUnitSubTypesQuery();
  const trailerSubTypesQuery = useTrailerSubTypesQuery();
  const methods = useForm<Application>();

  // For the confirmation checkboxes
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitted] = useState(false);

  const back = () => {
    navigate(APPLICATIONS_ROUTES.DETAILS(permitId), { replace: true });
  };

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
    if (approveApplicationResponse?.status === 201) {
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
    if (rejectApplicationResponse?.status === 201) {
      navigate(IDIR_ROUTES.STAFF_HOME);
    }
  }, [rejectApplicationResponse, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="application-review">
      <ApplicationBreadcrumb
        permitId={permitId}
        applicationStep={APPLICATION_STEPS.REVIEW}
      />

      <FormProvider {...methods}>
        <PermitReview
          permitType={applicationData?.permitType}
          permitNumber={applicationData?.permitNumber}
          applicationNumber={applicationData?.applicationNumber}
          isAmendAction={true}
          permitStartDate={applicationData?.permitData?.startDate}
          permitDuration={applicationData?.permitData?.permitDuration}
          permitExpiryDate={applicationData?.permitData?.expiryDate}
          permitConditions={applicationData?.permitData?.commodities}
          createdDateTime={applicationData?.createdDateTime}
          updatedDateTime={applicationData?.updatedDateTime}
          companyInfo={companyInfo}
          contactDetails={applicationData?.permitData?.contactDetails}
          onEdit={back}
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
