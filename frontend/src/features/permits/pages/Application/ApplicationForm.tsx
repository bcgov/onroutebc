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
import { PERMIT_DURATION_OPTIONS } from "../../constants/constants";
import { Nullable } from "../../../../common/types/common";
import { PermitType } from "../../types/PermitType";
import { PermitVehicleDetails } from "../../types/PermitVehicleDetails";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../common/helpers/util";

import {
  APPLICATIONS_ROUTES,
  APPLICATION_STEPS,
  ERROR_ROUTES,
  withCompanyId,
} from "../../../../routes/constants";

/**
 * The first step in creating and submitting an Application.
 * @returns A form for users to create an Application
 */
export const ApplicationForm = ({ permitType }: { permitType: PermitType }) => {
  // The name of this feature that is used for id's, keys, and associating form components
  const FEATURE = "application";

  // Context to hold all of the application data related to the application
  const applicationContext = useContext(ApplicationContext);

  const {
    companyId,
    companyLegalName,
    userDetails,
    idirUserDetails,
    onRouteBCClientNumber,
  } = useContext(OnRouteBCContext);

  const isStaffActingAsCompany = Boolean(idirUserDetails?.userAuthGroup);
  const doingBusinessAs =
    isStaffActingAsCompany && companyLegalName ? companyLegalName : "";

  const companyInfoQuery = useCompanyInfoQuery();

  // Use a custom hook that performs the following whenever page is rendered (or when application context is updated/changed):
  // 1. Get all data needed to generate default values for the application form (from application context, company, user details)
  // 2. Generate those default values and register them to the form
  // 3. Listens for changes to application context (which happens when application is fetched/submitted/updated)
  // 4. Updates form default values when application context data values change
  const {
    defaultApplicationDataValues: applicationDefaultValues,
    formMethods,
  } = useDefaultApplicationFormData(
    permitType,
    applicationContext?.applicationData,
    companyId,
    userDetails,
    companyInfoQuery.data,
  );

  const createdDateTime = applyWhenNotNullable(
    (date) => dayjs(date),
    applicationContext?.applicationData?.createdDateTime,
  );

  const updatedDateTime = applyWhenNotNullable(
    (date) => dayjs(date),
    applicationContext?.applicationData?.updatedDateTime,
  );

  const companyInfo = companyInfoQuery.data;

  const saveApplicationMutation = useSaveApplicationMutation();
  const snackBar = useContext(SnackBarContext);

  const {
    handleSaveVehicle,
    vehicleOptions,
    powerUnitSubTypes,
    trailerSubTypes,
  } = usePermitVehicleManagement();

  // Show leave application dialog
  const [showLeaveApplicationDialog, setShowLeaveApplicationDialog] =
    useState<boolean>(false);

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
          year: !isNaN(Number(data.permitData.vehicleDetails.year))
            ? Number(data.permitData.vehicleDetails.year)
            : data.permitData.vehicleDetails.year,
        },
      },
    } as ApplicationFormData;
  };

  // Check to see if all application values were already saved
  const isApplicationSaved = () => {
    const currentFormData = applicationFormData(getValues());
    const savedData = applicationContext.applicationData;
    if (!savedData) return false;

    // Check if all current form field values match field values already saved in application context
    return areApplicationDataEqual(
      currentFormData.permitData,
      savedData.permitData,
    );
  };

  // When "Continue" button is clicked
  const onContinue = async (data: FieldValues) => {
    const applicationToBeSaved = applicationFormData(data);
    const vehicleData = applicationToBeSaved.permitData.vehicleDetails;
    const savedVehicleDetails = await handleSaveVehicle(vehicleData);

    // Save application before continuing
    await onSaveApplication((permitId) => {
      console.log("APPLICATIONS_ROUTES.REVIEW::", APPLICATIONS_ROUTES.REVIEW());
      console.log(
        "withCompanyId(APPLICATIONS_ROUTES.REVIEW(permitId))::",
        withCompanyId(APPLICATIONS_ROUTES.REVIEW("2028")),
      );
      return navigate(withCompanyId(APPLICATIONS_ROUTES.REVIEW(permitId)));
    }, savedVehicleDetails);
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

    const formValues = getValues();
    const applicationToBeSaved = applicationFormData(
      !savedVehicleInventoryDetails
        ? formValues
        : {
            ...formValues,
            permitData: {
              ...formValues.permitData,
              vehicleDetails: {
                ...savedVehicleInventoryDetails,
                saveVehicle: true,
              },
            },
          },
    );

    const { application: savedApplication, status } =
      await saveApplicationMutation.mutateAsync(applicationToBeSaved);

    if (savedApplication) {
      const savedPermitId = onSaveSuccess(savedApplication, status);
      additionalSuccessAction?.(savedPermitId);
    } else {
      onSaveFailure();
    }
  };

  const onSave = async () => {
    await onSaveApplication((permitId) =>
      navigate(withCompanyId(APPLICATIONS_ROUTES.DETAILS(permitId))),
    );
  };

  // Whenever "Leave" button is clicked
  const handleLeaveApplication = () => {
    if (!isApplicationSaved()) {
      setShowLeaveApplicationDialog(true);
    } else {
      navigate(withCompanyId(APPLICATIONS_ROUTES.BASE));
    }
  };

  const handleLeaveUnsaved = () => {
    navigate(withCompanyId(APPLICATIONS_ROUTES.BASE));
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
          permitType={applicationDefaultValues.permitType}
          applicationNumber={applicationDefaultValues.applicationNumber}
          permitNumber={applicationDefaultValues.permitNumber}
          createdDateTime={createdDateTime}
          updatedDateTime={updatedDateTime}
          permitStartDate={applicationDefaultValues.permitData.startDate}
          permitDuration={applicationDefaultValues.permitData.permitDuration}
          permitCommodities={applicationDefaultValues.permitData.commodities}
          vehicleDetails={applicationDefaultValues.permitData.vehicleDetails}
          vehicleOptions={vehicleOptions}
          powerUnitSubTypes={powerUnitSubTypes}
          trailerSubTypes={trailerSubTypes}
          companyInfo={companyInfo}
          durationOptions={PERMIT_DURATION_OPTIONS}
          doingBusinessAs={doingBusinessAs}
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
