import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_KEY } from '../constants/dops.constant';
import { IPermissions } from '../interface/permissions.interface';

export const Permissions = (roles: IPermissions) =>
  SetMetadata(PERMISSIONS_KEY, roles);
