import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ManageProfilesDashboard } from "./components/dashboard/ManageProfilesDashboard";

export const ManageProfiles = React.memo(() => {
  const manageProfileQueryClient = new QueryClient();

  return (
    <QueryClientProvider client={manageProfileQueryClient}>
      <ManageProfilesDashboard />
    </QueryClientProvider>
  );
});

ManageProfiles.displayName = "ManageProfiles";
