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
  return Boolean(DoesUserHaveRole(userRoles, ROLES.READ_SUSPEND));
};

/**
 * Determine whether or not a user can update suspend flag given their roles.
 * @param userRoles Roles that a user have
 * @returns Whether or not the user can update suspend flag
 */
export const canUpdateSuspend = (
  userRoles?: Nullable<UserRolesType[]>,
): boolean => {
  return Boolean(DoesUserHaveRole(userRoles, ROLES.WRITE_SUSPEND));
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
  return canViewSuspend(userRoles) || canUpdateSuspend(userRoles);
};

/**
 * Determine whether or not a user can view/access credit account page/features given their roles.
 * @param userRoles Roles that a user have
 * @returns Whether or not the user can view the credit account page/features
 */
export const canViewCreditAccount = (
  userRoles?: Nullable<UserRolesType[]>,
): boolean => {
  return Boolean(DoesUserHaveRole(userRoles, ROLES.READ_CREDIT_ACCOUNT));
};

/**
 * Determine whether or not a user can add/remove users from and hold/remove credit accounts.
 * @param userRoles Roles that a user have
 * @returns Whether or not the user can update the credit account
 */
export const canUpdateCreditAccount = (
  // eslint-disable-next-line
  userRoles?: Nullable<UserRolesType[]>,
): boolean => {
  return true;
  // return Boolean(
  //   DoesUserHaveRole(
  //     userRoles,
  //     ROLES.WRITE_CREDIT_ACCOUNT,
  //   ),
  // );
};
