import React from "react";
import { Authentication } from "../../common/authentication/Authentication";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../../common/pages/ErrorFallback";

export const InitialLandingPage = React.memo(() => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Authentication />
    </ErrorBoundary>
  );
});

InitialLandingPage.displayName = "InitialLandingPage";
