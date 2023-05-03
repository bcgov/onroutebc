import { useContext } from "react";
import OnRouteBCContext from "./OnRouteBCContext";

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
