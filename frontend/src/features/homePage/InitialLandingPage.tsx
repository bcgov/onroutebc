import React from "react";
import { useAuth } from "react-oidc-context";
import { Authentication } from "../../common/authentication/Authentication";
import { HomePage } from "./HomePage";

export const InitialLandingPage = React.memo(() => {
  return (
    <Authentication>
      <div style={{ padding: "0px 60px", height: "100vh" }}>
        <br></br>
        <HomePage></HomePage>
      </div>
    </Authentication>
  );
});

InitialLandingPage.displayName = "InitialLandingPage";
