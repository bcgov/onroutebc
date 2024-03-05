import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../../common/pages/ErrorFallback";
import { CreateProfileSteps } from "./components/dashboard/CreateProfileSteps";

export const CreateProfileWizard = React.memo(() => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CreateProfileSteps />
    </ErrorBoundary>
  );
});

CreateProfileWizard.displayName = "CreateProfileWizard";
