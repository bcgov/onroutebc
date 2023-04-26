import React from "react";
import { ApplicationDashboard } from "./components/dashboard/ApplicationDashboard";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../../common/pages/ErrorFallback";

export const ManagePermits = React.memo(() => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ApplicationDashboard />
    </ErrorBoundary>
  );
});

ManagePermits.displayName = "ManagePermits";
