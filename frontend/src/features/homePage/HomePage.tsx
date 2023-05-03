import React from "react";
import { useAuth } from "react-oidc-context";
import { LoadUserRolesByCompany } from "../../common/authentication/LoadUserRolesByCompanyId";

export const HomePage = React.memo(() => {
  const { isAuthenticated } = useAuth();

  // TODO Clean this up
  let userJson;
  const userInfo: any = sessionStorage.getItem("onRoutebc.user.context");
  if (userInfo) userJson = JSON.parse(userInfo);

  const DEPLOY_ENV =
    import.meta.env.VITE_DEPLOY_ENVIRONMENT ||
    envConfig.VITE_DEPLOY_ENVIRONMENT;

  return (
    <>
      <LoadUserRolesByCompany />
      <div style={{ padding: "0px 60px", height: "100vh" }}>
        {isAuthenticated && userJson && (
          <div>{`Hello ${userJson?.firstName} ${userJson?.lastName}`}</div>
        )}
        {isAuthenticated && !userJson && (
          <div>Welcome to OnRouteBC - Please create your profile</div>
        )}
        <p>OnRouteBC Home -{DEPLOY_ENV}- Environment</p>
      </div>
    </>
  );
});

HomePage.displayName = "HomePage";
