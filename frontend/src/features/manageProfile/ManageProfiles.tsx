import React from "react";
import { ManageProfilesDashboard } from "./components/dashboard/ManageProfilesDashboard";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../../common/pages/ErrorFallback";

export const ManageProfiles = React.memo(() => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ManageProfilesDashboard />
    </ErrorBoundary>
  );
});

ManageProfiles.displayName = "ManageProfiles";
