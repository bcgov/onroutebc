import { Claim } from '../enum/claims.enum';
import { UserRole } from '../enum/user-role.enum';

/**
 * Evaluates role criteria against a user's roles and authorization group.
 * For each object defining roles with 'allOf', 'oneOf', and/or 'userRole', it evaluates:
 *    - If 'userRole' is defined, the user must belong to it.
 *    - For 'allOf', the user must have all specified roles.
 *    - For 'oneOf', the user must have at least one of the specified roles.
 * If any role object's criteria are met (considering 'userRole' if defined), it returns true.
 * Throws an error if both 'allOf' and 'oneOf' are defined in a role object.
 * @userRole Optional array of userRole. Works in tandem with 'oneOf' or 'allOf'.
 * @oneOf Optional array of roles where any one role is sufficient.
 * @allOf Optional array of roles where all roles are required. Note: Only one of
 * `oneOf` or `allOf` should be specified at any given time.
 */
export interface IRole {
  userRole?: UserRole[] | readonly UserRole[];
  oneOf?: Claim[];
  allOf?: Claim[];
}
