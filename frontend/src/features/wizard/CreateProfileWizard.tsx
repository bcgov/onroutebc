import React from "react";
import { CreateProfileSteps } from "./components/dashboard/CreateProfileSteps";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../../common/pages/ErrorFallback";
import { ChallengeProfileSteps } from "./components/dashboard/ChallengeProfileSteps";

export const CreateProfileWizard = React.memo(() => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {/* <CreateProfileSteps /> */}
      <ChallengeProfileSteps />
    </ErrorBoundary>
  );
});

CreateProfileWizard.displayName = "CreateProfileWizard";
