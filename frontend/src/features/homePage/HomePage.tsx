import React, { useContext } from "react";
import { useAuth } from "react-oidc-context";
import { LoadBCeIDUserRolesByCompany } from "../../common/authentication/LoadBCeIDUserRolesByCompany";
import OnRouteBCContext from "../../common/authentication/OnRouteBCContext";
import { LoadIDIRUserRoles } from "../../common/authentication/LoadIDIRUserRoles";
import { IDPS } from "../../common/types/idp";

/**
 * @param identityProvider The identity provider from the user token.
 * @returns Boolean indicating if a logged in user is an IDIR.
 */
const isIDIRUser = (identityProvider: string) => identityProvider === IDPS.IDIR;

export const HomePage = React.memo(() => {
  const { isAuthenticated, user: userFromToken } = useAuth();
  const userIDP = userFromToken?.profile?.identity_provider as string;

  const { userDetails } = useContext(OnRouteBCContext);
  const DEPLOY_ENV =
    import.meta.env.VITE_DEPLOY_ENVIRONMENT ||
    envConfig.VITE_DEPLOY_ENVIRONMENT;

  return (
    <>
      {isIDIRUser(userIDP) ? (
        <LoadIDIRUserRoles />
      ) : (
        <LoadBCeIDUserRolesByCompany />
      )}

      <div style={{ padding: "0px 60px", height: "100vh" }}>
        {isAuthenticated && !isIDIRUser(userIDP) && userDetails && (
          <div>{`Hello ${userDetails?.firstName} ${userDetails?.lastName}`}</div>
        )}
        {isAuthenticated && !isIDIRUser(userIDP) && !userDetails && (
          <div>Welcome to OnRouteBC - Please create your profile</div>
        )}
        <p>OnRouteBC Home -{DEPLOY_ENV}- Environment</p>
      </div>
    </>
  );
});

HomePage.displayName = "HomePage";
