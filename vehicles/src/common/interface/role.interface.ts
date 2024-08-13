import { Role } from '../enum/roles.enum';
import {
  ClientUserAuthGroup,
  IDIRUserAuthGroup,
} from '../enum/user-auth-group.enum';

/**
 * The permission matrix config props.
 */
export interface IRole {
  /**
   * The idir auth roles that are allowed to see the component.
   *
   * If the user has one of the specified auth groups,
   * the component will render.
   */
  allowedIdirRoles?: readonly IDIRUserAuthGroup[];

  /**
   * The bceid auth roles that are allowed to see the component.
   *
   * If the user has one of the specified auth groups,
   * the component will render.
   */
  allowedBCeIDRoles?: readonly ClientUserAuthGroup[];

  /**
   * The collection of individual security claims that may be used
   * for additional consideration.
   *
   * If provided, the claim will be additionally checked on.
   */
  claims?: readonly Role[];
}
