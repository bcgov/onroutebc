import React from "react";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ManageVehiclesProvider } from "./context/VehiclesContext";

export const ManageVehicles = React.memo(() => {
  return (
    <ManageVehiclesProvider>
      <Dashboard />
    </ManageVehiclesProvider>
  );
});

ManageVehicles.displayName = "ManageVehicles";
