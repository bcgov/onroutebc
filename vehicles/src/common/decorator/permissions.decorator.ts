import { SetMetadata } from '@nestjs/common';
import { IPermissions } from '../interface/permissions.interface';
import { PERMISSIONS_KEY } from '../constants/api.constant';

export const Permissions = (permissions: IPermissions) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
