import { useContext, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import { LoadIDIRUserContext } from "../common/authentication/LoadIDIRUserContext";
import { LoadIDIRUserRoles } from "../common/authentication/LoadIDIRUserRoles";
import OnRouteBCContext from "../common/authentication/OnRouteBCContext";
import { IDIRUserAuthGroupType, UserAuthGroupType, UserRolesType } from "../common/authentication/types";
import { DoesUserHaveRole } from "../common/authentication/util";
import { Loading } from "../common/pages/Loading";
import { IDPS } from "../common/types/idp";
import { ERROR_ROUTES, HOME } from "./constants";

const isIDIR = (identityProvider: string) => identityProvider === IDPS.IDIR;

export const IDIRProtectedRoutes = ({
  requiredRole,
  requiredAuthGroup,
}: {
  requiredRole?: UserRolesType;
  requiredAuthGroup: IDIRUserAuthGroupType;
}) => {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    user: userFromToken,
  } = useAuth();

  const { userRoles, idirUserDetails } = useContext(OnRouteBCContext);

  const userIDP = userFromToken?.profile?.identity_provider as string;

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      /**
       * Redirect the user back to login page if they are trying to directly access
       * a protected page but are unauthenticated.
       */
      navigate(HOME);
    }
  }, [isAuthLoading, isAuthenticated]);

  if (isAuthLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    if (isIDIR(userIDP)) {
      if (!idirUserDetails?.userAuthGroup) {
        return (
          <>
            <LoadIDIRUserContext />
            <Loading />
          </>
        );
      }
      if (!userRoles) {
        return (
          <>
            <LoadIDIRUserRoles />
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
