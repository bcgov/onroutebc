import { SetMetadata } from '@nestjs/common';
import { IRole } from '../interface/role.interface';

export const ROLES_KEY = 'roles';
export const Roles = (roles: IRole) => SetMetadata(ROLES_KEY, roles);
