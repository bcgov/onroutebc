import { useContext } from "react";

import OnRouteBCContext from "./OnRouteBCContext";
import { Nullable, Optional } from "../types/common";
import {
  BCeIDUserRoleType,
  IDIRUserRoleType,
  IDIR_USER_ROLE,
  UserClaimsType,
} from "./types";

/**
 * Returns a boolean indicating if the user has a given claim.
 *
 * RATIONALE for this function:
 * In AuthWall Components, there is a number of hooks called and when trying
 * to use the DoesUserHaveRoleWithContext function, it throws a hook order bug as
 * the order of execution of hooks must not change as per the rules of hooks.
 *
 * Hence a separate function that does accept userClaims as a parameter.
 *
 * @param userClaims The set of claims of the user.
 * @param requiredClaim The claim to check for.
 * @returns A boolean indicating if the user has the claim to access a page.
 */
export const DoesUserHaveClaim = (
  userClaims: Nullable<string[]>,
  requiredClaim: Optional<string>,
) => {
  return requiredClaim && userClaims?.includes(requiredClaim);
};

/**
 * Returns a boolean indicating if the user has a given claim.
 * Uses the context for the userclaims.
 * @param requiredClaim The claim to check for.
 * @returns A boolean indicating if the user has the claim to access a page or feature.
 */
export const DoesUserHaveClaimWithContext = (
  requiredClaim: Optional<UserClaimsType>,
) => {
  const { userClaims } = useContext(OnRouteBCContext);
  return requiredClaim && userClaims?.includes(requiredClaim);
};

/**
 * Returns a boolean indicating if the user has the necessary role.
 *
 * @returns A boolean indicating if the user has the role to access a page.
 */
export function DoesUserHaveRole<
  T extends IDIRUserRoleType | BCeIDUserRoleType,
>({
  userRole,
  allowedRoles = [],
}: {
  /**
   * The role the logged in user belongs to.
   */
  userRole: Optional<T>;
  /**
   * The role that is required to allow a certain action.
   * If not provided, the default check is against the IDIR System Admin.
   */
  allowedRoles?: T[];
}) {
  return (
    userRole &&
    (userRole === IDIR_USER_ROLE.SYSTEM_ADMINISTRATOR ||
      allowedRoles.includes(userRole))
  );
}
