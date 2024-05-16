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

export const canUpdateNoFeePermitsFlag = (
  userRoles?: Nullable<UserRolesType[]>,
): boolean => {
  return Boolean(
    DoesUserHaveRole(
      userRoles,
      ROLES.WRITE_NOFEE,
    ),
  );
};

export const canViewNoFeePermitsFlag = (
  userRoles?: Nullable<UserRolesType[]>,
): boolean => {
  return Boolean(
    DoesUserHaveRole(
      userRoles,
      ROLES.READ_NOFEE,
    ),
  ) || canUpdateNoFeePermitsFlag(userRoles);
};

export const canUpdateLCAFlag = (
  userRoles?: Nullable<UserRolesType[]>,
): boolean => {
  return Boolean(
    DoesUserHaveRole(
      userRoles,
      ROLES.WRITE_LCV_FLAG,
    ),
  );
};

export const canViewLCAFlag = (
  userRoles?: Nullable<UserRolesType[]>,
): boolean => {
  return Boolean(
    DoesUserHaveRole(
      userRoles,
      ROLES.READ_LCV_FLAG,
    ),
  ) || canUpdateLCAFlag(userRoles);
};

export const canUpdateLOA = (
  userRoles?: Nullable<UserRolesType[]>,
): boolean => {
  return Boolean(
    DoesUserHaveRole(
      userRoles,
      ROLES.WRITE_LOA,
    ),
  );
};

export const canViewLOA = (
  userRoles?: Nullable<UserRolesType[]>,
): boolean => {
  return Boolean(
    DoesUserHaveRole(
      userRoles,
      ROLES.READ_LOA,
    ),
  ) || canUpdateLOA(userRoles);
};

export const canViewSpecialAuthorizations = (
  userRoles?: Nullable<UserRolesType[]>,
): boolean => {
  return canViewNoFeePermitsFlag(userRoles)
    || canViewLCAFlag(userRoles)
    || canViewLOA(userRoles)
    || Boolean(
      DoesUserHaveRole(
        userRoles,
        ROLES.READ_SPECIAL_AUTH,
      )
    ) || true;//
};

/**
 * Determine whether or not a user can view/access the settings tab given their roles.
 * @param userRoles Roles that a user have
 * @returns Whether or not the user can view the settings tab
 */
export const canViewSettingsTab = (
  userRoles?: Nullable<UserRolesType[]>,
): boolean => {
  // Need to update this check once Credit Accounts tabs/features are added
  return canViewSuspend(userRoles)
    || canUpdateSuspend(userRoles)
    || canViewSpecialAuthorizations(userRoles);
};
