import { SetMetadata } from '@nestjs/common';
import { Role } from '../enum/roles.enum';
import { IRole } from '../interface/role.interface';
import { IPermissions } from '../interface/permissions.interface';

export const ROLES_KEY = 'roles';
// Todo: Change IPermissions array to a single object when removing
// roles.
export const Roles = (...roles: Role[] | IRole[] | IPermissions[]) =>
  SetMetadata(ROLES_KEY, roles);
