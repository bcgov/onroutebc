/**
 * Returns a boolean indicating if the user has a given role.
 * @param roleToMatch The role to check for.
 * @returns A boolean indicating if the user has the given role.
 */
export const doesUserHaveRole = (roleToMatch: string) => {
  const userRolesInSession = JSON.parse(
    sessionStorage.getItem("onRoutebc.user.roles") as string
  );
  return Boolean(
    userRolesInSession.find((role: string) => role === roleToMatch)
  );
};
