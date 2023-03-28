import React from "react";
import { useAuth } from "react-oidc-context";

export const HomePage2 = React.memo(() => {
  const { isAuthenticated, user } = useAuth();
  const DEPLOY_ENV =
    import.meta.env.VITE_DEPLOY_ENVIRONMENT ||
    envConfig.VITE_DEPLOY_ENVIRONMENT;

  return (
      <div style={{ padding: "0px 60px", height: "100vh" }}>
        {isAuthenticated && <div>{`Hello ${user?.profile?.display_name}`}</div>}
        <p>OnRouteBC Home -{DEPLOY_ENV}- Environment</p>
      </div>
  );
});

HomePage2.displayName = "HomePage2";
