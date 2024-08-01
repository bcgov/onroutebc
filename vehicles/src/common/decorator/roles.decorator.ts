import { SetMetadata } from '@nestjs/common';
import { Role } from '../enum/roles.enum';
import { IRole } from '../interface/role.interface';
import { PermissionMatrixConfigObject } from '../playground/permission-matrix';

export const ROLES_KEY = 'roles';
export const Roles = (roles: Role[] | IRole[] | PermissionMatrixConfigObject) =>
  SetMetadata(ROLES_KEY, roles);
