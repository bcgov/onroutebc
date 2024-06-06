import { Role } from '../enum/roles.enum';
import { UserAuthGroup } from '../enum/user-auth-group.enum';

/**
 * Evaluates role criteria against a user's roles and authorization group.
 * For each object defining roles with 'allOf', 'oneOf', and/or 'userAuthGroup', it evaluates:
 *    - If 'userAuthGroup' is defined, the user must belong to it.
 *    - For 'allOf', the user must have all specified roles.
 *    - For 'oneOf', the user must have at least one of the specified roles.
 * If any role object's criteria are met (considering 'userAuthGroup' if defined), it returns true.
 * Throws an error if both 'allOf' and 'oneOf' are defined in a role object.
 * @userAuthGroup Optional array of userAuthGroup. Works in tandem with 'oneOf' or 'allOf'.
 * @oneOf Optional array of roles where any one role is sufficient.
 * @allOf Optional array of roles where all roles are required. Note: Only one of
 * `oneOf` or `allOf` should be specified at any given time.
 */
export interface IRole {
  userAuthGroup?: UserAuthGroup[] | readonly UserAuthGroup[];
  oneOf?: Role[];
  allOf?: Role[];
}
