import React from "react";
import { useAuth } from "react-oidc-context";

export const HomePage = React.memo(() => {
  const { isAuthenticated } = useAuth();

  // TODO Clean this up
  const userInfo: any = sessionStorage.getItem("onRoutebc.user.context");
  const userJson = JSON.parse(userInfo);

  const DEPLOY_ENV =
    import.meta.env.VITE_DEPLOY_ENVIRONMENT ||
    envConfig.VITE_DEPLOY_ENVIRONMENT;

  return (
    <div style={{ padding: "0px 60px", height: "100vh" }}>
      {isAuthenticated && (
        <div>{`Hello ${userJson.firstName} ${userJson.lastName}`}</div>
      )}
      <p>OnRouteBC Home -{DEPLOY_ENV}- Environment</p>
    </div>
  );
});

HomePage.displayName = "HomePage";
