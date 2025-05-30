import {
  IDIR_USER_ROLE,
  UserRoleType,
} from "../../../common/authentication/types";
import { Nullable } from "../../../common/types/common";
import {
  PERMIT_APPLICATION_ORIGINS,
  PermitApplicationOrigin,
} from "../types/PermitApplicationOrigin";

/**
 * Determine whether or not a given user can access/delete an application.
 * @param permitApplicationOrigin Permit application origin
 * @param role Role of the logged in user
 * @returns Whether or not the user can access/delete the application.
 */
export const canUserAccessApplication = (
  permitApplicationOrigin?: Nullable<PermitApplicationOrigin>,
  role?: Nullable<UserRoleType>,
) => {
  if (!role) return false;

  // CV/PA can only access/delete applications whose origins are not "PPC"
  // Staff can access/delete any application they have access to (including each others')
  return (
    permitApplicationOrigin !== PERMIT_APPLICATION_ORIGINS.PPC ||
    (Object.values(IDIR_USER_ROLE) as UserRoleType[]).includes(role)
  );
};
