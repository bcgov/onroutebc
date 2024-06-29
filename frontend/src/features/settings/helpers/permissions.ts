import { ROLES, USER_AUTH_GROUP, UserAuthGroupType, UserRolesType } from "../../../common/authentication/types";
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
  userAuthGroup?: Nullable<UserAuthGroupType>,
): boolean => {
  const allowedAuthGroups = [
    USER_AUTH_GROUP.HQ_ADMINISTRATOR,
    USER_AUTH_GROUP.FINANCE,
    USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR,
  ] as UserAuthGroupType[];

  return (
    userAuthGroup && allowedAuthGroups.includes(userAuthGroup)
  ) || Boolean(
    DoesUserHaveRole(
      userRoles,
      ROLES.WRITE_NOFEE,
    ),
  );
};

export const canViewNoFeePermitsFlag = (
  userRoles?: Nullable<UserRolesType[]>,
  userAuthGroup?: Nullable<UserAuthGroupType>,
): boolean => {
  const allowedAuthGroups = [
    USER_AUTH_GROUP.HQ_ADMINISTRATOR,
    USER_AUTH_GROUP.FINANCE,
    USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR,
  ] as UserAuthGroupType[];

  return (
    userAuthGroup && allowedAuthGroups.includes(userAuthGroup)
  ) || Boolean(
    DoesUserHaveRole(
      userRoles,
      ROLES.READ_NOFEE,
    ),
  ) || canUpdateNoFeePermitsFlag(userRoles, userAuthGroup);
};

export const canUpdateLCAFlag = (
  userRoles?: Nullable<UserRolesType[]>,
  userAuthGroup?: Nullable<UserAuthGroupType>,
): boolean => {
  return (
    userAuthGroup === USER_AUTH_GROUP.HQ_ADMINISTRATOR
  ) || Boolean(
    DoesUserHaveRole(
      userRoles,
      ROLES.WRITE_LCV_FLAG,
    ),
  );
};

export const canViewLCAFlag = (
  userRoles?: Nullable<UserRolesType[]>,
  userAuthGroup?: Nullable<UserAuthGroupType>,
): boolean => {
  return (
    userAuthGroup === USER_AUTH_GROUP.HQ_ADMINISTRATOR
  ) || Boolean(
    DoesUserHaveRole(
      userRoles,
      ROLES.READ_LCV_FLAG,
    ),
  ) || canUpdateLCAFlag(userRoles, userAuthGroup);
};

export const canUpdateLOA = (
  userRoles?: Nullable<UserRolesType[]>,
  userAuthGroup?: Nullable<UserAuthGroupType>,
): boolean => {
  const allowedAuthGroups = [
    USER_AUTH_GROUP.HQ_ADMINISTRATOR,
    USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR,
  ] as UserAuthGroupType[];

  return (
    userAuthGroup && allowedAuthGroups.includes(userAuthGroup)
  ) || Boolean(
    DoesUserHaveRole(
      userRoles,
      ROLES.WRITE_LOA,
    ),
  );
};

export const canViewLOA = (
  userRoles?: Nullable<UserRolesType[]>,
  userAuthGroup?: Nullable<UserAuthGroupType>,
): boolean => {
  const allowedAuthGroups = [
    USER_AUTH_GROUP.PPC_CLERK,
    USER_AUTH_GROUP.CTPO,
    USER_AUTH_GROUP.ENFORCEMENT_OFFICER,
    // USER_AUTH_GROUP.TRAINEE,
    USER_AUTH_GROUP.HQ_ADMINISTRATOR,
    USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR,
    USER_AUTH_GROUP.COMPANY_ADMINISTRATOR,
    USER_AUTH_GROUP.PERMIT_APPLICANT,
  ] as UserAuthGroupType[];

  return (
    userAuthGroup && allowedAuthGroups.includes(userAuthGroup)
  ) || Boolean(
    DoesUserHaveRole(
      userRoles,
      ROLES.READ_LOA,
    ),
  ) || canUpdateLOA(userRoles, userAuthGroup);
};

export const canViewSpecialAuthorizations = (
  userRoles?: Nullable<UserRolesType[]>,
  userAuthGroup?: Nullable<UserAuthGroupType>,
): boolean => {
  const allowedAuthGroups = [
    USER_AUTH_GROUP.PPC_CLERK,
    USER_AUTH_GROUP.CTPO,
    USER_AUTH_GROUP.ENFORCEMENT_OFFICER,
    USER_AUTH_GROUP.FINANCE,
    // USER_AUTH_GROUP.TRAINEE,
    USER_AUTH_GROUP.HQ_ADMINISTRATOR,
    USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR,
    USER_AUTH_GROUP.COMPANY_ADMINISTRATOR,
    USER_AUTH_GROUP.PERMIT_APPLICANT,
  ] as UserAuthGroupType[];

  return (
    userAuthGroup && allowedAuthGroups.includes(userAuthGroup)
  ) || canViewNoFeePermitsFlag(userRoles, userAuthGroup)
    || canViewLCAFlag(userRoles, userAuthGroup)
    || canViewLOA(userRoles, userAuthGroup)
    || Boolean(
      DoesUserHaveRole(
        userRoles,
        ROLES.READ_SPECIAL_AUTH,
      )
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
  // Need to update this check once Credit Accounts tabs/features are added
  return canViewSuspend(userRoles)
    || canUpdateSuspend(userRoles)
    || canViewSpecialAuthorizations(userRoles);
};
