import React from "react";
import { ErrorBoundary } from "react-error-boundary";

import { PermitLists } from "./components/dashboard/PermitLists";
import { ErrorFallback } from "../../common/pages/ErrorFallback";

export const PermitDashboard = React.memo(() => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <PermitLists />
    </ErrorBoundary>
  );
});

PermitDashboard.displayName = "PermitDashboard";
