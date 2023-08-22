import { useQuery } from "@tanstack/react-query";
import {
  getCompanyInfo,
  getIDIRUserRoles,
  getUserContext,
  getUserRolesByCompanyId,
} from "./manageProfileAPI";
import { FIVE_MINUTES } from "../../../common/constants/constants";
import { useContext } from "react";
import OnRouteBCContext, {
  BCeIDUserDetailContext,
  IDIRUserDetailContext,
} from "../../../common/authentication/OnRouteBCContext";
import {
  BCeIDUserContextType,
  IDIRUserContextType,
} from "../../../common/authentication/types";
import { BCeIDAuthGroup } from "../types/userManagement";
import { useAuth } from "react-oidc-context";

/**
 * Fetches company info of current user.
 * @returns company info of current user, or error if failed
 */
export const useCompanyInfoQuery = () => {
  return useQuery({
    queryKey: ["companyInfo"],
    queryFn: getCompanyInfo,
    refetchInterval: FIVE_MINUTES,
    refetchOnWindowFocus: false, // fixes issue where a query is run everytime the screen is brought to foreground
    retry: false,
  });
};

/**
 * Hook to set up the user context after fetching the data from user-context api.
 * @returns UseQueryResult containing the query results.
 */
export const useUserContext = () => {
  const {
    setCompanyId,
    setUserDetails,
    setCompanyLegalName,
    setIDIRUserDetails,
  } = useContext(OnRouteBCContext);
  const { isAuthenticated, user: userFromToken } = useAuth();
  return useQuery({
    queryKey: ["userContext"],
    queryFn: getUserContext,
    cacheTime: 500,
    refetchOnMount: "always",
    onSuccess: (
      userContextResponseBody: BCeIDUserContextType | IDIRUserContextType
    ) => {
      if (
        isAuthenticated &&
        userFromToken?.profile?.identity_provider === "idir"
      ) {
        const { user } = userContextResponseBody as IDIRUserContextType;
        if (user?.userGUID) {
          const userDetails = {
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            userAuthGroup: user.userAuthGroup,
          } as IDIRUserDetailContext;
          setIDIRUserDetails?.(() => userDetails);
        }
      } else {
        const { user, associatedCompanies, pendingCompanies } =
          userContextResponseBody as BCeIDUserContextType;
        if (user?.userGUID) {
          const companyId = associatedCompanies[0].companyId;
          const legalName = associatedCompanies[0].legalName;
          setCompanyId?.(() => companyId);
          setCompanyLegalName?.(() => legalName);
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
            userAuthGroup: user.userAuthGroup as BCeIDAuthGroup,
          } as BCeIDUserDetailContext;
          setUserDetails?.(() => userDetails);

          // Setting the companyId to sessionStorage so that it can be
          // used outside of react components.
          sessionStorage.setItem(
            "onRouteBC.user.companyId",
            companyId.toString()
          );
        }
        if (pendingCompanies.length > 0) {
          const { companyId, legalName } = pendingCompanies[0];
          setCompanyId?.(() => companyId);
          setCompanyLegalName?.(() => legalName);
          sessionStorage.setItem(
            "onRouteBC.user.companyId",
            companyId.toString()
          );
        }
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

/**
 * Hook to set up the user roles after fetching the data from user-context api.
 * @returns UseQueryResult containing the query results.
 */
export const useIDIRUserRoles = () => {
  const { setUserRoles } = useContext(OnRouteBCContext);
  return useQuery({
    queryKey: ["userIDIRRoles"],
    refetchInterval: FIVE_MINUTES,
    queryFn: getIDIRUserRoles,
    onSuccess: (userRolesResponseBody: string[]) => {
      setUserRoles?.(() => userRolesResponseBody);
    },
    retry: true,
  });
};
