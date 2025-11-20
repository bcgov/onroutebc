import { useContext, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import {
  Navigate,
  Outlet,
  createSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { ERROR_ROUTES, HOME, IDIR_ROUTES } from "../../../routes/constants";
import { Loading } from "../../pages/Loading";
import { IDPS } from "../../types/idp";
import { LoadBCeIDUserContext } from "../LoadBCeIDUserContext";
import { LoadBCeIDUserClaimsByCompany } from "../LoadBCeIDUserClaimsByCompany";
import OnRouteBCContext from "../OnRouteBCContext";
import { BCeIDUserRoleType } from "../types";
import { IDIRAuthWall } from "./IDIRAuthWall";
import { setRedirectInSession } from "../../helpers/util";
import { getUserStorage } from "../../apiManager/httpRequestHandler";
import {
  checkPermissionMatrix,
  PermissionMatrixKeysType,
} from "../PermissionMatrix";

export const isIDIR = (identityProvider: string) =>
  identityProvider === IDPS.IDIR;

export const BCeIDAuthWall = ({
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
    signinSilent,
  } = useAuth();

  const { userClaims, companyId, isNewBCeIDUser, userDetails } =
    useContext(OnRouteBCContext);
  const userIDP = userFromToken?.profile?.identity_provider as string;

  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Redirects the user to the login page.
   * This function captures the current URL and passes it as a redirect parameter
   * to the login page so that after successful authentication, the user can be
   * redirected back to the page they initially requested.
   */
  const redirectToLoginPage = () => {
    setRedirectInSession(window.location.href);
    navigate({
      pathname: HOME,
      search: createSearchParams({
        r: window.location.href,
      }).toString(),
    });
  };

  /**
   * Try refreshing the access token,
   * if still logged out redirect the user back to login page if
   * they are trying to directly access a protected page but are unauthenticated.
   */
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      try {
        const userSessionJSON = getUserStorage();
        if (userSessionJSON?.refresh_token) {
          signinSilent()
            .then((value) => {
              if (!value?.access_token) {
                // If sign in is unsuccessful, redirect to home page.
                redirectToLoginPage();
              }
              // else, silent sign in is complete and token is refreshed.
              // AuthContext will be updated and the component rerenders which
              // takes care of directing the user as appropriate.
            })
            .catch(() => {
              redirectToLoginPage();
            });
        } else {
          redirectToLoginPage();
        }
      } catch {
        console.error("Unable to process token refresh; redirecting to login");
        redirectToLoginPage();
      }
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
  const isEstablishedUser = Boolean(companyId) || !isNewBCeIDUser;

  if (isAuthenticated && isEstablishedUser) {
    if (isIDIR(userIDP)) {
      if (companyId) {
        return <IDIRAuthWall permissionMatrixKeys={permissionMatrixKeys} />;
      } else {
        return (
          <Navigate
            to={IDIR_ROUTES.WELCOME}
            state={{ from: location }}
            replace
          />
        );
      }
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
      if (!userClaims) {
        return (
          <>
            <LoadBCeIDUserClaimsByCompany />
            <Loading />
          </>
        );
      }
    }

    const isAllowed = checkPermissionMatrix({
      permissionMatrixKeys,
      isIdir: false,
      currentUserRole: userDetails?.userRole as BCeIDUserRoleType,
    });
    if (isAllowed) {
      return <Outlet />;
    } else {
      return (
        <Navigate
          to={ERROR_ROUTES.UNAUTHORIZED}
          state={{ from: location }}
          replace
        />
      );
    }
  }
  return <></>;
};

BCeIDAuthWall.displayName = "BCeIDAuthWall";
