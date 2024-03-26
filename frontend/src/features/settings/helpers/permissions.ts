import { ROLES, UserRolesType } from "../../../common/authentication/types";
import { DoesUserHaveRole } from "../../../common/authentication/util";
import { Nullable } from "../../../common/types/common";

/**
 * Determine whether or not a user can view/access suspend page/features given their roles.
 * @param userRoles Roles that a user have
 * @returns Whether or not the user can view the suspend page/features
 */
export const canViewSuspend = (
  userRoles?: Nullable<UserRolesType[]>,
): boolean => {
  return Boolean(
    DoesUserHaveRole(
      userRoles,
      ROLES.READ_SUSPEND,
    ),
  );
};

/**
 * Determine whether or not a user can update suspend flag given their roles.
 * @param userRoles Roles that a user have
 * @returns Whether or not the user can update suspend flag
 */
export const canUpdateSuspend = (
  userRoles?: Nullable<UserRolesType[]>,
): boolean => {
  return Boolean(
    DoesUserHaveRole(
      userRoles,
      ROLES.WRITE_SUSPEND,
    ),
  );
};

/**
 * Determine whether or not a user can view/access the settings tab given their roles.
 * @param userRoles Roles that a user have
 * @returns Whether or not the user can view the settings tab
 */
export const canViewSettingsTab = (
  userRoles?: Nullable<UserRolesType[]>,
): boolean => {
  // Need to update this check once Special Authorization and Credit Accounts tabs/features are added
  return canViewSuspend(userRoles)
    || canUpdateSuspend(userRoles);
};
