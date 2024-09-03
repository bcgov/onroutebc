import { Claim } from '../enum/claims.enum';
import { ClientUserRole, IDIRUserRole } from '../enum/user-role.enum';

/**
 * The permission configuration for endpoints.
 */
export interface IPermissions {
  /**
   * The idir auth roles that are allowed to perform an action.
   *
   * If the user has one of the specified roles,
   * the action will be allowed.
   */
  allowedIdirRoles?: IDIRUserRole[];

  /**
   * The bceid auth roles that are allowed to perform an action.
   *
   * If the user has one of the specified roles,
   * the action will be allowed.
   */
  allowedBCeIDRoles?: ClientUserRole[];

  /**
   * The collection of individual security claims that may be used
   * for additional consideration.
   *
   * If provided, the claim will be additionally checked on.
   * If neither `allowedBCeIDRoles` nor `allowedIdirRoles` is provided,
   * claims will be exclusively checked for deciding whether the user
   * is allowed to perform this action.
   */
  claim?: Claim;
}
