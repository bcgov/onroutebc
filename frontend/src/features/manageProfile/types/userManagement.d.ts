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
export type ReadCompanyUser = {
  firstName: string;
  lastName: string;
  phone1: string;
  phone2: string;
  fax: string;
  email: string;
  city: string;
  userGUID: string;
  userAuthGroup: BCeIDAuthGroup;
  statusCode: BCeIDUserStatus;
  userName: string;
  phone1Extension: string;
  phone2Extension: string;
  provinceCode: string;
  countryCode: string;
};

/**
 * 
 */
export type BCeIDAddUserRequest = {
  userName: string;
  userAuthGroup: BCeIDAuthGroup;
}

