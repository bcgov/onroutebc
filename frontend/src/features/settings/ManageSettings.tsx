import React from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ManageSettingsDashboard } from "./components/dashboard/ManageSettingsDashboard";
import { ErrorFallback } from "../../common/pages/ErrorFallback";

export const ManageSettings = React.memo(() => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ManageSettingsDashboard />
    </ErrorBoundary>
  );
});

ManageSettings.displayName = "ManageSettings";
