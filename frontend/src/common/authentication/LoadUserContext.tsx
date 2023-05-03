import { useQueries, useQuery } from "@tanstack/react-query";
import {
  useUserContext,
  useUserRolesByCompanyId,
} from "../../features/manageProfile/apiManager/hooks";
import { useContext } from "react";
import OnRouteBCContext, { UserDetailContext } from "./OnRouteBCContext";
import {
  getUserContext,
  getUserRolesByCompanyId,
} from "../../features/manageProfile/apiManager/manageProfileAPI";
import { UserContextType } from "./types";
import { FIVE_MINUTES } from "../constants/constants";

/*
 * A simple component that merely calls a react query hook.
 * Why do we need this?
 * React Hooks rules do not allow conditional execution of hooks since the react DOM
 * needs to know the order of execution of hooks per component.
 *
 * UserRolesByCompany is relevant only after the user has logged in and the companyId is set
 * and hence only has to be executed after the conditions are met.
 */
export const LoadUserContext = () => {
//   const { setCompanyId, setUserDetails, setUserRoles } =
//     useContext(OnRouteBCContext);
//   const { data: userContextData } = useQuery({
//     queryKey: ["userContext"],
//     queryFn: getUserContext,
//     cacheTime: 500,
//     refetchOnMount: "always",
//     onSuccess: (userContextResponseBody: UserContextType) => {
//       const { user, associatedCompanies } = userContextResponseBody;
//       if (user?.userGUID) {
//         setCompanyId?.(() => companyId);

//         const userDetails = {
//           firstName: user.firstName,
//           lastName: user.lastName,
//           userName: user.userName,
//           phone1: user.phone1,
//           phone1Extension: user.phone1Extension,
//           phone2: user.phone2,
//           phone2Extension: user.phone2Extension,
//           email: user.email,
//           fax: user.fax,
//         } as UserDetailContext;
//         setUserDetails?.(() => userDetails);

//         const userContextSessionObject = {
//           companyId,
//           ...userDetails,
//         };

//         // Switch to a react context when implementing multiple companies.
//         // We currently don't need a dedicated react context.
//         // Session Storage works alright as there is no leakage of information
//         // than what is already displayed to the user.
//         sessionStorage.setItem(
//           "onRoutebc.user.context",
//           JSON.stringify(userContextSessionObject)
//         );
//       }
//     },
//     retry: false,
//   });

//   useQuery({
//     queryKey: ["userRoles"],
//     refetchInterval: FIVE_MINUTES,
//     queryFn: getUserRolesByCompanyId,
//     onSuccess: (userRolesResponseBody: string[]) => {
//       setUserRoles?.(() => userRolesResponseBody);
//     },
//     retry: true,
//     enabled: !!userContextData?.associatedCompanies[0]?.companyId,
//   });
    useUserContext();
    // useUserRolesByCompanyId();
  return null;
};
