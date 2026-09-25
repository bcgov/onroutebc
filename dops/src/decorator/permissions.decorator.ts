import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_KEY } from '@app/constants/dops.constant';
import { IPermissions } from '@app/interface/permissions.interface';

export const Permissions = (roles: IPermissions) =>
  SetMetadata(PERMISSIONS_KEY, roles);
