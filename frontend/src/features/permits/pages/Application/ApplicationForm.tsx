import { FieldValues, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import dayjs from "dayjs";

import "./ApplicationForm.scss";
import { Application, ApplicationFormData } from "../../types/application";
import { ApplicationContext } from "../../context/ApplicationContext";
import { ApplicationBreadcrumb } from "../../components/application-breadcrumb/ApplicationBreadcrumb";
import { useSaveApplicationMutation } from "../../hooks/hooks";
import { SnackBarContext } from "../../../../App";
import { LeaveApplicationDialog } from "../../components/dialog/LeaveApplicationDialog";
import { areApplicationDataEqual } from "../../helpers/equality";
import { useDefaultApplicationFormData } from "../../hooks/useDefaultApplicationFormData";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { PermitForm } from "./components/form/PermitForm";
import { usePermitVehicleManagement } from "../../hooks/usePermitVehicleManagement";
import { useCompanyInfoQuery } from "../../../manageProfile/apiManager/hooks";
import { Nullable } from "../../../../common/types/common";
import { PermitType } from "../../types/PermitType";
import { PermitVehicleDetails } from "../../types/PermitVehicleDetails";
import { durationOptionsForPermitType } from "../../helpers/dateSelection";
import { getCompanyIdFromSession } from "../../../../common/apiManager/httpRequestHandler";
import { PAST_START_DATE_STATUSES } from "../../../../common/components/form/subFormComponents/CustomDatePicker";
import { useFetchSpecialAuthorizations } from "../../../settings/hooks/specialAuthorizations";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../common/helpers/util";

import {
  APPLICATIONS_ROUTES,
  APPLICATION_STEPS,
  ERROR_ROUTES,
} from "../../../../routes/constants";

const FEATURE = "application";

/**
 * The first step in creating or saving an Application.
 * @returns A form component for users to save an Application
 */
export const ApplicationForm = ({ permitType }: { permitType: PermitType }) => {
  // Context to hold all of the application data related to the application
  const applicationContext = useContext(ApplicationContext);

  const {
    companyId: companyIdFromContext,
    companyLegalName,
    userDetails,
    onRouteBCClientNumber,
    idirUserDetails,
  } = useContext(OnRouteBCContext);

  const isStaffUser = Boolean(idirUserDetails?.userRole);
  const companyInfoQuery = useCompanyInfoQuery();
  const companyInfo = companyInfoQuery.data;

  // Company id should be set by context, otherwise default to companyId in session and then the fetched companyId
  const companyId: number = getDefaultRequiredVal(
    0,
    companyIdFromContext,
    applyWhenNotNullable(id => Number(id), getCompanyIdFromSession()),
    companyInfo?.companyId,
  );

  const { data: specialAuthorizations } = useFetchSpecialAuthorizations(companyId);
  const isLcvDesignated = Boolean(specialAuthorizations?.isLcvAllowed);
  
  // Use a custom hook that performs the following whenever page is rendered (or when application context is updated/changed):
  // 1. Get all data needed to generate default values for the application form (from application context, company, user details)
  // 2. Generate those default values and register them to the form
  // 3. Listens for changes to application context (which happens when application is fetched/submitted/updated)
  // 4. Updates form values (override existing ones) whenever the application context data changes
  const {
    initialFormData,
    currentFormData,
    formMethods,
  } = useDefaultApplicationFormData(
    permitType,
    isLcvDesignated,
    companyInfo,
    applicationContext?.applicationData,
    userDetails,
  );

  const createdDateTime = applyWhenNotNullable(
    (date) => dayjs(date),
    applicationContext?.applicationData?.createdDateTime,
  );

  const updatedDateTime = applyWhenNotNullable(
    (date) => dayjs(date),
    applicationContext?.applicationData?.updatedDateTime,
  );

  const doingBusinessAs = companyInfo?.alternateName;

  const saveApplicationMutation = useSaveApplicationMutation();
  const snackBar = useContext(SnackBarContext);

  const {
    handleSaveVehicle,
    vehicleOptions,
    powerUnitSubTypes,
    trailerSubTypes,
  } = usePermitVehicleManagement(companyId);

  // Show leave application dialog
  const [showLeaveApplicationDialog, setShowLeaveApplicationDialog] =
    useState<boolean>(false);

  const { handleSubmit } = formMethods;

  const navigate = useNavigate();

  // Helper method to format form values to Application objects before saving them
  const formattedFormData = (data: FieldValues) => {
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
          year: !isNaN(Number(data.permitData.vehicleDetails.year))
            ? Number(data.permitData.vehicleDetails.year)
            : data.permitData.vehicleDetails.year,
        },
      },
    } as ApplicationFormData;
  };

  // Check to see if all application values were already saved
  const isApplicationSaved = () => {
    const currentFormattedFormData = formattedFormData(currentFormData);
    const savedData = formattedFormData(initialFormData);

    // Check if all current form field values match field values already saved in application context
    return areApplicationDataEqual(
      currentFormattedFormData.permitData,
      savedData.permitData,
    );
  };

  // When "Continue" button is clicked
  const onContinue = async (data: FieldValues) => {
    const applicationToBeSaved = formattedFormData(data);
    const vehicleData = applicationToBeSaved.permitData.vehicleDetails;
    const savedVehicleDetails = await handleSaveVehicle(vehicleData);

    // Save application before continuing
    await onSaveApplication(
      (permitId) => navigate(APPLICATIONS_ROUTES.REVIEW(permitId)),
      savedVehicleDetails,
    );
  };

  const onSaveSuccess = (savedApplication: Application, status: number) => {
    snackBar.setSnackBar({
      showSnackbar: true,
      setShowSnackbar: () => true,
      message: `Application ${savedApplication.applicationNumber} ${
        status === 201 ? "created" : "updated"
      }.`,
      alertType: "success",
    });

    applicationContext.setApplicationData(savedApplication);
    return getDefaultRequiredVal("", savedApplication.permitId);
  };

  const onSaveFailure = () => {
    navigate(ERROR_ROUTES.UNEXPECTED);
  };

  // Whenever application is to be saved (either through "Save" or "Continue")
  const onSaveApplication = async (
    additionalSuccessAction?: (permitId: string) => void,
    savedVehicleInventoryDetails?: Nullable<PermitVehicleDetails>,
  ) => {
    if (
      !savedVehicleInventoryDetails &&
      typeof savedVehicleInventoryDetails !== "undefined"
    ) {
      // save vehicle to inventory failed (result is null), go to unexpected error page
      return onSaveFailure();
    }

    const applicationToBeSaved = formattedFormData(
      !savedVehicleInventoryDetails
        ? currentFormData
        : {
            ...currentFormData,
            permitData: {
              ...currentFormData.permitData,
              vehicleDetails: {
                ...savedVehicleInventoryDetails,
                saveVehicle: true,
              },
            },
          },
    );

    const { application: savedApplication, status } =
      await saveApplicationMutation.mutateAsync({
        data: applicationToBeSaved,
        companyId,
      });

    if (savedApplication) {
      const savedPermitId = onSaveSuccess(savedApplication, status);
      additionalSuccessAction?.(savedPermitId);
    } else {
      onSaveFailure();
    }
  };

  const onSave = async () => {
    await onSaveApplication((permitId) =>
      navigate(APPLICATIONS_ROUTES.DETAILS(permitId)),
    );
  };

  // Whenever "Leave" button is clicked
  const handleLeaveApplication = () => {
    if (!isApplicationSaved()) {
      setShowLeaveApplicationDialog(true);
    } else {
      navigate(APPLICATIONS_ROUTES.BASE);
    }
  };

  const handleLeaveUnsaved = () => {
    navigate(APPLICATIONS_ROUTES.BASE);
  };

  const handleStayOnApplication = () => {
    setShowLeaveApplicationDialog(false);
  };

  return (
    <div className="application-form">
      <ApplicationBreadcrumb applicationStep={APPLICATION_STEPS.DETAILS} />

      <FormProvider {...formMethods}>
        <PermitForm
          feature={FEATURE}
          onLeave={handleLeaveApplication}
          onSave={onSave}
          onContinue={handleSubmit(onContinue)}
          isAmendAction={false}
          permitNumber={currentFormData.permitNumber}
          createdDateTime={createdDateTime}
          updatedDateTime={updatedDateTime}
          vehicleOptions={vehicleOptions}
          powerUnitSubTypes={powerUnitSubTypes}
          trailerSubTypes={trailerSubTypes}
          companyInfo={companyInfo}
          durationOptions={durationOptionsForPermitType(permitType)}
          doingBusinessAs={doingBusinessAs}
          pastStartDateStatus={
            isStaffUser
              ? PAST_START_DATE_STATUSES.WARNING
              : PAST_START_DATE_STATUSES.FAIL
          }
          isLcvDesignated={isLcvDesignated}
        />
      </FormProvider>

      <LeaveApplicationDialog
        onLeaveUnsaved={handleLeaveUnsaved}
        onContinueEditing={handleStayOnApplication}
        showDialog={showLeaveApplicationDialog}
      />
    </div>
  );
};
