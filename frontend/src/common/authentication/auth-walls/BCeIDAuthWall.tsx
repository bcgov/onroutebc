import { useContext, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import { LoadBCeIDUserContext } from "../LoadBCeIDUserContext";
import { LoadBCeIDUserRolesByCompany } from "../LoadBCeIDUserRolesByCompany";
import OnRouteBCContext from "../OnRouteBCContext";
import { UserRolesType } from "../types";
import { DoesUserHaveRole } from "../util";
import { Loading } from "../../pages/Loading";
import { IDPS } from "../../types/idp";
import { ERROR_ROUTES, HOME } from "../../../routes/constants";

const isIDIR = (identityProvider: string) => identityProvider === IDPS.IDIR;

export const BCeIDProtectedRoutes = ({
  requiredRole,
}: {
  requiredRole?: UserRolesType;
}) => {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    user: userFromToken,
  } = useAuth();

  const { userRoles, companyId } = useContext(OnRouteBCContext);

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

  if (isAuthenticated) {
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
