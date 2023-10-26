import { FieldValues, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { Application } from "../../types/application.d";
import { ApplicationContext } from "../../context/ApplicationContext";
import { ProgressBar } from "../../components/progressBar/ProgressBar";
import { useSaveTermOversizeMutation } from "../../hooks/hooks";
import { SnackBarContext } from "../../../../App";
import { LeaveApplicationDialog } from "../../components/dialog/LeaveApplicationDialog";
import { areApplicationDataEqual } from "../../helpers/equality";
import { useDefaultApplicationFormData } from "../../hooks/useDefaultApplicationFormData";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { PermitForm } from "./components/form/PermitForm";
import { usePermitVehicleManagement } from "../../hooks/usePermitVehicleManagement";

/**
 * The first step in creating and submitting a TROS Application.
 * @returns A form for users to create a Term Oversize Application
 */
export const TermOversizeForm = () => {
  //The name of this feature that is used for id's, keys, and associating form components
  const FEATURE = "term-oversize";

  // Context to hold all of the application data related to the TROS application
  const applicationContext = useContext(ApplicationContext);

  // Use a custom hook that performs the following whenever page is rendered (or when application context is updated/changed):
  // 1. Get all data needed to generate default values for the application form (from application context, company, user details)
  // 2. Generate those default values and register them to the form
  // 3. Listens for changes to application context (which happens when application is fetched/submitted/updated)
  // 4. Updates form default values when application context data values change
  const { 
    defaultApplicationDataValues: termOversizeDefaultValues,
    formMethods,
    companyInfo,
  } = useDefaultApplicationFormData(
    applicationContext?.applicationData
  );

  const submitTermOversizeMutation = useSaveTermOversizeMutation();
  const snackBar = useContext(SnackBarContext);
  const { companyLegalName, onRouteBCClientNumber } = useContext(OnRouteBCContext);

  const {
    handleSaveVehicle,
    vehicleOptions,
    powerUnitTypes,
    trailerTypes,
  } = usePermitVehicleManagement();

  // Show leave application dialog
  const [showLeaveApplicationDialog, setShowLeaveApplicationDialog] = useState<boolean>(false); 

  const { handleSubmit, getValues } = formMethods;

  const navigate = useNavigate();

  // Helper method to return form field values as an Application object
  const applicationFormData = (data: FieldValues) => {
    return {
      ...data,
      applicationNumber: applicationContext.applicationData?.applicationNumber,
      permitData: {
        ...data.permitData,
        companyName: companyLegalName,
        clientNumber: onRouteBCClientNumber,
        vehicleDetails: {
          ...data.permitData.vehicleDetails,
          // Convert year to number here, as React doesn't accept valueAsNumber prop for input component
          year: !isNaN(Number(data.permitData.vehicleDetails.year)) ? 
            Number(data.permitData.vehicleDetails.year) : data.permitData.vehicleDetails.year
        }
      }
    } as Application;
  };

  // Check to see if all application values were already saved
  const isApplicationSaved = () => {
    const currentFormData = applicationFormData(getValues());
    const savedData = applicationContext.applicationData;
    if (!savedData) return false;

    // Check if all current form field values match field values already saved in application context
    return areApplicationDataEqual(currentFormData.permitData, savedData.permitData);
  };

  // When "Continue" button is clicked
  const onContinue = async (data: FieldValues) => {
    const termOverSizeToBeAdded = applicationFormData(data);
    const vehicleData = termOverSizeToBeAdded.permitData.vehicleDetails;
    handleSaveVehicle(vehicleData);

    // Save application before continuing
    await onSaveApplication(() => applicationContext?.next());
  };

  const isSaveTermOversizeSuccessful = (status: number) => status === 200 || status === 201;

  const onSaveSuccess = (responseData: Application, status: number) => {
    snackBar.setSnackBar({
      showSnackbar: true,
      setShowSnackbar: () => true,
      message: `Application ${responseData.applicationNumber} ${status === 201 ? "created" : "updated"}.`,
      alertType: "success",
    });

    applicationContext?.setApplicationData(responseData);
  };

  const onSaveFailure = () => {
    snackBar.setSnackBar({
      showSnackbar: true,
      setShowSnackbar: () => true,
      message: `An unexpected error occured`,
      alertType: "error",
    });
  };

  // Whenever application is to be saved (either through "Save" or "Continue")
  const onSaveApplication = async (additionalSuccessAction?: () => void) => {
    const termOverSizeToBeAdded = applicationFormData(getValues());
    const response = await submitTermOversizeMutation.mutateAsync(
      termOverSizeToBeAdded
    );
    
    if (isSaveTermOversizeSuccessful(response.status)) {
      const responseData = response.data;
      onSaveSuccess(responseData as Application, response.status);
      additionalSuccessAction?.();
    } else {
      onSaveFailure();
    }
  };
  
  // Whenever "Leave" button is clicked
  const handleLeaveApplication = () => {
    if (!isApplicationSaved()) {
      setShowLeaveApplicationDialog(true);
    } else {
      navigate("../applications");
    }
  };

  const handleLeaveUnsaved = () => {
    navigate("../applications");
  };

  const handleStayOnApplication = () => {
    setShowLeaveApplicationDialog(false);
  };

  return (
    <>
      <ProgressBar />

      <FormProvider {...formMethods}>
        <PermitForm 
          feature={FEATURE}
          onLeave={handleLeaveApplication}
          onSave={() => onSaveApplication()}
          onContinue={handleSubmit(onContinue)}
          isAmendAction={false}
          permitType={termOversizeDefaultValues.permitType}
          applicationNumber={termOversizeDefaultValues.applicationNumber}
          permitNumber={termOversizeDefaultValues.permitNumber}
          createdDateTime={termOversizeDefaultValues.createdDateTime}
          updatedDateTime={termOversizeDefaultValues.updatedDateTime}
          permitStartDate={termOversizeDefaultValues.permitData.startDate}
          permitDuration={termOversizeDefaultValues.permitData.permitDuration}
          permitCommodities={termOversizeDefaultValues.permitData.commodities}
          vehicleDetails={termOversizeDefaultValues.permitData.vehicleDetails}
          vehicleOptions={vehicleOptions}
          powerUnitTypes={powerUnitTypes}
          trailerTypes={trailerTypes}
          companyInfo={companyInfo}
        />
      </FormProvider>
      
      <LeaveApplicationDialog
        onLeaveUnsaved={handleLeaveUnsaved}
        onContinueEditing={handleStayOnApplication}
        showDialog={showLeaveApplicationDialog}
      />
    </>
  );
};
