import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import * as routes from "../../routes/constants";
import { BCeIDUserContextType } from "./types";
import { Loading } from "../pages/Loading";
import { useUserContext } from "../../features/manageProfile/apiManager/hooks";
import { IDPS } from "../types/idp";

/*
 * Redirects user to their correct page after loading their
 * user and company info.
 */
export const LoginRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user: userFromToken } = useAuth();

  const userContextQuery = useUserContext();
  const queryClient = useQueryClient();
  const { isLoading } = userContextQuery;

  /**
   * Hook to determine where to navigate to.
   */
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      if (userFromToken?.profile?.identity_provider === IDPS.IDIR) {
        navigate(routes.IDIR_WELCOME);
      } else {
        const userContextData: BCeIDUserContextType | undefined =
          queryClient.getQueryData<BCeIDUserContextType>(["userContext"]);
        if (userContextData) {
          const { associatedCompanies, pendingCompanies, user } =
            userContextData;
          // If the user does not exist
          if (!user?.userGUID) {
            // The user is in pending companies => Redirect them to User Info Page.
            if (pendingCompanies.length > 0) {
              navigate(routes.WELCOME);
            }
            // The user and company does not exist => Redirect them to Add new company page.
            else if (associatedCompanies.length < 1) {
              navigate(routes.WELCOME);
            } else if (associatedCompanies.length === 1) {
              // Check if COMPANY_USERS has a link to a set of users
              //      If yes, if the user is invited, then he goes to user info wizard (No confusion here)
              //      If no, 
                        // isMigratedClient => COMPANY EXISTS but no COMPANY_USER relationships or check ACCOUNT_SOURCE in COMPANY_TABLE? 
                              // If yes, this is a migrated client and navigate to no challenge.
                              // If no, the login is unauthorized.
            }
          }
          // The user and company exist
          else if (associatedCompanies.length) {
            navigate(routes.APPLICATIONS);
          }
          // User exists but company does not exist. This is not a possible scenario.
          else if (!associatedCompanies.length) {
            // Error Page
            navigate(routes.UNAUTHORIZED);
          }

          // else if(pendingCompanies.length) (i.e., user exists and has invites from a company)
          // is not a valid block currently because
          // one user can only be part of one company currently.
        }
      }
    }
  }, [isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  return <></>;
};
