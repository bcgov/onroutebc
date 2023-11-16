import { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { ApplicationContext } from "../../context/ApplicationContext";
import { Application } from "../../types/application";
import { useSaveTermOversizeMutation } from "../../hooks/hooks";
import { ProgressBar } from "../../components/progressBar/ProgressBar";
import { useCompanyInfoQuery } from "../../../manageProfile/apiManager/hooks";
import { PermitReview } from "./components/review/PermitReview";
import {
  usePowerUnitTypesQuery,
  useTrailerTypesQuery,
} from "../../../manageVehicles/apiManager/hooks";

export const TermOversizeReview = () => {
  const { applicationData, setApplicationData, back, next } =
    useContext(ApplicationContext);

  const companyQuery = useCompanyInfoQuery();
  const powerUnitTypesQuery = usePowerUnitTypesQuery();
  const trailerTypesQuery = useTrailerTypesQuery();
  const methods = useForm<Application>();

  // For the confirmation checkboxes
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Send data to the backend API
  const submitTermOversizeMutation = useSaveTermOversizeMutation();
  const onSubmit = async () => {
    setIsSubmitted(true);

    if (!isChecked) return;

    if (applicationData) {
      const response =
        await submitTermOversizeMutation.mutateAsync(applicationData);
      const data = response.data;
      setApplicationData(data);
    }
    next();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <ProgressBar />

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
          powerUnitTypes={powerUnitTypesQuery.data}
          trailerTypes={trailerTypesQuery.data}
          vehicleDetails={applicationData?.permitData?.vehicleDetails}
          vehicleWasSaved={
            applicationData?.permitData?.vehicleDetails?.saveVehicle
          }
        />
      </FormProvider>
    </>
  );
};
