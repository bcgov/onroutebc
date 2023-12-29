import { useContext } from "react";

import OnRouteBCContext from "./OnRouteBCContext";
import { Nullable, Optional } from "../types/common";
import {
  BCeIDUserAuthGroupType,
  IDIRUserAuthGroupType,
  IDIR_USER_AUTH_GROUP,
} from "./types";

/**
 * Returns a boolean indicating if the user has a given role.
 *
 * RATIONALE for this function:
 * In ProtectedRoutes Component, there is a number of hooks called and when trying
 * to use the DoesUserHaveRoleWithContext function, it throws a hook order bug as
 * the order of execution of hooks must not change as per the rules of hooks.
 *
 * Hence a separate function that does accept userRoles as a parameter.
 *
 * @param userRoles The set of roles of the user.
 * @param requiredRole The role to check for.
 * @returns A boolean indicating if the user has the role to access a page.
 */
export const DoesUserHaveRole = (
  userRoles: Nullable<string[]>,
  requiredRole: Optional<string>,
) => {
  return (
    requiredRole &&
    userRoles &&
    userRoles.length &&
    userRoles.includes(requiredRole)
  );
};

/**
 * Returns a boolean indicating if the user has a given role.
 * Uses the context for the userRoles.
 * @param requiredRole The role to check for.
 * @returns A boolean indicating if the user has the role to access a page or feature.
 */
export const DoesUserHaveRoleWithContext = (requiredRole: Optional<string>) => {
  const { userRoles } = useContext(OnRouteBCContext);
  return (
    requiredRole &&
    userRoles &&
    userRoles.length &&
    userRoles.includes(requiredRole)
  );
};

/**
 * Returns a boolean indicating if the user has the necessary auth group.
 *
 * @returns A boolean indicating if the user has the auth group to access a page.
 */
export function DoesUserHaveAuthGroup<
  T extends IDIRUserAuthGroupType | BCeIDUserAuthGroupType,
>({
  userAuthGroup,
  allowedAuthGroups = [],
}: {
  /**
   * The auth group the logged in user belongs to.
   */
  userAuthGroup: Optional<T>;
  /**
   * The auth groups that is required to allow a certain action.
   * If not provided, the default check is against the IDIR System Admin.
   */
  allowedAuthGroups?: T[];
}) {
  return (
    userAuthGroup &&
    (userAuthGroup === IDIR_USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR ||
      allowedAuthGroups.includes(userAuthGroup))
  );
}
