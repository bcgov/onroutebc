import { Role } from '../enum/roles.enum';

/**
 * Defines criteria for role checking.
 * @oneOf Optional array of roles where any one role is sufficient
 * @allOf Optional array of roles where all roles are required
 * Note: Only one of `oneOf` or `allOf` should be specified at any given time.
 */
export interface IRole {
  oneOf?: Role[];
  allOf?: Role[];
}
