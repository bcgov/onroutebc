import React from "react";
import { CreateProfileSteps } from "./components/dashboard/CreateProfileSteps";

export const CreateProfileWizard = React.memo(() => {

  return (
      <CreateProfileSteps />
  );
});

CreateProfileWizard.displayName = "CreateProfileWizard";
