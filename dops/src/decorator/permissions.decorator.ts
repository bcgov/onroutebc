import { SetMetadata } from '@nestjs/common';
import { Claim } from '../enum/claims.enum';
import { IRole } from '../interface/role.interface';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...roles: Claim[] | IRole[]) =>
  SetMetadata(PERMISSIONS_KEY, roles);
