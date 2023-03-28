import React from "react";
import { useAuth } from "react-oidc-context";
import { Authentication } from "../../common/authentication/Authentication";
import { HomePage2 } from "./HomePage2";

export const HomePage = React.memo(() => {
  const DEPLOY_ENV =
    import.meta.env.VITE_DEPLOY_ENVIRONMENT ||
    envConfig.VITE_DEPLOY_ENVIRONMENT;

  return (
    <Authentication>
      <div style={{ padding: "0px 60px", height: "100vh" }}>
        <br></br>
        <HomePage2></HomePage2>
      </div>
    </Authentication>
  );
});

HomePage.displayName = "HomePage";
