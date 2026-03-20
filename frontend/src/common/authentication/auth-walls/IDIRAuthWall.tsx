import { useContext, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import { LoadIDIRUserContext } from "../LoadIDIRUserContext";
import { LoadIDIRUserClaims } from "../LoadIDIRUserClaims";
import OnRouteBCContext from "../OnRouteBCContext";
import { Loading } from "../../pages/Loading";
import { IDPS } from "../../types/idp";
import { ERROR_ROUTES, HOME } from "../../../routes/constants";
import {
  checkPermissionMatrix,
  PermissionMatrixKeysType,
} from "../PermissionMatrix";

const isIDIR = (identityProvider: string) => identityProvider === IDPS.IDIR;

/**
 * This component ensures that a page is only available to IDIR users
 * with necessary claims and roles (as applicable).
 *
 */
export const IDIRAuthWall = ({
  permissionMatrixKeys,
}: {
  /**
   * The permission matrix keys.
   */
  permissionMatrixKeys: PermissionMatrixKeysType;
}) => {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    user: userFromToken,
  } = useAuth();

  const { userClaims, idirUserDetails } = useContext(OnRouteBCContext);

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
      if (!idirUserDetails?.userRole) {
        return (
          <>
            <LoadIDIRUserContext />
            <Loading />
          </>
        );
      }
      if (!userClaims) {
        return (
          <>
            <LoadIDIRUserClaims />
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

    const isAllowed = checkPermissionMatrix({
      permissionMatrixKeys,
      isIdir: true,
      currentUserRole: idirUserDetails.userRole,
    });
    if (isAllowed) {
      return <Outlet />;
    } else {
      // The user does not have access. They should be disallowed.
      return (
        <Navigate
          to={ERROR_ROUTES.UNAUTHORIZED}
          state={{ from: location }}
          replace
        />
      );
    }
  } else {
    return <Navigate to={HOME} state={{ from: location }} replace />;
  }
};

IDIRAuthWall.displayName = "IDIRAuthWall";
