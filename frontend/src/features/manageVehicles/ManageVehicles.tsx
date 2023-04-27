import React from "react";
import { ManageVehiclesDashboard } from "./components/dashboard/ManageVehiclesDashboard";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../../common/pages/ErrorFallback";

/**
 * React component to render the vehicle inventory
 */
export const ManageVehicles = React.memo(() => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ManageVehiclesDashboard />
    </ErrorBoundary>
  );
});

ManageVehicles.displayName = "ManageVehicles";
