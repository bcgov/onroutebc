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

const navigateBCeID = (
  userContextData: BCeIDUserContextType,
): string | undefined => {
  const { associatedCompanies, pendingCompanies, migratedClient, user } =
    userContextData;
  // If the user does not exist
  if (!user?.userGUID) {
    // The user is in pending companies => Redirect them to User Info Page.
    // i.e., The user has been invited.
    if (pendingCompanies?.length > 0) {
      return CREATE_PROFILE_WIZARD_ROUTES.WELCOME;
    }
    // The user and company do not exist (not a migrated client)
    //     => Redirect them to the welcome page with challenge.
    else if (associatedCompanies?.length < 1 && !migratedClient?.clientNumber) {
      return CREATE_PROFILE_WIZARD_ROUTES.WELCOME;
    }
    // The user does not exist but the business guid matches a migrated client.
    //    => Take them to no challenge workflow.
    else if (migratedClient?.clientNumber) {
      return CREATE_PROFILE_WIZARD_ROUTES.WELCOME;
    }
    // The user does not exist but there is one or more associated companies
    // due to business GUID match. This is an error scenario and the user is unauthorized.

    // Simply put, if !user and associatedCompanies.length > 0, get the guy out of here.
    else {
      return ERROR_ROUTES.UNAUTHORIZED;
    }
  }
  // The user and company exist
  else if (associatedCompanies?.length) {
    return APPLICATIONS_ROUTES.BASE;
  }
  // User exists but company does not exist. This is not a possible scenario.
  else if (!associatedCompanies?.length) {
    // Error Page
    return ERROR_ROUTES.UNAUTHORIZED;
  }

  // else if(pendingCompanies?.length) (i.e., user exists and has invites from a company)
  // is not a valid block currently because
  // one user can only be part of one company currently.
  // -----------------------------
};

/**
 * This component ensures that a page is only available to new BCeID users.
 */
export const NewBCeIDAuthWall = () => {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    user: userFromToken,
  } = useAuth();

  const { userDetails } = useContext(OnRouteBCContext);
  console.log('userDetails::', userDetails);

  console.log(
    "Boolean(!(userDetails?.userAuthGroup && userDetails?.userName))::",
    Boolean(!(userDetails?.userAuthGroup && userDetails?.userName)),
  );

  const {
    data: userContextData,
    isLoading: isUserContextLoading,
    isError: isUserContextError,
  } = useUserContext(
    Boolean(!(userDetails?.userAuthGroup && userDetails?.userName)),
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
  if (!userDetails?.userAuthGroup && (isAuthLoading || isUserContextLoading)) {
    return <Loading />;
  }

  if (isAuthenticated && !isUserContextLoading && !isUserContextError) {
    if (isBCeID(userIDP)) {
      if (
        (!userDetails?.userAuthGroup && !isUserContextLoading) ||
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
