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
        navigate(IDIR_ROUTES.WELCOME);
      } else {
        const userContextData: Optional<BCeIDUserContextType> =
          queryClient.getQueryData<BCeIDUserContextType>(["userContext"]);
        if (userContextData) {
          const { associatedCompanies, pendingCompanies, user } =
            userContextData;
          // If the user does not exist
          if (!user?.userGUID) {
            // The user is in pending companies => Redirect them to User Info Page.
            if (pendingCompanies.length > 0) {
              navigate(CREATE_PROFILE_WIZARD_ROUTES.WELCOME);
            }
            // The user and company does not exist => Redirect them to Add new company page.
            else if (associatedCompanies.length < 1) {
              navigate(CREATE_PROFILE_WIZARD_ROUTES.WELCOME);
            }
          }
          // The user and company exist
          else if (associatedCompanies.length) {
            navigate(APPLICATIONS_ROUTES.BASE);
          }
          // User exists but company does not exist. This is not a possible scenario.
          else if (!associatedCompanies.length) {
            // Error Page
            navigate(ERROR_ROUTES.UNAUTHORIZED);
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
