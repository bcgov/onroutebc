import { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import "./ApplicationReview.scss";
import { ApplicationContext } from "../../context/ApplicationContext";
import { Application } from "../../types/application";
import { useSaveApplicationMutation } from "../../hooks/hooks";
import { ApplicationBreadcrumb } from "../../components/application-breadcrumb/ApplicationBreadcrumb";
import { useCompanyInfoQuery } from "../../../manageProfile/apiManager/hooks";
import { PermitReview } from "./components/review/PermitReview";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import {
  APPLICATIONS_ROUTES,
  APPLICATION_STEPS,
  ERROR_ROUTES,
  withCompanyId,
} from "../../../../routes/constants";

import {
  usePowerUnitSubTypesQuery,
  useTrailerSubTypesQuery,
} from "../../../manageVehicles/apiManager/hooks";

export const ApplicationReview = () => {
  const { applicationData, setApplicationData } =
    useContext(ApplicationContext);

  const routeParams = useParams();
  const permitId = getDefaultRequiredVal("", routeParams.permitId);

  const navigate = useNavigate();

  const companyQuery = useCompanyInfoQuery();
  const powerUnitSubTypesQuery = usePowerUnitSubTypesQuery();
  const trailerSubTypesQuery = useTrailerSubTypesQuery();
  const methods = useForm<Application>();

  const {
    companyLegalName,
    idirUserDetails,
  } = useContext(OnRouteBCContext);

  const isStaffActingAsCompany = Boolean(idirUserDetails?.userAuthGroup);
  const doingBusinessAs = isStaffActingAsCompany && companyLegalName ?
    companyLegalName : "";

  // For the confirmation checkboxes
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Send data to the backend API
  const saveApplicationMutation = useSaveApplicationMutation();

  const saveApplicationSuccessful = (responseStatus: number) => {
    return responseStatus === 200 || responseStatus === 201;
  };

  const back = () => {
    navigate(withCompanyId(APPLICATIONS_ROUTES.DETAILS(permitId)), { replace: true });
  };

  const next = () => {
    navigate(withCompanyId(APPLICATIONS_ROUTES.PAY(permitId)));
  };

  const onSubmit = async () => {
    setIsSubmitted(true);

    if (!isChecked) return;

    if (!applicationData) {
      return navigate(ERROR_ROUTES.UNEXPECTED);
    }

    const response =
      await saveApplicationMutation.mutateAsync(applicationData);

    const { data, status } = response;
    setApplicationData(data);

    if (saveApplicationSuccessful(status)) {
      next();
    } else {
      navigate(ERROR_ROUTES.UNEXPECTED);
    }

    next();
  };

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
          isAmendAction={false}
          permitStartDate={applicationData?.permitData?.startDate}
          permitDuration={applicationData?.permitData?.permitDuration}
          permitExpiryDate={applicationData?.permitData?.expiryDate}
          permitConditions={applicationData?.permitData?.commodities}
          createdDateTime={applicationData?.createdDateTime}
          updatedDateTime={applicationData?.updatedDateTime}
          companyInfo={companyQuery.data}
          contactDetails={applicationData?.permitData?.contactDetails}
          continueBtnText="Proceed To Pay"
          onEdit={back}
          onContinue={methods.handleSubmit(onSubmit)}
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
        />
      </FormProvider>
    </div>
  );
};
