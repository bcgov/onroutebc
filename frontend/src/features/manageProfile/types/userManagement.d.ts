import { UserInformation } from "./manageProfile";

/**
 * All user auth groups
 */
export const USER_AUTH_GROUP = {
  ANONYMOUS: "ANONYMOUS",
  CVCLIENT: "CVCLIENT",
  IDIRBASIC: "IDIRBASIC",
  ORGADMIN: "ORGADMIN",
  PPCCLERK: "PPCCLERK",
  PUBLIC: "PUBLIC",
  SYSADMIN: "SYSADMIN",
  EOFFICER: "EOFFICER",
} as const;

export type UserAuthGroup =
  (typeof USER_AUTH_GROUP)[keyof typeof USER_AUTH_GROUP];

/**
 * The types of user auth groups for BCeID users.
 */
export const BCEID_AUTH_GROUP = {
  PUBLIC: USER_AUTH_GROUP.PUBLIC,
  CVCLIENT: USER_AUTH_GROUP.CVCLIENT,
  ORGADMIN: USER_AUTH_GROUP.ORGADMIN,
} as const;

export type BCeIDAuthGroup =
  (typeof BCEID_AUTH_GROUP)[keyof typeof BCEID_AUTH_GROUP];

/**
 * The types of user statuses for BCeID users.
 */
export enum BCeIDUserStatus {
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
  PENDING = "PENDING",
}

/**
 * Company User object response from the GET API.
 */
export interface ReadCompanyUser extends UserInformation {
  userAuthGroup: BCeIDAuthGroup;
  createdDateTime: string;
  updatedDateTime: string;
}

/**
 * The BCeID add user request object.
 */
export type BCeIDAddUserRequest = {
  userName: string;
  userAuthGroup: BCeIDAuthGroup;
};
