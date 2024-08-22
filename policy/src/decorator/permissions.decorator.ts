import { SetMetadata } from '@nestjs/common';
import { Claim } from '../enum/claims.enum';
import { IRole } from '../interface/role.interface';
import { IPermissions } from '../interface/permissions.interface';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...roles: Claim[] | IRole[] | IPermissions[]) =>
  SetMetadata(PERMISSIONS_KEY, roles);
