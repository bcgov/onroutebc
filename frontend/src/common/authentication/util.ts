import { useContext } from "react";

import OnRouteBCContext from "./OnRouteBCContext";
import { Nullable, Optional } from "../types/common";

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
export const isUserAuthorized = (
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
