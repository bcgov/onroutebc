import { UserInformation } from "./manageProfile";

/**
 * The types of user auth groups for BCeID users.
 */
export enum BCeIDAuthGroup {
  PUBLIC = "PUBLIC",
  CVCLIENT = "CVCLIENT",
  ORGADMIN = "ORGADMIN",
}

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
}

