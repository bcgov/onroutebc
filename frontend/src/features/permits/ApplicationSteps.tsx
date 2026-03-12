import React from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ApplicationStepPage } from "./components/dashboard/ApplicationStepPage";
import { ErrorFallback } from "../../common/pages/ErrorFallback";
import {
  ApplicationStep,
  ApplicationStepContext,
} from "../../routes/constants";

export const ApplicationSteps = React.memo(
  ({
    applicationStep,
    applicationStepContext,
    isStaffNotActingAsCompany,
  }: {
    applicationStep: ApplicationStep;
    applicationStepContext: ApplicationStepContext;
    isStaffNotActingAsCompany: boolean;
  }) => {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ApplicationStepPage
          applicationStep={applicationStep}
          applicationStepContext={applicationStepContext}
          isStaffNotActingAsCompany={isStaffNotActingAsCompany}
        />
      </ErrorBoundary>
    );
  },
);

ApplicationSteps.displayName = "ApplicationSteps";
