import { useContext, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import {
  Navigate,
  Outlet,
  createSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { ERROR_ROUTES, HOME } from "../../../routes/constants";
import { Loading } from "../../pages/Loading";
import { IDPS } from "../../types/idp";
import { LoadBCeIDUserContext } from "../LoadBCeIDUserContext";
import { LoadBCeIDUserRolesByCompany } from "../LoadBCeIDUserRolesByCompany";
import OnRouteBCContext from "../OnRouteBCContext";
import { IDIRUserAuthGroupType, UserRolesType } from "../types";
import { DoesUserHaveRole } from "../util";
import { setRedirectInSession } from "../../helpers/util";
import { getUserStorage } from "../../apiManager/httpRequestHandler";
import { StaffActAsCompanyAuthWall } from "./StaffActAsCompanyAuthWall";

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

  const {
    userRoles,
    companyId: companyIdInContext,
    isNewBCeIDUser,
  } = useContext(OnRouteBCContext);
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
      } catch (e) {
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
  const isEstablishedUser = Boolean(companyIdInContext) || !isNewBCeIDUser;

  if (isAuthenticated && isEstablishedUser) {
    if (isIDIR(userIDP)) {
      return (
        <StaffActAsCompanyAuthWall allowedAuthGroups={allowedIDIRAuthGroups} />
      );
    }
    if (!isIDIR(userIDP)) {
      if (!companyIdInContext) {
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
