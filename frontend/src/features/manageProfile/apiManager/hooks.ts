import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AxiosResponse } from "axios";

import { IDPS } from "../../../common/types/idp";
import { Nullable } from "../../../common/types/common";
import { ERROR_ROUTES } from "../../../routes/constants";
import { DeleteResponse } from "../types/manageProfile";
import {
  FIVE_MINUTES,
  FOUR_MINUTES,
} from "../../../common/constants/constants";

import {
  deleteCompanyPendingUsers,
  deleteCompanyActiveUsers,
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
  BCeIDUserAuthGroupType,
  BCeIDUserContextType,
  IDIRUserContextType,
  UserRolesType,
} from "../../../common/authentication/types";
import { getCompanyIdFromSession } from "../../../common/apiManager/httpRequestHandler";
import { getDefaultRequiredVal } from "../../../common/helpers/util";

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
export const useCompanyInfoDetailsQuery = (
  companyIdParam?: Nullable<string>,
) => {
  const companyId = getDefaultRequiredVal(
    "",
    getCompanyIdFromSession(),
    companyIdParam,
  );
  return useQuery({
    queryKey: ["companyInfo"],
    queryFn: () => getCompanyInfoById(Number(companyId)),
    enabled: !!companyId,
    refetchInterval: FIVE_MINUTES,
    refetchOnWindowFocus: false, // fixes issue where a query is run everytime the screen is brought to foreground
    retry: false,
  });
};

/**
 * Hook to query the data from the user-context api.
 * @param enabled boolean indicating if the query is enabled. Defaults to true.
 * @returns UseQueryResult containing the query results.
 */
export const useUserContextQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["userContext"],
    queryFn: getUserContext,
    gcTime: 500,
    refetchOnMount: "always",
    staleTime: FOUR_MINUTES,
    enabled,
    retry: 1, // Retry once on failure
  });
};

/**
 * Hook to set up the user context after fetching the data from user-context api.
 * @param userContextResponseBody Response data fetched from the user-context api, either bceid or idir user context data.
 * @returns UseQueryResult containing the query results.
 */
export const useUserContext = (
  userContextResponseBody: Nullable<BCeIDUserContextType | IDIRUserContextType>,
) => {
  const {
    setCompanyId,
    setUserDetails,
    setCompanyLegalName,
    setIsCompanySuspended,
    setIDIRUserDetails,
    setOnRouteBCClientNumber,
    setMigratedClient,
    setIsNewBCeIDUser,
  } = useContext(OnRouteBCContext);

  const { isAuthenticated, user: userFromToken } = useAuth();

  useEffect(() => {
    if (!userContextResponseBody) return;

    const isIdir =
      isAuthenticated &&
      userFromToken?.profile?.identity_provider === IDPS.IDIR;

    if (isIdir) {
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

      /**
       * User exists => the user is already in the system.
       */
      if (user?.userGUID) {
        const companyId = associatedCompanies[0].companyId;
        const legalName = associatedCompanies[0].legalName;
        const clientNumber = associatedCompanies[0].clientNumber;
        const isCompanySuspended = associatedCompanies[0].isSuspended;

        setCompanyId?.(() => companyId);
        setCompanyLegalName?.(() => legalName);
        setOnRouteBCClientNumber?.(() => clientNumber);
        setIsCompanySuspended?.(() => isCompanySuspended);

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
          userAuthGroup: user.userAuthGroup as BCeIDUserAuthGroupType,
        } as BCeIDUserDetailContext;

        setUserDetails?.(() => userDetails);

        // Setting the companyId to sessionStorage so that it can be
        // used outside of react components.
        sessionStorage.setItem(
          "onRouteBC.user.companyId",
          companyId.toString(),
        );
      }

      /**
       * The user has been added to a company.
       */
      if (pendingCompanies.length > 0) {
        const { companyId, legalName, isSuspended } = pendingCompanies[0];

        setCompanyId?.(() => companyId);
        setCompanyLegalName?.(() => legalName);
        setIsCompanySuspended?.(() => isSuspended);

        sessionStorage.setItem(
          "onRouteBC.user.companyId",
          companyId.toString(),
        );
        setIsNewBCeIDUser?.(() => true);
      }

      /**
       * The user has been migrated.
       */
      if (migratedClient?.clientNumber) {
        setMigratedClient?.(() => migratedClient);
      }

      /**
       * If there is no company in the system (to prevent unauthorized logins)
       * we can affirmatively say that the logged in user is a new user.
       */
      if (associatedCompanies.length === 0) {
        setIsNewBCeIDUser?.(() => true);
      }
    }
  }, [userContextResponseBody, isAuthenticated, userFromToken]);
};

/**
 * Hook to fetching the user roles data from the api.
 * @returns UseQueryResult containing the query results.
 */
export const useUserRolesByCompanyIdQuery = () => {
  return useQuery({
    queryKey: ["userRoles"],
    refetchInterval: FIVE_MINUTES,
    queryFn: getUserRolesByCompanyId,
    retry: 1, // Retry once on failure
  });
};

/**
 * Hook to set up the user roles after fetching the data from the api.
 * @param userRolesResponseBody Response data for the user roles fetched.
 * @returns UseQueryResult containing the query results.
 */
export const useUserRolesByCompanyId = (
  userRolesResponseBody: Nullable<UserRolesType[]>,
) => {
  const { setUserRoles } = useContext(OnRouteBCContext);

  useEffect(() => {
    if (userRolesResponseBody) {
      setUserRoles?.(() => userRolesResponseBody);
    }
  }, [userRolesResponseBody]);
};

/**
 * Hook to fetching the IDIR user roles data from the api.
 * @returns UseQueryResult containing the query results.
 */
export const useIDIRUserRolesQuery = () => {
  return useQuery({
    queryKey: ["userIDIRRoles"],
    refetchInterval: FIVE_MINUTES,
    queryFn: getIDIRUserRoles,
    retry: 1, // Retry once on failure
  });
};

/**
 * Hook to set up the IDIR user roles after fetching the data from the api.
 * @param userRoles User roles data response from the api.
 * @returns UseQueryResult containing the query results.
 */
export const useIDIRUserRoles = (userRoles: Nullable<UserRolesType[]>) => {
  const { setUserRoles } = useContext(OnRouteBCContext);

  useEffect(() => {
    if (userRoles) {
      setUserRoles?.(() => userRoles);
    }
  }, [userRoles]);
};

/**
 * Custom hook for deleting company users.
 * @returns Mutation object with methods to interact with the delete operation.
 */
export const useDeleteCompanyActiveUsers = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: deleteCompanyActiveUsers,
    onError: () => navigate(ERROR_ROUTES.UNEXPECTED),
    onSuccess: (response: AxiosResponse) => {
      const { data: companyUserResponse } = response;
      const { failure } = companyUserResponse as DeleteResponse;
      if (failure?.length > 0) {
        navigate(ERROR_ROUTES.UNEXPECTED);
      }
    },
  });
};

/**
 * Custom hook for deleting company pending users.
 * @returns Mutation object with methods to interact with the delete operation.
 */
export const useDeleteCompanyPendingUsers = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: deleteCompanyPendingUsers,
    onError: () => navigate(ERROR_ROUTES.UNEXPECTED),
    onSuccess: (response: AxiosResponse) => {
      const { data: companyUserResponse } = response;
      const { failure } = companyUserResponse as DeleteResponse;
      if (failure?.length > 0) {
        navigate(ERROR_ROUTES.UNEXPECTED);
      }
    },
  });
};
