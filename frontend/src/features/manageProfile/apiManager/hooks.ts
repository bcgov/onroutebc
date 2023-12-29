import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { useContext } from "react";

import { FIVE_MINUTES } from "../../../common/constants/constants";
import { BCeIDAuthGroup } from "../types/userManagement";
import { IDPS } from "../../../common/types/idp";
import { RequiredOrNull } from "../../../common/types/common";
import {
  getCompanyInfo,
  getCompanyInfoById,
  getIDIRUserRoles,
  getUserContext,
  getUserRolesByCompanyId,
} from "./manageProfileAPI";

import OnRouteBCContext, {
  BCeIDUserDetailContext,
  IDIRUserDetailContext,
} from "../../../common/authentication/OnRouteBCContext";

import {
  BCeIDUserContextType,
  IDIRUserContextType,
} from "../../../common/authentication/types";

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
 * Fetches company info of specific company.
 * @returns company info or error if failed
 */
export const useCompanyInfoDetailsQuery = (companyId: number) => {
  return useQuery({
    queryKey: ["companyInfo"],
    queryFn: () => getCompanyInfoById(companyId),
    enabled: !!companyId,
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
    setOnRouteBCClientNumber,
    setMigratedClient,
  } = useContext(OnRouteBCContext);
  const { isAuthenticated, user: userFromToken } = useAuth();
  return useQuery({
    queryKey: ["userContext"],
    queryFn: getUserContext,
    cacheTime: 500,
    refetchOnMount: "always",
    select: (
      userContextResponseBody: BCeIDUserContextType | IDIRUserContextType,
    ) => {
      console.log('userContextResponseBody::', userContextResponseBody);
      if (
        isAuthenticated &&
        userFromToken?.profile?.identity_provider === IDPS.IDIR
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
        const { user, associatedCompanies, pendingCompanies, migratedClient } =
          userContextResponseBody as BCeIDUserContextType;
        if (user?.userGUID) {
          const companyId = associatedCompanies[0].companyId;
          const legalName = associatedCompanies[0].legalName;
          const clientNumber = associatedCompanies[0].clientNumber;
          setCompanyId?.(() => companyId);
          setCompanyLegalName?.(() => legalName);
          setOnRouteBCClientNumber?.(() => clientNumber);
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
            companyId.toString(),
          );
        }
        if (pendingCompanies.length > 0) {
          const { companyId, legalName } = pendingCompanies[0];
          setCompanyId?.(() => companyId);
          setCompanyLegalName?.(() => legalName);
          sessionStorage.setItem(
            "onRouteBC.user.companyId",
            companyId.toString(),
          );
        }
        if (migratedClient?.clientNumber) {
          setMigratedClient?.(() => migratedClient);
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
    retry: 1, // Retry once on failure
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
    onSuccess: (userRoles: RequiredOrNull<string[]>) => {
      setUserRoles?.(() => userRoles);
    },
    retry: 1, // Retry once on failure
  });
};
