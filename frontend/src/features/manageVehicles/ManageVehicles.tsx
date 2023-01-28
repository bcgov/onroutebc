import React from "react";
import { ManageVehiclesProvider } from "./context/VehiclesContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ManageVehiclesDashboard } from "./components/dashboard/ManageVehiclesDashboard";

/**
 * React component to render the vehicle inventory
 */
export const ManageVehicles = React.memo(() => {
  const manageVehicleQueryClient = new QueryClient();
  return (
    <ManageVehiclesProvider>
      <QueryClientProvider client={manageVehicleQueryClient}>
        <ManageVehiclesDashboard />
      </QueryClientProvider>
    </ManageVehiclesProvider>
  );
});

ManageVehicles.displayName = "ManageVehicles";
