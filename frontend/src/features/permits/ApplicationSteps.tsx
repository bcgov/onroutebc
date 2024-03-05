import React from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ApplicationStepPage } from "./components/dashboard/ApplicationStepPage";
import { ErrorFallback } from "../../common/pages/ErrorFallback";
import { ApplicationStep } from "../../routes/constants";

export const ApplicationSteps = React.memo(
  ({ applicationStep }: { applicationStep: ApplicationStep }) => {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ApplicationStepPage applicationStep={applicationStep} />
      </ErrorBoundary>
    );
  },
);

ApplicationSteps.displayName = "ApplicationSteps";
