import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import * as routes from "../../routes/constants";
import { HomePage } from "../../features/homePage/HomePage";
import { UserContextType } from "./types";
import { Loading } from "../pages/Loading";
import { useUserContext } from "../../features/manageProfile/apiManager/hooks";

/*
 * Redirects user to their correct page after loading their
 * user and company info.
 */
export const LoginRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const userContextQuery = useUserContext();
  const queryClient = useQueryClient();
  const { isLoading } = userContextQuery;

  /**
   * Hook to determine where to navigate to.
   */
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const userContextData: UserContextType | undefined =
        queryClient.getQueryData<UserContextType>(["userContext"]);
      if (userContextData) {
        const { associatedCompanies, pendingCompanies, user } = userContextData;
        // If the user does not exist
        if (!user?.userGUID) {
          // The user is in pending companies => Redirect them to User Info Page.
          if (pendingCompanies.length > 0) {
            navigate(routes.USER_INFO);
          }
          // The user and company does not exist => Redirect them to Add new company page.
          else if (associatedCompanies.length < 1) {
            navigate(routes.WELCOME);
          }
        }
        // The user and company exist
        else if (associatedCompanies.length) {
          navigate(routes.HOME);
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
  }, [isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <HomePage></HomePage>
    </>
  );
};
