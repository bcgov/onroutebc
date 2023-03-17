import React from "react";
import { ManageVehiclesDashboard } from "./components/dashboard/ManageVehiclesDashboard";

/**
 * React component to render the vehicle inventory
 */
export const ManageVehicles = React.memo(() => {
  return <ManageVehiclesDashboard />;
});

ManageVehicles.displayName = "ManageVehicles";
