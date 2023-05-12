import React from "react";
import { ManageApplicationDashboard } from "./components/dashboard/ManageApplicationDashboard";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../../common/pages/ErrorFallback";

export const ManageApplications = React.memo(() => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ManageApplicationDashboard />
    </ErrorBoundary>
  );
});

ManageApplications.displayName = "ManageApplications";
