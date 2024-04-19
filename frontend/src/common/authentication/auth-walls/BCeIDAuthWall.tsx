/* eslint-disable @typescript-eslint/no-unused-vars */
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
    stopSilentRenew,
    startSilentRenew,
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
      const storageKey = Object.keys(sessionStorage).find((key) =>
        key.startsWith("oidc.user"),
      );
      const userString = sessionStorage.getItem(storageKey ?? "");
      try {
        if (userString) {
          const obj = JSON.parse(userString);
          if (obj?.refresh_token) {
            signinSilent()
              .then((value) => {
                if (value?.access_token) {
                  // sign in complete.
                  console.log('sign in complete');
                } else {
                  setRedirectInSession(window.location.href);
                  navigate({
                    pathname: HOME,
                    search: createSearchParams({
                      r: window.location.href,
                    }).toString(),
                  });
                }
              })
              .catch(() => {
                setRedirectInSession(window.location.href);
                navigate({
                  pathname: HOME,
                  search: createSearchParams({
                    r: window.location.href,
                  }).toString(),
                });
              });
          }
        }
      } catch (e) {
        console.error("Unable to process token refresh::", e);
        setRedirectInSession(window.location.href);
        navigate({
          pathname: HOME,
          search: createSearchParams({
            r: window.location.href,
          }).toString(),
        });
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
