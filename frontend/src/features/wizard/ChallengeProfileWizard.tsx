import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../../common/pages/ErrorFallback";
import { ChallengeProfileSteps } from "./components/dashboard/ChallengeProfileSteps";

export const ChallengeProfileWizard = React.memo(() => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ChallengeProfileSteps />
    </ErrorBoundary>
  );
});

ChallengeProfileWizard.displayName = "ChallengeProfileWizard";
