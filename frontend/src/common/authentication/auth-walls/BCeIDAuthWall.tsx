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
import { LoadBCeIDUserRolesByCompany } from "../LoadBCeIDUserRolesByCompany";
import OnRouteBCContext from "../OnRouteBCContext";
import { IDIRUserAuthGroupType, UserRolesType } from "../types";
import { DoesUserHaveRole } from "../util";
import { IDIRAuthWall } from "./IDIRAuthWall";
import { setRedirectInSession } from "../../helpers/util";
import { getUserStorage } from "../../apiManager/httpRequestHandler";

export const isIDIR = (identityProvider: string) =>
  identityProvider === IDPS.IDIR;

export const BCeIDAuthWall = ({
  requiredRole,
  allowedIDIRAuthGroups,
}: {
  requiredRole?: UserRolesType;
  /**
   * The collection of auth groups allowed to have access to a page or action.
   * IDIR System Admin is assumed to be allowed regardless of it being passed.
   * If not provided, only a System Admin will be allowed to access.
   */
  allowedIDIRAuthGroups?: IDIRUserAuthGroupType[];
}) => {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    user: userFromToken,
    signinSilent,
  } = useAuth();

  const { userRoles, companyId, isNewBCeIDUser } = useContext(OnRouteBCContext);
  const userIDP = userFromToken?.profile?.identity_provider as string;

  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Redirects the user to the login page after storing the current location.
   * It sets the redirection target in the session storage and then navigates to the home route
   * while passing the current URL as a search parameter for potential redirects post-login.
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
   * Attempts to refresh the authentication token using a silent sign-in process.
   * If the silent sign-in succeeds, the system checks if the response includes an `access_token`.
   * If not, or if the silent sign-in fails, the user is redirected to the login page.
   *
   * @param {string} userStringFromSessionStorage - The JSON string from session storage containing user details.
   */
  const tryTokenRefresh = (userStringFromSessionStorage: string) => {
    const obj = JSON.parse(userStringFromSessionStorage);
    if (obj?.refresh_token) {
      signinSilent()
        .then((value) => {
          if (!value?.access_token) {
            redirectToLoginPage();
          }
          // Else, the token refresh is now complete
          // and the AuthContext will update and rerender this component.
        })
        .catch(() => {
          redirectToLoginPage();
        });
    } else {
      redirectToLoginPage();
    }
  };

  /**
   * Redirect the user back to login page if they are trying to directly access
   * a protected page but are unauthenticated.
   */
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      const userStringFromSessionStorage = getUserStorage();
      try {
        if (userStringFromSessionStorage) {
          tryTokenRefresh(userStringFromSessionStorage);
        } else {
          redirectToLoginPage();
        }
      } catch (e) {
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
        return <IDIRAuthWall allowedAuthGroups={allowedIDIRAuthGroups} />;
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
  }
  return <></>;
};

BCeIDAuthWall.displayName = "BCeIDAuthWall";
