import { useContext, useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import { ERROR_ROUTES, HOME } from "../../../routes/constants";
import { Loading } from "../../pages/Loading";
import { IDPS } from "../../types/idp";
import { LoadBCeIDUserContext } from "../LoadBCeIDUserContext";
import OnRouteBCContext from "../OnRouteBCContext";
import { useUserContext } from "../../../features/manageProfile/apiManager/hooks";

const isBCeID = (identityProvider: string) => identityProvider === IDPS.BCEID;

/**
 * This component ensures that a page is only available to new BCeID users.
 */
export const NewBCeIDAuthWall = () => {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    user: userFromToken,
  } = useAuth();

  const { userDetails, companyId } = useContext(OnRouteBCContext);
  useUserContext();
  console.log("companyId::", companyId);
  console.log("userDetails::", userDetails);
  const [hasUserContextLoaded, setHasUserContextLoaded] =
    useState<boolean>(false);

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

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && !hasUserContextLoaded) {
      console.log("user context state update");
      setHasUserContextLoaded(() => true);
    }
  }, [isAuthLoading, isAuthenticated, userDetails]);

  if (isAuthLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    if (isBCeID(userIDP)) {
      if (!hasUserContextLoaded) {
        return (
          <>
            <LoadBCeIDUserContext />
            <Loading />
          </>
        );
      } else {
        if (!userDetails || !userDetails.userAuthGroup) {
          // The user is now authenticated and confirmed to be a new user
          return <Outlet />;
        }
      }
      /**
       * Implementation Note:
       * There is no need to load up the user roles.
       * User context is sufficient enough to determine whether the user
       * already has a profile in the system.
       */
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
  /**
   *  The user is either a) unauthenticated or b) set up their profile already.
   * Redirect them to home page either way.
   */
  return <Navigate to={HOME} state={{ from: location }} replace />;
};

NewBCeIDAuthWall.displayName = "NewBCeIDAuthWall";
