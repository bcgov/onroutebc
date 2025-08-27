import { FormProvider } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { useContext, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { isAxiosError } from "axios";

import "./ApplicationForm.scss";
import { Application, ApplicationFormData } from "../../types/application";
import { ApplicationContext } from "../../context/ApplicationContext";
import { ApplicationBreadcrumb } from "../../components/application-breadcrumb/ApplicationBreadcrumb";
import { useSaveApplicationMutation } from "../../hooks/hooks";
import { SnackBarContext } from "../../../../App";
import { LeaveApplicationDialog } from "../../components/dialog/LeaveApplicationDialog";
import { areApplicationPermitDataEqual } from "../../helpers/equality";
import { useInitApplicationFormData } from "../../hooks/form/useInitApplicationFormData";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { PermitForm } from "./components/form/PermitForm";
import { usePermitVehicleManagement } from "../../hooks/usePermitVehicleManagement";
import { useCompanyInfoDetailsQuery } from "../../../manageProfile/apiManager/hooks";
import {
  isNull,
  isUndefined,
  Nullable,
  ORBC_FORM_FEATURES,
} from "../../../../common/types/common";
import { PermitType } from "../../types/PermitType";
import { PermitVehicleDetails } from "../../types/PermitVehicleDetails";
import { durationOptionsForPermitType } from "../../helpers/dateSelection";
import { useFetchLOAs } from "../../../settings/hooks/LOA";
import { useFetchSpecialAuthorizations } from "../../../settings/hooks/specialAuthorizations";
import { ApplicationFormContext } from "../../context/ApplicationFormContext";
import {
  filterLOAsForPermitType,
  filterNonExpiredLOAs,
} from "../../helpers/permitLOA";
import { usePolicyEngine } from "../../../policy/hooks/usePolicyEngine";
import { Loading } from "../../../../common/pages/Loading";
import { serializePermitVehicleDetails } from "../../helpers/serialize/serializePermitVehicleDetails";
import { serializePermitData } from "../../helpers/serialize/serializePermitData";
import { deserializeApplicationResponse } from "../../helpers/serialize/deserializeApplication";
import {
  serializeForCreateApplication,
  serializeForUpdateApplication,
} from "../../helpers/serialize/serializeApplication";

import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../common/helpers/util";

import {
  APPLICATIONS_ROUTES,
  APPLICATION_QUEUE_ROUTES,
  APPLICATION_STEPS,
  APPLICATION_STEP_CONTEXTS,
  ApplicationStepContext,
  ERROR_ROUTES,
  IDIR_ROUTES,
} from "../../../../routes/constants";
import { useApplicationInQueueMetadata } from "../../../queue/hooks/hooks";
import { UnavailableApplicationModal } from "../../../queue/components/UnavailableApplicationModal";
import { shouldOverridePolicyInvalidSubtype } from "../../helpers/vehicles/subtypes/shouldOverridePolicyInvalidSubtype";
import { shouldOverridePolicyViolations } from "../../helpers/policy/shouldOverridePolicyViolations";
import { PAST_START_DATE_STATUSES } from "../../../../common/types/PastStartDateStatus";

const FEATURE = ORBC_FORM_FEATURES.APPLICATION;

/**
 * The first step in creating or saving an Application.
 * @returns A form component for users to save an Application
 */
export const ApplicationForm = ({
  permitType,
  companyId,
  applicationStepContext,
}: {
  permitType: PermitType;
  companyId: number;
  applicationStepContext: ApplicationStepContext;
}) => {
  // Context to hold all of the application data related to the application
  const applicationContext = useContext(ApplicationContext);

  const { userDetails, idirUserDetails } = useContext(OnRouteBCContext);

  const isStaffUser = Boolean(idirUserDetails?.userRole);
  const { data: companyInfo } = useCompanyInfoDetailsQuery(companyId);

  const { data: activeLOAs } = useFetchLOAs(companyId, false);
  const companyLOAs = useMemo(
    () => getDefaultRequiredVal([], activeLOAs),
    [activeLOAs],
  );

  const { data: specialAuthorizations } =
    useFetchSpecialAuthorizations(companyId);
  const isLcvDesignated = Boolean(specialAuthorizations?.isLcvAllowed);

  const {
    handleSaveVehicle,
    allVehiclesFromInventory,
    powerUnitSubtypeNamesMap,
    trailerSubtypeNamesMap,
  } = usePermitVehicleManagement(companyId);

  const policyEngine = usePolicyEngine(specialAuthorizations);

  // Use a custom hook that performs the following whenever page is rendered (or when application context is updated/changed):
  // 1. Get all data needed to initialize the application form (from application context, company, user details)
  // 2. Generate those default values and register them to the form
  // 3. Listens for changes to application context (which happens when application is fetched/submitted/updated)
  // 4. Updates form values (override existing ones) whenever the application context data changes
  const { initialFormData, currentFormData, formMethods } =
    useInitApplicationFormData({
      permitType,
      isLcvDesignated,
      companyLOAs,
      inventoryVehicles: allVehiclesFromInventory,
      companyInfo,
      applicationData: applicationContext?.applicationData,
      userDetails,
      policyEngine,
      isStaff: isStaffUser,
    });

  // Applicable LOAs must be:
  // 1. Applicable for the current permit type
  // 2. Have expiry date that is on or after the start date for an application
  const applicableLOAs = filterNonExpiredLOAs(
    filterLOAsForPermitType(companyLOAs, permitType),
    currentFormData.permitData.startDate,
  );

  const createdDateTime = applyWhenNotNullable(
    (date) => dayjs(date),
    applicationContext?.applicationData?.createdDateTime,
  );

  const updatedDateTime = applyWhenNotNullable(
    (date) => dayjs(date),
    applicationContext?.applicationData?.updatedDateTime,
  );

  const { mutateAsync: saveApplication } = useSaveApplicationMutation();
  const snackBar = useContext(SnackBarContext);

  // Show leave application dialog
  const [showLeaveApplicationDialog, setShowLeaveApplicationDialog] =
    useState<boolean>(false);

  const { handleSubmit } = formMethods;

  const navigate = useNavigate();

  const [policyViolations, setPolicyViolations] = useState<
    Record<string, string>
  >({});

  const clearViolation = (fieldReference: string) => {
    if (fieldReference in policyViolations) {
      const otherViolations = Object.entries(policyViolations).filter(
        ([fieldRef]) => fieldRef !== fieldReference,
      );

      setPolicyViolations(Object.fromEntries(otherViolations));
    }
  };

  const triggerPolicyValidation = async () => {
    const validationResults = await policyEngine?.validate(
      currentFormData.permitId
        ? serializeForUpdateApplication(currentFormData)
        : serializeForCreateApplication(currentFormData),
    );

    const violations = getDefaultRequiredVal(
      [],
      validationResults?.violations
        .filter(({ fieldReference }) => Boolean(fieldReference))
        .map((violation) => ({
          fieldReference: violation.fieldReference as string,
          message: violation.message,
        })),
    );

    const policyViolations = Object.fromEntries(
      violations.map(({ fieldReference, message }) => [
        fieldReference,
        message,
      ]),
    );

    // Check if vehicle subtype violations can be overriden by LOA
    const updatedViolations = shouldOverridePolicyInvalidSubtype(
      policyViolations,
      currentFormData.permitData.vehicleDetails.vehicleSubType,
      currentFormData.permitData.loas,
    )
      ? Object.fromEntries(
          Object.entries(policyViolations).filter(
            ([fieldReference]) =>
              fieldReference !== "permitData.vehicleDetails.vehicleSubType",
          ),
        )
      : policyViolations;

    setPolicyViolations(updatedViolations);
    return updatedViolations;
  };

  const isQueueContext =
    applicationStepContext === APPLICATION_STEP_CONTEXTS.QUEUE;

  const { refetch: refetchApplicationMetadata } = useApplicationInQueueMetadata(
    {
      applicationId: getDefaultRequiredVal("", currentFormData.permitId),
      companyId,
    },
  );

  const [assignedUser, setAssignedUser] = useState<string>("");

  const [showUnavailableApplicationModal, setShowUnavailableApplicationModal] =
    useState<boolean>(false);

  const handleCloseApplication = () => {
    navigate(IDIR_ROUTES.STAFF_HOME);
  };

  // Check to see if all application values were already saved
  const isApplicationSaved = () => {
    // Check if all current form field values match field values already saved in application context
    return areApplicationPermitDataEqual(
      serializePermitData(currentFormData.permitData),
      serializePermitData(initialFormData.permitData),
    );
  };

  // When "Continue" button is clicked
  const onContinue = async (data: ApplicationFormData) => {
    const updatedViolations = await triggerPolicyValidation();

    // If there are policy engine validation errors, form validation fails unless those violations
    // can be overriden
    if (
      !shouldOverridePolicyViolations(
        updatedViolations,
        isStaffUser,
        data.permitType,
      )
    ) {
      console.error(updatedViolations);
      return;
    }

    const vehicleData = serializePermitVehicleDetails(
      data.permitData.vehicleDetails,
    );

    const savedVehicleDetails = await handleSaveVehicle(vehicleData);

    // Save application before continuing
    await onSaveApplication((permitId) => {
      return navigate(
        isQueueContext
          ? APPLICATION_QUEUE_ROUTES.REVIEW(companyId, permitId)
          : APPLICATIONS_ROUTES.REVIEW(permitId),
      );
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

  // Whenever application is to be saved (either through "Save" or "Continue")
  const onSaveApplication = async (
    additionalSuccessAction?: (permitId: string) => void,
    savedVehicleInventoryDetails?: Nullable<PermitVehicleDetails>,
  ) => {
    if (isNull(savedVehicleInventoryDetails)) {
      return navigate(ERROR_ROUTES.UNEXPECTED);
    }

    if (isQueueContext) {
      const { data: applicationMetaData } = await refetchApplicationMetadata();

      if (idirUserDetails?.userName !== applicationMetaData?.assignedUser) {
        setAssignedUser(
          getDefaultRequiredVal("", applicationMetaData?.assignedUser),
        );
        setShowUnavailableApplicationModal(true);
        return;
      }
    }

    const applicationToBeSaved = !savedVehicleInventoryDetails
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
        };

    await saveApplication(
      {
        data: applicationToBeSaved,
        companyId,
      },
      {
        onSuccess: ({ data, status }) => {
          const savedApplication = deserializeApplicationResponse(data);
          const savedPermitId = onSaveSuccess(savedApplication, status);
          additionalSuccessAction?.(savedPermitId);
        },
        onError: (e) => {
          console.error(e);
          if (isAxiosError(e)) {
            navigate(ERROR_ROUTES.UNEXPECTED, {
              state: {
                correlationId: e?.response?.headers["x-correlation-id"],
              },
            });
          } else {
            navigate(ERROR_ROUTES.UNEXPECTED);
          }
        },
      },
    );
  };

  const onSave = async () => {
    await onSaveApplication((permitId) =>
      navigate(
        isQueueContext
          ? APPLICATION_QUEUE_ROUTES.EDIT(companyId, permitId)
          : APPLICATIONS_ROUTES.DETAILS(permitId),
      ),
    );
  };

  // Whenever "Leave" button is clicked
  const handleLeaveApplication = () => {
    if (!isApplicationSaved()) {
      setShowLeaveApplicationDialog(true);
    } else {
      navigate(
        isQueueContext ? IDIR_ROUTES.STAFF_HOME : APPLICATIONS_ROUTES.BASE,
      );
    }
  };

  const handleLeaveUnsaved = () => {
    navigate(
      isQueueContext ? IDIR_ROUTES.STAFF_HOME : APPLICATIONS_ROUTES.BASE,
    );
  };

  const handleStayOnApplication = () => {
    setShowLeaveApplicationDialog(false);
  };

  const durationOptions = durationOptionsForPermitType(permitType, isStaffUser);
  const pastStartDateStatus = isStaffUser
    ? PAST_START_DATE_STATUSES.WARNING
    : PAST_START_DATE_STATUSES.FAIL;

  const rejectionHistory = getDefaultRequiredVal(
    [],
    applicationContext.applicationData?.rejectionHistory,
  );

  const datePickerRef = useRef<HTMLDivElement | null>(null);

  const applicationFormContextData = useMemo(
    () => ({
      initialFormData,
      formData: currentFormData,
      policyEngine,
      durationOptions,
      allVehiclesFromInventory,
      powerUnitSubtypeNamesMap,
      trailerSubtypeNamesMap,
      isLcvDesignated,
      feature: FEATURE,
      companyInfo,
      isAmendAction: false,
      isStaff: isStaffUser,
      createdDateTime,
      updatedDateTime,
      datePickerRef,
      pastStartDateStatus,
      companyLOAs: applicableLOAs,
      revisionHistory: [],
      rejectionHistory,
      policyViolations,
      clearViolation,
      triggerPolicyValidation,
      onLeave: handleLeaveApplication,
      onSave,
      onCancel: undefined,
      onContinue: handleSubmit(onContinue, () => {
        if (pastStartDateStatus === PAST_START_DATE_STATUSES.FAIL) {
          datePickerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }),
    }),
    [
      initialFormData,
      currentFormData,
      policyEngine,
      durationOptions,
      allVehiclesFromInventory,
      powerUnitSubtypeNamesMap,
      trailerSubtypeNamesMap,
      isLcvDesignated,
      companyInfo,
      isStaffUser,
      createdDateTime,
      updatedDateTime,
      datePickerRef,
      pastStartDateStatus,
      applicableLOAs,
      rejectionHistory,
      policyViolations,
      clearViolation,
      triggerPolicyValidation,
      handleLeaveApplication,
      onSave,
      onContinue,
    ],
  );

  if (isUndefined(policyEngine)) return <Loading />;
  if (isNull(policyEngine)) return <Navigate to={ERROR_ROUTES.UNEXPECTED} />;

  return (
    <div className="application-form">
      <ApplicationBreadcrumb applicationStep={APPLICATION_STEPS.DETAILS} />

      <FormProvider {...formMethods}>
        <ApplicationFormContext.Provider value={applicationFormContextData}>
          <PermitForm />
        </ApplicationFormContext.Provider>
      </FormProvider>

      <LeaveApplicationDialog
        onLeaveUnsaved={handleLeaveUnsaved}
        onContinueEditing={handleStayOnApplication}
        showDialog={showLeaveApplicationDialog}
      />

      {showUnavailableApplicationModal && (
        <UnavailableApplicationModal
          showModal={showUnavailableApplicationModal}
          onCancel={() => setShowUnavailableApplicationModal(false)}
          onConfirm={handleCloseApplication}
          assignedUser={assignedUser}
        />
      )}
    </div>
  );
};
