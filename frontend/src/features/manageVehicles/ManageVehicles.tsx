import React from "react";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ManageVehiclesProvider } from "./context/VehiclesContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * React component to render the vehicle inventory
 */
export const ManageVehicles = React.memo(() => {
  const manageVehicleQueryClient = new QueryClient();

  return (
    <ManageVehiclesProvider>
      <QueryClientProvider client={manageVehicleQueryClient}>
        <Dashboard />
      </QueryClientProvider>
    </ManageVehiclesProvider>
  );
});

ManageVehicles.displayName = "ManageVehicles";
