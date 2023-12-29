import { useContext, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import { LoadIDIRUserContext } from "../common/authentication/LoadIDIRUserContext";
import { LoadIDIRUserRoles } from "../common/authentication/LoadIDIRUserRoles";
import OnRouteBCContext from "../common/authentication/OnRouteBCContext";
import {
  IDIRUserAuthGroupType,
  UserRolesType,
} from "../common/authentication/types";
import {
  DoesUserHaveAuthGroup,
  DoesUserHaveRole,
} from "../common/authentication/util";
import { Loading } from "../common/pages/Loading";
import { IDPS } from "../common/types/idp";
import { ERROR_ROUTES, HOME } from "./constants";

const isIDIR = (identityProvider: string) => identityProvider === IDPS.IDIR;

/**
 * This component ensures that a page is only available to IDIR users
 * with necessary roles and auth groups (as applicable).
 *
 */
export const IDIRProtectedRoutes = ({
  requiredRole,
  allowedAuthGroups,
}: {
  requiredRole?: UserRolesType;
  /**
   * The collection of auth groups allowed to have access to a page or action.
   * IDIR System Admin is assumed to be allowed regardless of it being passed.
   */
  allowedAuthGroups?: IDIRUserAuthGroupType[];
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
    } else {
      return (
        <Navigate
          to={ERROR_ROUTES.UNAUTHORIZED}
          state={{ from: location }}
          replace
        />
      );
    }

    const doesUserHaveAccess =
      DoesUserHaveAuthGroup<IDIRUserAuthGroupType>({
        userAuthGroup: idirUserDetails?.userAuthGroup,
        allowedAuthGroups,
      }) && DoesUserHaveRole(userRoles, requiredRole);

    if (doesUserHaveAccess) {
      return <Outlet />;
    }
    // The user does not have access. They should be disallowed.
    return (
      <Navigate
        to={ERROR_ROUTES.UNAUTHORIZED}
        state={{ from: location }}
        replace
      />
    );
  } else {
    return <Navigate to={HOME} state={{ from: location }} replace />;
  }
};
