import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

import { BCeIDUserContextType } from "./types";
import { Loading } from "../pages/Loading";
import { useUserContext } from "../../features/manageProfile/apiManager/hooks";
import { IDPS } from "../types/idp";
import {
  APPLICATIONS_ROUTES,
  CREATE_PROFILE_WIZARD_ROUTES,
  ERROR_ROUTES,
  IDIR_ROUTES,
} from "../../routes/constants";
import { Optional } from "../types/common";

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

/*
 * Redirects user to their correct page after loading their
 * user and company info.
 */
export const LoginRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user: userFromToken } = useAuth();

  const { isLoading, isError } = useUserContext();
  const queryClient = useQueryClient();

  /**
   * Hook to determine where to navigate to.
   */
  useEffect(() => {
    if (isError) {
      navigate(ERROR_ROUTES.UNEXPECTED);
    }
    if (isAuthenticated && !isLoading) {
      if (userFromToken?.profile?.identity_provider === IDPS.IDIR) {
        navigate(IDIR_ROUTES.WELCOME);
      } else {
        const userContextData: Optional<BCeIDUserContextType> =
          queryClient.getQueryData<BCeIDUserContextType>(["userContext"]);
        const to = navigateBCeID(userContextData as BCeIDUserContextType);
        navigate(to ?? ERROR_ROUTES.UNEXPECTED);
      }
    }
  }, [isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  return <></>;
};
