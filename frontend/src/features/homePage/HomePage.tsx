import React, { useContext } from "react";
import { useAuth } from "react-oidc-context";
import { LoadBCeIDUserRolesByCompany } from "../../common/authentication/LoadBCeIDUserRolesByCompany";
import OnRouteBCContext from "../../common/authentication/OnRouteBCContext";

export const HomePage = React.memo(() => {
  const { isAuthenticated } = useAuth();

  const { userDetails } = useContext(OnRouteBCContext);
  const DEPLOY_ENV =
    import.meta.env.VITE_DEPLOY_ENVIRONMENT ||
    envConfig.VITE_DEPLOY_ENVIRONMENT;

  return (
    <>
      <LoadBCeIDUserRolesByCompany />
      <div style={{ padding: "0px 60px", height: "100vh" }}>
        {isAuthenticated && userDetails && (
          <div>{`Hello ${userDetails?.firstName} ${userDetails?.lastName}`}</div>
        )}
        {isAuthenticated && !userDetails && (
          <div>Welcome to OnRouteBC - Please create your profile</div>
        )}
        <p>OnRouteBC Home -{DEPLOY_ENV}- Environment</p>
      </div>
    </>
  );
});

HomePage.displayName = "HomePage";
