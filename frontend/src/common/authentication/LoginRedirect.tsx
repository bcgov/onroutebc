import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import * as routes from "../../constants/routes";
import { HomePage2 } from "../../features/homePage/HomePage2";
import { getUserContext } from "../../features/manageProfile/apiManager/manageProfileAPI";
import { UserContextType } from "./types";

/*
 * Redirects user to their correct landing page after loading their
 * user and company info.
 *
 */
export const LoginRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const userContextQuery = useQuery({
    queryKey: ["userContext"],
    queryFn: getUserContext,
    onSuccess: (userContextResponseBody: UserContextType) => {
      // TODO - Switch to a react context if needed.
      // Session Storage works alright as there is no leakage of information
      // than what is already displayed to the user.
      sessionStorage.setItem(
        "onroutebc.user.context",
        JSON.stringify(userContextResponseBody)
      );
    },
    retry: false,
  });

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
        // The user exists
        else if (user?.userGUID && associatedCompanies.length) {
          navigate(routes.HOME);
        } else if (user?.userGUID && !associatedCompanies.length) {
          // Error Page
        }
      }
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <>
        <span>Loading...</span>
      </>
    );
  }

  return (
    <>
      <HomePage2></HomePage2>
    </>
  );
};
