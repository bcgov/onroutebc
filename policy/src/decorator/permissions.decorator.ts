import { SetMetadata } from '@nestjs/common';
import { IPermissions } from '../interface/permissions.interface';
import { PERMISSIONS_KEY } from '../constants/policy.constants';

export const Permissions = (roles: IPermissions) =>
  SetMetadata(PERMISSIONS_KEY, roles);
