import { useContext, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import { ERROR_ROUTES, HOME } from "../../../routes/constants";
import { Loading } from "../../pages/Loading";
import { IDPS } from "../../types/idp";
import { LoadBCeIDUserContext } from "../LoadBCeIDUserContext";
import { LoadBCeIDUserRolesByCompany } from "../LoadBCeIDUserRolesByCompany";
import OnRouteBCContext from "../OnRouteBCContext";
import { UserRolesType } from "../types";
import { DoesUserHaveRole } from "../util";

const isIDIR = (identityProvider: string) => identityProvider === IDPS.IDIR;

export const BCeIDAuthWall = ({
  requiredRole,
}: {
  requiredRole?: UserRolesType;
}) => {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    user: userFromToken,
  } = useAuth();

  const { userRoles, companyId, isNewBCeIDUser } = useContext(OnRouteBCContext);

  const userIDP = userFromToken?.profile?.identity_provider as string;

  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Redirect the user back to login page if they are trying to directly access
   * a protected page but are unauthenticated.
   */
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate(HOME);
    }
  }, [isAuthLoading, isAuthenticated]);

  if (isAuthLoading) {
    return <Loading />;
  }

  /**
   * If companyId is present or if we know that the user
   * is not a new BCeID user, we can allow them into the BCeID page
   * provided they do have a matching role.
   */
  const isEstablishedUser = Boolean(companyId || !isNewBCeIDUser);

  if (isAuthenticated && isEstablishedUser) {
    if (isIDIR(userIDP)) {
      /**
       * This is a placeholder to navigate an IDIR user to an unauthorized page
       * since a companyId is necessary for them to do anything and
       * that feature is yet to be built.
       *
       * Once we set up idir user acting as a company, there will be appropriate
       * handlers here.
       */
      return (
        <Navigate
          to={ERROR_ROUTES.UNEXPECTED}
          state={{ from: location }}
          replace
        />
      );
    }
    if (!isIDIR(userIDP)) {
      if (!companyId) {
        return (
          <>
            <LoadBCeIDUserContext />
            <Loading />
          </>
        );
      }
      if (!userRoles) {
        return (
          <>
            <LoadBCeIDUserRolesByCompany />
            <Loading />
          </>
        );
      }
    }

    if (!DoesUserHaveRole(userRoles, requiredRole)) {
      return (
        <Navigate
          to={ERROR_ROUTES.UNAUTHORIZED}
          state={{ from: location }}
          replace
        />
      );
    }
    return <Outlet />;
  } else {
    return <Navigate to={HOME} state={{ from: location }} replace />;
  }
};

BCeIDAuthWall.displayName = "BCeIDAuthWall";
