import { useContext, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useUserContext } from "../../../features/manageProfile/apiManager/hooks";
import {
  APPLICATIONS_ROUTES,
  CREATE_PROFILE_WIZARD_ROUTES,
  ERROR_ROUTES,
  HOME,
} from "../../../routes/constants";
import { Loading } from "../../pages/Loading";
import { IDPS } from "../../types/idp";
import { BCeIDUserContextType } from "../types";
import OnRouteBCContext from "../OnRouteBCContext";

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

  // const { userDetails } = useContext(OnRouteBCContext);
  // console.log('userDetails::', userDetails);

  // console.log(
  //   "Boolean(!(userDetails?.userAuthGroup && userDetails?.userName))::",
  //   Boolean(!(userDetails?.userAuthGroup && userDetails?.userName)),
  // );

  const {
    data: userContextData,
    isLoading: isUserContextLoading,
    isError: isUserContextError,
  } = useUserContext(
    // Boolean(!(userDetails?.userAuthGroup && userDetails?.userName)),
  );

  const userIDP = userFromToken?.profile?.identity_provider as string;
  const location = useLocation();

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      console.log("user context state update");
    }
  }, [isAuthLoading, isAuthenticated]);

  console.log(
    "isAuthLoading || isUserContextLoading::",
    isAuthLoading || isUserContextLoading,
  );
  if (isAuthLoading || isUserContextLoading) {
    return <Loading />;
  }

  if (isAuthenticated && !isUserContextLoading && !isUserContextError) {
    if (isBCeID(userIDP)) {
      if (
        // (!userDetails?.userAuthGroup && !isUserContextLoading) ||
        (userContextData && !userContextData.user?.userAuthGroup)
      ) {
        // The user is now authenticated and confirmed to be a new user
        return <Outlet />;
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
   * The user is either a) unauthenticated or b) set up their profile already.
   * Redirect them to home page either way.
   */
  return <Navigate to={HOME} state={{ from: location }} replace />;
};

NewBCeIDAuthWall.displayName = "NewBCeIDAuthWall";
