import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { useContext } from "react";

import { FIVE_MINUTES } from "../../../common/constants/constants";
import { BCeIDAuthGroup } from "../types/userManagement";
import { IDPS } from "../../../common/types/idp";
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
    setMigratedTPSClient,
  } = useContext(OnRouteBCContext);
  const { isAuthenticated, user: userFromToken } = useAuth();
  return useQuery({
    queryKey: ["userContext"],
    queryFn: getUserContext,
    cacheTime: 500,
    refetchOnMount: "always",
    onSuccess: (
      userContextResponseBody: BCeIDUserContextType | IDIRUserContextType,
    ) => {
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
        const {
          user,
          associatedCompanies,
          pendingCompanies,
          migratedTPSClient,
        } = userContextResponseBody as BCeIDUserContextType;
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
        if (migratedTPSClient?.clientNumber) {
          console.log("Before setting in context::", migratedTPSClient);
          setMigratedTPSClient?.(() => migratedTPSClient);
          // {
          //   "companyId": 102,
          //   "companyGUID": "B50E1574C1A944189BC661DED01345FB",
          //   "clientNumber": "B1-000007-007",
          //   "legalName": "Texasflood Trucking",
          //   "alternateName": null,
          //   "phone": "267-189-4484",
          //   "extension": null,
          //   "fax": null,
          //   "email": "gspoure4@mtv.com",
          //   "primaryContact": null,
          //   "mailingAddress": {
          //     "addressLine1": "325-1207 Douglas St",
          //     "addressLine2": null,
          //     "city": "Victoria",
          //     "postalCode": "V8W 2E7",
          //     "provinceCode": "BC",
          //     "countryCode": "CA"
          //   }
          // }
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
    onSuccess: (userRoles: string[] | null) => {
      setUserRoles?.(() => userRoles);
    },
    retry: true,
  });
};
