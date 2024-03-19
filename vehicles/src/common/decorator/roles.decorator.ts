import { SetMetadata } from '@nestjs/common';
import { Role } from '../enum/roles.enum';
import { IRole } from '../interface/role.interface';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[] | IRole[]) =>
  SetMetadata(ROLES_KEY, roles);
