import { useQuery } from "@tanstack/react-query";
import {
  getCompanyInfo,
  getUserContext,
  getUserRolesByCompanyId,
} from "./manageProfileAPI";
import { FIVE_MINUTES } from "../../../common/constants/constants";
import { useContext } from "react";
import OnRouteBCContext, {
  UserDetailContext,
} from "../../../common/authentication/OnRouteBCContext";
import { UserContextType } from "../../../common/authentication/types";

export const useCompanyInfoQuery = () => {
  return useQuery({
    queryKey: ["companyInfo"],
    queryFn: getCompanyInfo,
    refetchInterval: FIVE_MINUTES,
    retry: false,
  });
};

/**
 * Hook to set up the user context after fetching the data from user-context api.
 * @returns UseQueryResult containing the query results.
 */
export const useUserContext = () => {
  const { setCompanyId, setUserDetails } = useContext(OnRouteBCContext);
  return useQuery({
    queryKey: ["userContext"],
    queryFn: getUserContext,
    cacheTime: 500,
    refetchOnMount: "always",
    onSuccess: (userContextResponseBody: UserContextType) => {
      const { user, associatedCompanies } = userContextResponseBody;
      if (user?.userGUID) {
        const companyId = associatedCompanies[0].companyId;
        setCompanyId?.(() => companyId);

        const userDetails = {
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          phone1: user.phone1,
          phone1Extension: user.phone1Extension,
          phone2: user.phone2,
          phone2Extension: user.phone2Extension,
          email: user.email,
          fax: user.fax,
        } as UserDetailContext;
        setUserDetails?.(() => userDetails);

        const userContextSessionObject = {
          companyId,
          ...userDetails,
        };

        // Switch to a react context when implementing multiple companies.
        // We currently don't need a dedicated react context.
        // Session Storage works alright as there is no leakage of information
        // than what is already displayed to the user.
        sessionStorage.setItem(
          "onRoutebc.user.context",
          JSON.stringify(userContextSessionObject)
        );
      }
    },
    retry: false,
  });
};

/**
 * Hook to set up the user roles after fetching the data from user-context api.
 * @returns UseQueryResult containing the query results.
 */
export const useUserRolesByCompanyId = () => {
  const { setUserRoles } = useContext(OnRouteBCContext);
  return useQuery({
    queryKey: ["userRoles"],
    refetchInterval: FIVE_MINUTES,
    queryFn: getUserRolesByCompanyId,
    onSuccess: (userRolesResponseBody: string[]) => {
      setUserRoles?.(() => userRolesResponseBody);
    },
    retry: true,
  });
};
