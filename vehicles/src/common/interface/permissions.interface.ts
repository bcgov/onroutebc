import { Claim } from '../enum/claims.enum';
import { ClientUserRole, IDIRUserRole } from '../enum/user-auth-group.enum';

/**
 * The permission configuration for endpoints.
 */
export interface IPermissions {
  /**
   * The idir auth roles that are allowed to see the component.
   *
   * If the user has one of the specified auth groups,
   * the component will render.
   */
  allowedIdirRoles?: readonly IDIRUserRole[];

  /**
   * The bceid auth roles that are allowed to see the component.
   *
   * If the user has one of the specified auth groups,
   * the component will render.
   */
  allowedBCeIDRoles?: readonly ClientUserRole[];

  /**
   * The collection of individual security claims that may be used
   * for additional consideration.
   *
   * If provided, the claim will be additionally checked on.
   */
  claims?: readonly Claim[];
}
