import { Role } from '../enum/roles.enum';

export interface IRole {
  oneOf?: Role[];
  allOf?: Role[];
}
