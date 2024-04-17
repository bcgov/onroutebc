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
import { getDefaultRequiredVal } from "../../../../common/helpers/util";
import { SnackBarContext } from "../../../../App";
import {
  APPLICATIONS_ROUTES,
  APPLICATION_STEPS,
  ERROR_ROUTES,
} from "../../../../routes/constants";

import {
  usePowerUnitSubTypesQuery,
  useTrailerSubTypesQuery,
} from "../../../manageVehicles/apiManager/hooks";

export const ApplicationReview = () => {
  const { applicationData, setApplicationData } =
    useContext(ApplicationContext);

  const { setSnackBar } = useContext(SnackBarContext);

  const routeParams = useParams();
  const permitId = getDefaultRequiredVal("", routeParams.permitId);

  const navigate = useNavigate();

  const { data: companyInfo } = useCompanyInfoQuery();
  const powerUnitSubTypesQuery = usePowerUnitSubTypesQuery();
  const trailerSubTypesQuery = useTrailerSubTypesQuery();
  const methods = useForm<Application>();

  const doingBusinessAs = companyInfo?.alternateName;

  // For the confirmation checkboxes
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Send data to the backend API
  const saveApplicationMutation = useSaveApplicationMutation();

  const back = () => {
    navigate(APPLICATIONS_ROUTES.DETAILS(permitId), { replace: true });
  };

  const next = () => {
    navigate(APPLICATIONS_ROUTES.PAY(permitId));
  };

  const handleContinue = async () => {
    setIsSubmitted(true);

    if (!isChecked) return;

    if (!applicationData) {
      return navigate(ERROR_ROUTES.UNEXPECTED);
    }

    const { application: savedApplication } =
      await saveApplicationMutation.mutateAsync({
        ...applicationData,
        permitData: {
          ...applicationData.permitData,
          doingBusinessAs, // always set most recent DBA from company info
        }
      });

    if (savedApplication) {
      setApplicationData(savedApplication);
      next();
    } else {
      navigate(ERROR_ROUTES.UNEXPECTED);
    }
  };

  const handleAddToCart = async () => {
    setIsSubmitted(true);

    if (!isChecked) return;

    if (!applicationData) {
      return navigate(ERROR_ROUTES.UNEXPECTED);
    }

    // Perform add application to cart here, waiting for backend
    // On Success
    setSnackBar({
      showSnackbar: true,
      setShowSnackbar: () => true,
      message: `Application ${applicationData.applicationNumber} added to cart`,
      alertType: "success",
    });
    navigate(APPLICATIONS_ROUTES.BASE);
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
          companyInfo={companyInfo}
          contactDetails={applicationData?.permitData?.contactDetails}
          continueBtnText="Checkout"
          onEdit={back}
          onContinue={methods.handleSubmit(handleContinue)}
          onAddToCart={handleAddToCart}
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
