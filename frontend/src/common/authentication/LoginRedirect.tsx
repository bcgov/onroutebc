import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

import { BCeIDUserContextType, DIRECTORY, IDIRUserContextType } from "./types";
import { Loading } from "../pages/Loading";
import { IDPS } from "../types/idp";
import { Optional } from "../types/common";
import {
  APPLICATIONS_ROUTES,
  CREATE_PROFILE_WIZARD_ROUTES,
  ERROR_ROUTES,
  IDIR_ROUTES,
} from "../../routes/constants";

import {
  useUserContext,
  useUserContextQuery,
} from "../../features/manageProfile/apiManager/hooks";
import { getDefaultRequiredVal } from "../helpers/util";
import { usePermissionMatrix } from "./PermissionMatrix";

/**
 * Function to determine where to take a basic bceid user.
 * @param userContextData - User context data from the query client.
 * @returns The route path to take the user to.
 */
const navigateBasicBCeID = (
  userContextData: BCeIDUserContextType,
): string | undefined => {
  const { associatedCompanies, pendingCompanies, unclaimedClient, user } =
    userContextData;

  const isAssociatedSuspended = getDefaultRequiredVal(
    [],
    associatedCompanies,
  ).find((company) => Boolean(company.isSuspended));

  const isPendingSuspended = getDefaultRequiredVal([], pendingCompanies).find(
    (company) => Boolean(company.isSuspended),
  );

  // If the user does not exist
  if (!user?.userGUID) {
    // The user has been invited to a company.
    // Invited user gets the highest priority.
    if (pendingCompanies?.length > 0) {
      // If there is no business GUID in the user token, then the user is
      // a basic bceid user.
      // A basic bceid user cannot be a user of a company whose directory is BBCEID.
      // This is an attempt to cross mix basic and business bceid users which is not allowed.
      if (pendingCompanies[0].directory === DIRECTORY.BBCEID) {
        // TODO Error page to include message asking user to contact PPC.
        return ERROR_ROUTES.UNAUTHORIZED;
      }

      // If the execution reaches here, this is a valid invite situation.
      // Redirect the user to the welcome page for user info wizard.
      return CREATE_PROFILE_WIZARD_ROUTES.WELCOME;
    }
    // The user and company do not exist.
    else if (associatedCompanies?.length < 1) {
      // If there is no unclaimedClient, this is a net new user.
      // We give them the option to create a new company or go through the challenge flow.
      if (!unclaimedClient?.clientNumber) {
        // Create new company or go through challenge flow.
        return CREATE_PROFILE_WIZARD_ROUTES.WELCOME;
      } else {
        if (unclaimedClient?.directory === DIRECTORY.BBCEID) {
          // Basic bceid cannot claim a company whose directory is BBCEID.
          // This covers the scenario where a company was migrated from TPS WEB.

          // TODO Error page to include message asking user to contact PPC.
          return ERROR_ROUTES.UNAUTHORIZED;
        }

        // There is an unclaimed client corresponding to the user.

        // Take the user to company profile wizard with
        // all the company info we have.

        // This covers the scenario where a staff created a company
        // and a basic bceid user has been invited to it.

        // In this case, since the company is unclaimed, we must show them
        // company profile wizard instead of user info wizard.
        // This is because, BE populates the company info into unclaimedClient
        // instead of pendingCompanies like in a regular invite scenario.
        return CREATE_PROFILE_WIZARD_ROUTES.WELCOME;
      }
    }
    /**
     * No challenge flow does not exist for a basic bceid user because
     * token does not contain business guid.
     */

    // Simply put, if !user and associatedCompanies.length > 0, get the guy out of here.
    else {
      return ERROR_ROUTES.UNAUTHORIZED;
    }
  }
  // The user exists but either the associated company or pending company is suspended
  else if (isAssociatedSuspended || isPendingSuspended) {
    return ERROR_ROUTES.SUSPENDED;
  }
  // The user and company exist
  else if (associatedCompanies?.length) {
    return APPLICATIONS_ROUTES.BASE;
  }
  // User exists but company does not exist. This is not a possible scenario.
  else if (!associatedCompanies?.length) {
    // Error Page
    return ERROR_ROUTES.UNAUTHORIZED;
  }

  // else if(pendingCompanies?.length) (i.e., user exists and has invites from a company)
  // is not a valid block currently because
  // one user can only be part of one company currently.
  // -----------------------------
};

/**
 * Function to determine where to take a business bceid user.
 * @param userContextData - User context data from the query client.
 * @param businessGuidFromUserToken - Business GUID from the user token.
 * @returns The route path to take the user to.
 */
const navigateBusinessBCeID = (
  userContextData: BCeIDUserContextType,
  businessGuidFromUserToken: string,
): string | undefined => {
  const { associatedCompanies, pendingCompanies, unclaimedClient, user } =
    userContextData;

  const isAssociatedSuspended = getDefaultRequiredVal(
    [],
    associatedCompanies,
  ).find((company) => Boolean(company.isSuspended));

  const isPendingSuspended = getDefaultRequiredVal([], pendingCompanies).find(
    (company) => Boolean(company.isSuspended),
  );

  // This function is meant to be called only if there is a
  // valid business guid in the token.
  if (!businessGuidFromUserToken) {
    return ERROR_ROUTES.UNAUTHORIZED;
  }

  // If the user does not exist
  if (!user?.userGUID) {
    // The user has been invited to a company.
    // Invited user gets the highest priority.
    if (pendingCompanies?.length > 0) {
      // If the user is a business bceid user, they can only be invited to a
      // company whose directory is BBCEID.
      // A business bceid user cannot be a user of a company whose directory is not BBCEID.
      // This is an attempt to cross mix basic and business bceid users which is not allowed.
      if (pendingCompanies[0].directory !== DIRECTORY.BBCEID) {
        // TODO Error page to include message asking user to contact PPC.
        return ERROR_ROUTES.UNAUTHORIZED;
      }

      // If the invited user's business GUID from the token does not match the company's guid,
      // then the user is unauthorized.
      // A business bceid user whose buisness guid does not match the company guid in the invite
      // cannot be a user of the inviting company.
      if (pendingCompanies[0].companyGUID !== businessGuidFromUserToken) {
        // TODO Error page to include message asking user to contact PPC.
        return ERROR_ROUTES.UNAUTHORIZED;
      }

      // If the execution reaches here, this is a valid invite situation.
      // Redirect the user to the welcome page for user info wizard.
      return CREATE_PROFILE_WIZARD_ROUTES.WELCOME;
    }
    // The user and company do not exist.
    else if (associatedCompanies?.length < 1) {
      // If there is no unclaimedClient, this is a net new user.
      // We give them the option to create a new company or go through the challenge flow.
      if (!unclaimedClient?.clientNumber) {
        return CREATE_PROFILE_WIZARD_ROUTES.WELCOME;
      } else {
        // The user does not exist but the business guid matches a migrated client.
        //    => Take them to no challenge workflow.
        return CREATE_PROFILE_WIZARD_ROUTES.WELCOME;
      }
    }
    // The user does not exist but there is one or more associated companies
    // due to business GUID match. This is an error scenario and the user is unauthorized.

    // Simply put, if !user and associatedCompanies.length > 0, get the guy out of here.
    else {
      return ERROR_ROUTES.UNAUTHORIZED;
    }
  }
  // The user exists but either the associated company or pending company is suspended
  else if (isAssociatedSuspended || isPendingSuspended) {
    return ERROR_ROUTES.SUSPENDED;
  }
  // The user and company exist
  else if (associatedCompanies?.length) {
    return APPLICATIONS_ROUTES.BASE;
  }
  // User exists but company does not exist. This is not a possible scenario.
  else if (!associatedCompanies?.length) {
    // Error Page
    return ERROR_ROUTES.UNAUTHORIZED;
  }

  // else if(pendingCompanies?.length) (i.e., user exists and has invites from a company)
  // is not a valid block currently because
  // one user can only be part of one company currently.
  // -----------------------------
};

// Code archive
// const navigateBCeID = (
//   userContextData: BCeIDUserContextType,
//   businessGuidFromUserToken: string,
// ): string | undefined => {
//   const {
//     associatedCompanies,
//     pendingCompanies,
//     unclaimedClient: migratedClient,
//     user,
//   } = userContextData;

//   const isAssociatedSuspended = getDefaultRequiredVal(
//     [],
//     associatedCompanies,
//   ).find((company) => Boolean(company.isSuspended));

//   const isPendingSuspended = getDefaultRequiredVal([], pendingCompanies).find(
//     (company) => Boolean(company.isSuspended),
//   );

//   // If the user does not exist
//   if (!user?.userGUID) {
//     // The user has been invited to a company.
//     // Invited user gets the highest priority.
//     if (pendingCompanies?.length > 0) {
//       // If there is no business GUID in the user token, then the user is
//       // a basic bceid user.
//       // A basic bceid user cannot be a user of a company whose directory is BBCEID.
//       // This is an attempt to cross mix basic and business bceid users which is not allowed.
//       if (
//         pendingCompanies[0].directory === DIRECTORY.BBCEID &&
//         !businessGuidFromUserToken
//       ) {
//         // TODO Error page to include message asking user to contact PPC.
//         return ERROR_ROUTES.UNAUTHORIZED;
//       }

//       // If the user is a business bceid user, they can only be invited to a
//       // company whose directory is BBCEID.
//       // A business bceid user cannot be a user of a company whose directory is not BBCEID.
//       // This is an attempt to cross mix basic and business bceid users which is not allowed.
//       if (
//         pendingCompanies[0].directory !== DIRECTORY.BBCEID &&
//         businessGuidFromUserToken
//       ) {
//         // TODO Error page to include message asking user to contact PPC.
//         return ERROR_ROUTES.UNAUTHORIZED;
//       }

//       // If the invited user's business GUID from the token does not match the company's guid,
//       // then the user is unauthorized.
//       // A business bceid user whose buisness guid does not match the company guid in the invite
//       // cannot be a user of the inviting company.
//       if (pendingCompanies[0].companyGUID !== businessGuidFromUserToken) {
//         // TODO Error page to include message asking user to contact PPC.
//         return ERROR_ROUTES.UNAUTHORIZED;
//       }

//       // If the execution reaches here, this is a valid invite situation.
//       // Redirect the user to the welcome page for user info wizard.
//       return CREATE_PROFILE_WIZARD_ROUTES.WELCOME;
//     }
//     // The user and company do not exist (not a migrated client)
//     //     => Redirect them to the welcome page with challenge.
//     else if (associatedCompanies?.length < 1 && !migratedClient?.clientNumber) {
//       return CREATE_PROFILE_WIZARD_ROUTES.WELCOME;
//     }
//     // The user does not exist but the business guid matches a migrated client.
//     //    => Take them to no challenge workflow.
//     else if (migratedClient?.clientNumber) {
//       return CREATE_PROFILE_WIZARD_ROUTES.WELCOME;
//     }
//     // The user does not exist but there is one or more associated companies
//     // due to business GUID match. This is an error scenario and the user is unauthorized.

//     // Simply put, if !user and associatedCompanies.length > 0, get the guy out of here.
//     else {
//       return ERROR_ROUTES.UNAUTHORIZED;
//     }
//   }
//   // The user exists but either the associated company or pending company is suspended
//   else if (isAssociatedSuspended || isPendingSuspended) {
//     return ERROR_ROUTES.SUSPENDED;
//   }
//   // The user and company exist
//   else if (associatedCompanies?.length) {
//     return APPLICATIONS_ROUTES.BASE;
//   }
//   // User exists but company does not exist. This is not a possible scenario.
//   else if (!associatedCompanies?.length) {
//     // Error Page
//     return ERROR_ROUTES.UNAUTHORIZED;
//   }

//   // else if(pendingCompanies?.length) (i.e., user exists and has invites from a company)
//   // is not a valid block currently because
//   // one user can only be part of one company currently.
//   // -----------------------------
// };

/*
 * Redirects user to their correct page after loading their
 * user and company info.
 */
export const LoginRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user: userFromToken } = useAuth();

  const {
    isPending,
    isError,
    data: userContextResponse,
  } = useUserContextQuery();
  const queryClient = useQueryClient();

  useUserContext(userContextResponse);

  const canViewApplicationQueue = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "STAFF_HOME_SCREEN",
      permissionMatrixFunctionKey: "VIEW_QUEUE",
    },
  });

  /**
   * Hook to determine where to navigate to.
   */
  useEffect(() => {
    if (isError) {
      return navigate(ERROR_ROUTES.UNEXPECTED);
    }

    if (isAuthenticated && !isPending) {
      const redirectURI = sessionStorage.getItem(
        "onrouteBC.postLogin.redirect",
      );
      if (redirectURI) {
        // Clean up sessionStorage of post login redirect link; we no longer need it.
        sessionStorage.removeItem("onrouteBC.postLogin.redirect");
        navigate(redirectURI);
      } else if (userFromToken?.profile?.identity_provider === IDPS.IDIR) {
        const userContextData: Optional<IDIRUserContextType> =
          queryClient.getQueryData<IDIRUserContextType>(["userContext"]);
        // only IDIR users with PC, SA, CTPO or TRAIN should redirect to STAFF_HOME
        if (canViewApplicationQueue) {
          navigate(IDIR_ROUTES.STAFF_HOME);
        } else if (userContextData?.user?.userGUID) {
          navigate(IDIR_ROUTES.WELCOME);
        } else {
          navigate(ERROR_ROUTES.UNAUTHORIZED);
        }
      } else {
        const userContextData: Optional<BCeIDUserContextType> =
          queryClient.getQueryData<BCeIDUserContextType>(["userContext"]);
        const businessGuidFromUserToken = userFromToken?.profile
          ?.bceid_business_guid as string;
        let to;
        if (businessGuidFromUserToken) {
          to = navigateBusinessBCeID(
            userContextData as BCeIDUserContextType,
            businessGuidFromUserToken,
          );
        } else {
          to = navigateBasicBCeID(userContextData as BCeIDUserContextType);
        }
        navigate(to ?? ERROR_ROUTES.UNEXPECTED);
      }
    }
  }, [isPending, isError, isAuthenticated, userFromToken]);

  if (isPending) {
    return <Loading />;
  }

  return <></>;
};
