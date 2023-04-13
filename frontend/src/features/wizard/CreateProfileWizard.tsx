import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CreateProfileSteps } from "./components/dashboard/CreateProfileSteps";

export const CreateProfileWizard = React.memo(() => {
  const createProfileQueryClient = new QueryClient();

  return (
    <QueryClientProvider client={createProfileQueryClient}>
      <CreateProfileSteps />
    </QueryClientProvider>
  );
});

CreateProfileWizard.displayName = "CreateProfileWizard";
