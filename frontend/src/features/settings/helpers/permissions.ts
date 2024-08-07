import { Nullable } from "../../../common/types/common";
import { DoesUserHaveAuthGroup, DoesUserHaveRole } from "../../../common/authentication/util";
import {
  BCeIDUserAuthGroupType,
  BCeID_USER_AUTH_GROUP,
  IDIRUserAuthGroupType,
  IDIR_USER_AUTH_GROUP,
  ROLES,
  USER_AUTH_GROUP,
  UserAuthGroupType,
  UserRolesType,
} from "../../../common/authentication/types";

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

const READ_SPECIAL_AUTH_ALLOWED_GROUPS = [
  USER_AUTH_GROUP.PPC_CLERK,
  USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR,
  // USER_AUTH_GROUP.TRAINEE,
  USER_AUTH_GROUP.FINANCE,
  USER_AUTH_GROUP.CTPO,
  USER_AUTH_GROUP.ENFORCEMENT_OFFICER,
  USER_AUTH_GROUP.HQ_ADMINISTRATOR,
  USER_AUTH_GROUP.PERMIT_APPLICANT,
  USER_AUTH_GROUP.COMPANY_ADMINISTRATOR,
] as UserAuthGroupType[];

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
  return (
    userAuthGroup && READ_SPECIAL_AUTH_ALLOWED_GROUPS.includes(userAuthGroup)
  ) || Boolean(
    DoesUserHaveRole(
      userRoles,
      ROLES.READ_NOFEE,
    ),
  ) || canUpdateNoFeePermitsFlag(userRoles, userAuthGroup);
};

export const canUpdateLCVFlag = (
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

export const canViewLCVFlag = (
  userRoles?: Nullable<UserRolesType[]>,
  userAuthGroup?: Nullable<UserAuthGroupType>,
): boolean => {
  return (
    userAuthGroup && READ_SPECIAL_AUTH_ALLOWED_GROUPS.includes(userAuthGroup)
  ) || Boolean(
    DoesUserHaveRole(
      userRoles,
      ROLES.READ_LCV_FLAG,
    ),
  ) || canUpdateLCVFlag(userRoles, userAuthGroup);
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
  // Note that FIN is not allowed by view LOA
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
  return (
    userAuthGroup && READ_SPECIAL_AUTH_ALLOWED_GROUPS.includes(userAuthGroup)
  ) || canViewNoFeePermitsFlag(userRoles, userAuthGroup)
    || canViewLCVFlag(userRoles, userAuthGroup)
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
    || canViewSpecialAuthorizations(userRoles)
    || canViewCreditAccountTab(userRoles);
};

/**
 * Determine whether or not a user can view/access credit account page/features given their roles.
 * @param userRoles Roles that a user have
 * @returns Whether or not the user can view the credit account page/features
 */
export const canViewCreditAccountTab = (
  userRoles?: Nullable<UserRolesType[]>,
): boolean => {
  return Boolean(DoesUserHaveRole(userRoles, ROLES.READ_CREDIT_ACCOUNT));
};

/**
 * Determine whether or not a user can view CreditAccountDetails component showing available balance, credit limit etc.
 * @param userRoles Roles that a user have
 * @returns Whether or not the user can view the CreditAccountDetails component
 */
export const canViewCreditAccountDetails = (
  userAuthGroup?: BCeIDUserAuthGroupType | IDIRUserAuthGroupType,
): boolean => {
  return Boolean(
    DoesUserHaveAuthGroup({
      userAuthGroup: userAuthGroup,
      allowedAuthGroups: [
        BCeID_USER_AUTH_GROUP.COMPANY_ADMINISTRATOR,
        IDIR_USER_AUTH_GROUP.SYSTEM_ADMINISTRATOR,
        IDIR_USER_AUTH_GROUP.FINANCE,
      ],
    }),
  );
};

/**
 * Determine whether or not a user can add/remove users from and hold/remove credit accounts.
 * @param userRoles Roles that a user have
 * @returns Whether or not the user can update the credit account
 */
export const canUpdateCreditAccount = (
  userRoles?: Nullable<UserRolesType[]>,
): boolean => {
  return Boolean(DoesUserHaveRole(userRoles, ROLES.WRITE_CREDIT_ACCOUNT));
};
