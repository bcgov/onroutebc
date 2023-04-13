import React from "react";
import { Authentication } from "../../common/authentication/Authentication";

export const InitialLandingPage = React.memo(() => {
  return (
    <Authentication />
  );
});

InitialLandingPage.displayName = "InitialLandingPage";
