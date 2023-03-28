import React from "react";
import { Authentication } from "../../common/authentication/Authentication";

export const HomePage = React.memo(() => {
  const DEPLOY_ENV =
    import.meta.env.VITE_DEPLOY_ENVIRONMENT ||
    envConfig.VITE_DEPLOY_ENVIRONMENT;

  return (
    <Authentication>
      <div style={{ padding: "0px 60px", height: "100vh" }}>
        <p>OnRouteBC Home -{DEPLOY_ENV}- Environment</p>
      </div>
    </Authentication>
  );
});

HomePage.displayName = "HomePage";
