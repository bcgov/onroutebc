import { SetMetadata } from '@nestjs/common';
import { Claim } from '../enum/claims.enum';
import { IRole } from '../interface/role.interface';
import { PERMISSIONS_KEY } from '../constants/dops.constant';
import { IPermissions } from '../interface/permissions.interface';

export const Permissions = (...roles: Claim[] | IRole[]| IPermissions[]) =>
  SetMetadata(PERMISSIONS_KEY, roles);
