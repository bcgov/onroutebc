import { useContext } from "react";
import OnRouteBCContext from "./OnRouteBCContext";

/**
 * Returns a boolean indicating if the user has a given role.
 * @param userRoles The set of roles of the user.
 * @param requiredRole The role to check for.
 * @returns A boolean indicating if the user has the role to access a page.
 */
export const doesUserHaveRole = (
  userRoles: string[] | undefined,
  requiredRole: string | undefined
) => {
  return (
    userRoles &&
    requiredRole &&
    userRoles.length &&
    userRoles.includes(requiredRole)
  );
};

/**
 * Returns a boolean indicating if the user has a given role.
 * @param requiredRole The role to check for.
 * @returns A boolean indicating if the user has the role to access a page or feature.
 */
export const doesUserHaveRoleWithContext = (requiredRole: string | undefined) => {
  const { userRoles } = useContext(OnRouteBCContext);
  return (
    requiredRole &&
    userRoles &&
    userRoles.length &&
    userRoles.includes(requiredRole)
  );
};
