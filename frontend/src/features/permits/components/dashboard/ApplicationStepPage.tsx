import { Box } from "@mui/material";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { useMemo } from "react";

import "../../../../common/components/dashboard/Dashboard.scss";
import { Banner } from "../../../../common/components/dashboard/components/banner/Banner";
import { ApplicationForm } from "../../pages/Application/ApplicationForm";
import { ApplicationContext } from "../../context/ApplicationContext";
import { getCompanyIdFromSession } from "../../../../common/apiManager/httpRequestHandler";
import { Loading } from "../../../../common/pages/Loading";
import { useApplicationForStepsQuery } from "../../hooks/hooks";
import { PERMIT_STATUSES } from "../../types/PermitStatus";
import { useFeatureFlagsQuery } from "../../../../common/hooks/hooks";
import { ApplicationReview } from "../../pages/Application/ApplicationReview";
import { usePermissionMatrix } from "../../../../common/authentication/PermissionMatrix";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../common/helpers/util";

import {
  DEFAULT_PERMIT_TYPE,
  PERMIT_TYPES,
  PermitType,
  isPermitTypeValid,
} from "../../types/PermitType";

import {
  ACTION_ORIGIN_PARAM,
  APPLICATION_STEP_CONTEXTS,
  APPLICATION_STEPS,
  ApplicationStep,
  ApplicationStepContext,
  ERROR_ROUTES,
  IS_COPIED_APPLICATION_PARAM,
} from "../../../../routes/constants";

const displayHeaderText = (stepKey: ApplicationStep) => {
  switch (stepKey) {
    case APPLICATION_STEPS.DETAILS:
      return "Permit Application";
    case APPLICATION_STEPS.REVIEW:
      return "Review and Confirm Details";
    case APPLICATION_STEPS.HOME:
    default:
      return "Permits";
  }
};

export const ApplicationStepPage = ({
  applicationStep,
  applicationStepContext,
}: {
  applicationStep: ApplicationStep;
  applicationStepContext: ApplicationStepContext;
}) => {
  // Get application number from route, if there is one (for edit applications)
  // or get the permit type for creating a new application
  const { permitId, permitType, companyId: companyIdParam } = useParams();
  const [searchParams] = useSearchParams();
  const copyPermitOrigin = searchParams.get(ACTION_ORIGIN_PARAM);
  const isCopiedApplication = applyWhenNotNullable(
    (isCopiedParam) => isCopiedParam === "true",
    searchParams.get(IS_COPIED_APPLICATION_PARAM),
    false,
  );

  const companyId: number = getDefaultRequiredVal(
    0,
    applyWhenNotNullable((id) => Number(id), companyIdParam),
    applyWhenNotNullable((id) => Number(id), getCompanyIdFromSession()),
  );

  const { data: featureFlags } = useFeatureFlagsQuery();
  const enableSTOS = featureFlags?.["STOS"] === "ENABLED";
  const enableSTOW = featureFlags?.["STOW"] === "ENABLED";
  const enableMFP = featureFlags?.["MFP"] === "ENABLED";
  const enableSTFR = featureFlags?.["STFR"] === "ENABLED";
  const enableQRFR = featureFlags?.["QRFR"] === "ENABLED";
  const enableNRSCV = featureFlags?.["NRSCV"] === "ENABLED";
  const enableNRQCV = featureFlags?.["NRQCV"] === "ENABLED";

  // Query for the application data whenever this page is rendered
  const {
    applicationData,
    setApplicationData,
    shouldEnableQuery,
    isInvalidRoute,
  } = useApplicationForStepsQuery({
    applicationStep,
    permitId,
    permitType,
    companyId,
  });

  const contextData = useMemo(
    () => ({
      applicationData,
      setApplicationData,
    }),
    [applicationData, setApplicationData],
  );

  const isLoading = shouldEnableQuery && typeof applicationData === "undefined";

  const isInvalidApplication =
    (typeof applicationData !== "undefined" && !applicationData) ||
    isInvalidRoute;

  const applicationPermitType = getDefaultRequiredVal(
    DEFAULT_PERMIT_TYPE,
    isPermitTypeValid(permitType)
      ? (permitType?.toUpperCase() as PermitType)
      : null, // when permitType in the url param is empty or not a valid permit type
    applicationData?.permitType,
  );

  // Currently onRouteBC only handles TROS and TROW permits
  // other permit types are only allowed if its feature flag is enabled
  const isPermitTypeAllowed = () => {
    const allowedPermitTypes: string[] = (
      [PERMIT_TYPES.TROS, PERMIT_TYPES.TROW] as string[]
    )
      .concat(enableSTOS ? [PERMIT_TYPES.STOS] : [])
      .concat(enableSTOW ? [PERMIT_TYPES.STOW] : [])
      .concat(enableMFP ? [PERMIT_TYPES.MFP] : [])
      .concat(enableSTFR ? [PERMIT_TYPES.STFR] : [])
      .concat(enableQRFR ? [PERMIT_TYPES.QRFR] : [])
      .concat(enableNRSCV ? [PERMIT_TYPES.NRSCV] : [])
      .concat(enableNRQCV ? [PERMIT_TYPES.NRQCV] : []);

    return allowedPermitTypes.includes(applicationPermitType);
  };

  // Permit status must be one of the following in order to be considered valid to be processed here:
  // a) Has no status, indicating that the application is brand new and hasn't been saved yet
  // b) In application in progress status, meaning that the application is saved but not processed nor issued
  // c) Application is in queue
  // d) Permit status can be ignored only if the application is being copied from another permit
  const isValidApplicationStatus = () => {
    return (
      !isInvalidApplication && (
        (
          applicationStepContext === APPLICATION_STEP_CONTEXTS.COPY &&
          (
            typeof applicationData === "undefined" ||
            applicationData?.permitStatus === PERMIT_STATUSES.ISSUED ||
            applicationData?.permitStatus === PERMIT_STATUSES.IN_PROGRESS
          )
        ) ||
        (
          applicationStepContext !== APPLICATION_STEP_CONTEXTS.COPY &&
          (
            !applicationData?.permitStatus ||
            applicationData?.permitStatus === PERMIT_STATUSES.IN_PROGRESS ||
            applicationData?.permitStatus === PERMIT_STATUSES.IN_QUEUE
          )
        )
      )
    );
  };

  const canEditIndividualApplicationInProgressDetails = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "MANAGE_PERMITS",
      permissionMatrixFunctionKey:
        "EDIT_INDIVIDUAL_APPLICATION_IN_PROGRESS_DETAILS",
    },
  });

  const renderApplicationStep = () => {
    if (applicationStep === APPLICATION_STEPS.REVIEW) {
      return (
        <ApplicationReview
          applicationStepContext={applicationStepContext}
          isCopiedApplication={isCopiedApplication}
          copyPermitOrigin={copyPermitOrigin}
        />
      );
    }
    return (
      <ApplicationForm
        permitType={applicationPermitType}
        companyId={companyId}
        applicationStepContext={applicationStepContext}
        isCopiedApplication={isCopiedApplication}
        copyPermitOrigin={copyPermitOrigin}
      />
    );
  };

  if (
    // add permissions matrix check here
    isInvalidApplication ||
    !isValidApplicationStatus() ||
    !companyId ||
    !isPermitTypeAllowed() ||
    !canEditIndividualApplicationInProgressDetails
  ) {
    console.error("The application cannot be displayed or edited");
    return <Navigate to={ERROR_ROUTES.UNEXPECTED} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ApplicationContext.Provider value={contextData}>
      <Box
        className="layout-box"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Banner bannerText={displayHeaderText(applicationStep)} />
      </Box>

      {renderApplicationStep()}
    </ApplicationContext.Provider>
  );
};
